import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Loader2, RotateCcw, Sun, Save, X, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { PolygonalBackground } from "@/components/PolygonalBackground";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import bbOwlLogo from "@/assets/bb-owl-new.png";

type Message = { role: "user" | "assistant"; content: string };
type CheckinMemory = {
  id: string;
  title: string;
  content: string;
  memory_date: string;
  summary: string | null;
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/daily-checkin-chat`;

const DailyCheckin = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [pastCheckins, setPastCheckins] = useState<CheckinMemory[]>([]);
  const [showPastCheckins, setShowPastCheckins] = useState(false);
  const [loadingPast, setLoadingPast] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user) {
      loadPastCheckins();
    }
  }, [user]);

  const loadPastCheckins = async () => {
    if (!user) return;
    setLoadingPast(true);
    try {
      const { data, error } = await supabase
        .from('memories')
        .select('id, title, content, memory_date, summary')
        .eq('user_id', user.id)
        .eq('memory_type', 'daily-checkin')
        .order('memory_date', { ascending: false })
        .limit(30);

      if (error) throw error;
      setPastCheckins(data || []);
    } catch (error) {
      console.error('Error loading past check-ins:', error);
    } finally {
      setLoadingPast(false);
    }
  };

  const streamChat = async (userMessages: Message[]) => {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ 
        messages: userMessages,
        userId: user?.id 
      }),
    });

    if (!resp.ok) {
      if (resp.status === 429) {
        throw new Error("Bitte warte einen Moment und versuche es erneut.");
      }
      if (resp.status === 402) {
        throw new Error("Service vorübergehend nicht verfügbar.");
      }
      throw new Error("Verbindung zu Oria fehlgeschlagen.");
    }

    if (!resp.body) throw new Error("Keine Antwort erhalten");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let assistantContent = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") break;

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantContent += content;
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant") {
                return prev.map((m, i) =>
                  i === prev.length - 1 ? { ...m, content: assistantContent } : m
                );
              }
              return [...prev, { role: "assistant", content: assistantContent }];
            });
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }
  };

  const startSession = async () => {
    setHasStarted(true);
    setIsLoading(true);

    try {
      await streamChat([{ role: "user", content: "Hallo, ich möchte meinen Daily Check-in machen." }]);
    } catch (error) {
      console.error("Start session error:", error);
      toast.error(error instanceof Error ? error.message : "Verbindungsfehler");
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      await streamChat(newMessages);
    } catch (error) {
      console.error("Send message error:", error);
      toast.error(error instanceof Error ? error.message : "Verbindungsfehler");
    } finally {
      setIsLoading(false);
    }
  };

  const resetSession = () => {
    if (messages.length > 2) {
      setShowSaveDialog(true);
    } else {
      setMessages([]);
      setHasStarted(false);
    }
  };

  const saveToVault = async () => {
    if (!user || !saveTitle.trim()) return;
    
    setIsSaving(true);
    try {
      const conversationContent = messages
        .map(m => `${m.role === 'user' ? 'Du' : 'Oria'}: ${m.content}`)
        .join('\n\n');
      
      // Extract core need from last assistant message if possible
      const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant');
      let summary = `Daily Check-in vom ${format(new Date(), 'dd.MM.yyyy', { locale: de })}`;
      
      if (lastAssistantMsg?.content.includes('Kernbedürfnis')) {
        const match = lastAssistantMsg.content.match(/Kernbedürfnis[:\s]+([^\n.]+)/i);
        if (match) {
          summary = `Kernbedürfnis: ${match[1].trim()}`;
        }
      }

      const { error } = await supabase.from('memories').insert({
        user_id: user.id,
        title: saveTitle.trim(),
        content: conversationContent,
        memory_type: 'daily-checkin',
        emotion: 'reflection',
        summary: summary,
        memory_date: new Date().toISOString()
      });

      if (error) throw error;

      toast.success("Check-in gespeichert! 💫");
      setShowSaveDialog(false);
      setSaveTitle("");
      setMessages([]);
      setHasStarted(false);
      loadPastCheckins();
    } catch (error) {
      console.error('Save to vault error:', error);
      toast.error("Speichern fehlgeschlagen");
    } finally {
      setIsSaving(false);
    }
  };

  const skipSave = () => {
    setShowSaveDialog(false);
    setSaveTitle("");
    setMessages([]);
    setHasStarted(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const groupCheckinsByMonth = () => {
    const groups: { [key: string]: CheckinMemory[] } = {};
    pastCheckins.forEach(checkin => {
      const date = new Date(checkin.memory_date);
      const monthKey = format(date, 'MMMM yyyy', { locale: de });
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(checkin);
    });
    return groups;
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col overflow-hidden">
      <Header />

      {/* Hero Section */}
      <section className="pt-14 pb-2 sm:pt-24 sm:pb-8 relative overflow-hidden shrink-0">
        <PolygonalBackground variant="hero" />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-background/80" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mb-1 sm:mb-4"
            >
              <Link
                to="/oria-apps"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-accent transition-colors touch-manipulation"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Zurück zu Oria Apps</span>
                <span className="sm:hidden">Zurück</span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-2 sm:gap-4"
            >
              <img
                src={bbOwlLogo}
                alt="Oria"
                className="h-6 sm:h-10 w-auto object-contain"
              />
              <h1 className="text-base sm:text-2xl md:text-3xl font-serif font-medium text-foreground">
                Daily Check-in
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-sm text-muted-foreground max-w-xl hidden sm:block mt-3"
            >
              Entdecke dein Bedürfnis des Tages mit dem Peeling the Onion Modell
            </motion.p>
          </div>
        </div>
      </section>

      {/* Chat Area */}
      <section className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-3 sm:px-6 pb-2 sm:pb-6 min-h-0 overflow-hidden">
        {!hasStarted ? (
          /* Welcome Screen */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex flex-col items-center justify-center text-center py-4 sm:py-8 px-2"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4 sm:mb-6">
              <Sun className="w-7 h-7 sm:w-8 sm:h-8 text-accent" />
            </div>
            <h2 className="text-lg sm:text-xl font-serif text-foreground mb-2 sm:mb-3">
              Dein täglicher Moment der Selbstfürsorge
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mb-4 sm:mb-6 leading-relaxed">
              In wenigen Minuten begleite ich dich sanft durch das "Peeling the Onion" Modell – 
              von der Oberfläche zu deinem Kernbedürfnis. Am Ende erhältst du einen Impuls für deinen Tag.
            </p>
            <p className="text-xs text-muted-foreground/70 max-w-sm mb-6 sm:mb-8 italic">
              Deine Check-ins kannst du im Tresor speichern und monatlich reflektieren.
            </p>
            <Button
              onClick={startSession}
              disabled={isLoading}
              className="bg-accent text-accent-foreground hover:bg-accent/90 text-base h-12 px-6 sm:px-8 touch-manipulation active:scale-95 transition-transform"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Verbinde...
                </>
              ) : (
                <>
                  <Sun className="w-5 h-5 mr-2" />
                  Check-in starten
                </>
              )}
            </Button>

            {/* Past Check-ins Section */}
            {user && pastCheckins.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 w-full max-w-md"
              >
                <button
                  onClick={() => setShowPastCheckins(!showPastCheckins)}
                  className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full py-2 touch-manipulation"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Vergangene Check-ins ({pastCheckins.length})</span>
                  {showPastCheckins ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showPastCheckins && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 space-y-4 max-h-64 overflow-y-auto"
                  >
                    {Object.entries(groupCheckinsByMonth()).map(([month, checkins]) => (
                      <div key={month}>
                        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 sticky top-0 bg-background py-1">
                          {month}
                        </h4>
                        <div className="space-y-2">
                          {checkins.map(checkin => (
                            <button
                              key={checkin.id}
                              onClick={() => navigate('/vault')}
                              className="w-full text-left p-3 bg-card rounded-lg border border-border hover:border-accent/50 transition-colors touch-manipulation"
                            >
                              <div className="flex justify-between items-start gap-2">
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-foreground truncate">{checkin.title}</p>
                                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{checkin.summary}</p>
                                </div>
                                <span className="text-xs text-muted-foreground shrink-0">
                                  {format(new Date(checkin.memory_date), 'dd.MM.', { locale: de })}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        ) : (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto py-3 sm:py-4 space-y-3 sm:space-y-4 min-h-0 overscroll-contain">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] sm:max-w-[85%] rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-accent text-accent-foreground rounded-br-md"
                        : "bg-card border border-border rounded-bl-md shadow-sm"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </p>
                  </div>
                </motion.div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="shrink-0 border-t border-border pt-3 sm:pt-4 pb-3 sm:pb-0 bg-background">
              <div className="flex gap-2 items-end">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={resetSession}
                  title="Neue Sitzung"
                  className="shrink-0 h-11 w-11 sm:h-10 sm:w-10 touch-manipulation active:scale-95 transition-transform"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <div className="flex-1 relative">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Schreibe hier..."
                    disabled={isLoading}
                    className="min-h-[48px] sm:min-h-[52px] max-h-32 resize-none pr-12 text-base sm:text-sm leading-relaxed"
                    rows={1}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="absolute right-1.5 bottom-1.5 h-9 w-9 sm:h-8 sm:w-8 bg-accent text-accent-foreground hover:bg-accent/90 touch-manipulation active:scale-95 transition-transform"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-md mx-4 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg">Check-in speichern?</DialogTitle>
            <DialogDescription className="text-sm">
              Speichere deinen Check-in im Tresor für die monatliche Reflexion.
            </DialogDescription>
          </DialogHeader>
          
          {user ? (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="save-title" className="text-sm font-medium">
                  Titel für deinen Check-in
                </label>
                <Input
                  id="save-title"
                  value={saveTitle}
                  onChange={(e) => setSaveTitle(e.target.value)}
                  placeholder={`Check-in ${format(new Date(), 'dd.MM.yyyy', { locale: de })}`}
                  className="w-full h-12 text-base"
                />
              </div>
            </div>
          ) : (
            <div className="py-4 text-sm text-muted-foreground">
              Bitte melde dich an, um Check-ins zu speichern.
            </div>
          )}

          <DialogFooter className="flex-col gap-2">
            <Button 
              variant="outline" 
              onClick={skipSave} 
              disabled={isSaving}
              className="w-full h-11 touch-manipulation"
            >
              <X className="w-4 h-4 mr-2" />
              Nicht speichern
            </Button>
            {user && (
              <Button 
                onClick={saveToVault} 
                disabled={!saveTitle.trim() || isSaving}
                className="w-full h-11 bg-accent text-accent-foreground hover:bg-accent/90 touch-manipulation"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Im Tresor speichern
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DailyCheckin;

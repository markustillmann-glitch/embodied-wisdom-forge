import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, Loader2, RotateCcw, Heart, Save, X } from "lucide-react";
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

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/resonanzradar-chat`;

const Resonanzradar = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        throw new Error("Rate limit exceeded. Please wait a moment.");
      }
      if (resp.status === 402) {
        throw new Error("Service temporarily unavailable.");
      }
      throw new Error("Failed to connect to Oria.");
    }

    if (!resp.body) throw new Error("No response body");

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
      // Send empty message to trigger the welcome prompt
      await streamChat([{ role: "user", content: "Hallo, ich möchte mit dem Resonanzradar beginnen." }]);
    } catch (error) {
      console.error("Start session error:", error);
      toast.error(error instanceof Error ? error.message : "Connection error");
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
      toast.error(error instanceof Error ? error.message : "Connection error");
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
      
      const { error } = await supabase.from('memories').insert({
        user_id: user.id,
        title: saveTitle.trim(),
        content: conversationContent,
        memory_type: 'resonanzradar',
        emotion: 'reflection',
        summary: `Resonanzradar-Sitzung vom ${new Date().toLocaleDateString('de-DE')}`
      });

      if (error) throw error;

      toast.success(t('resonanzradar.savedToVault'));
      setShowSaveDialog(false);
      setSaveTitle("");
      setMessages([]);
      setHasStarted(false);
    } catch (error) {
      console.error('Save to vault error:', error);
      toast.error(t('resonanzradar.saveError'));
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Hero Section - Kompakter auf Mobile */}
      <section className="pt-16 pb-4 sm:pt-24 sm:pb-8 relative overflow-hidden shrink-0">
        <PolygonalBackground variant="hero" />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-background/80" />

        <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-6">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mb-2 sm:mb-4"
            >
              <Link
                to="/oria-apps"
                className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {t('resonanzradar.backToApps')}
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-3"
            >
              <img
                src={bbOwlLogo}
                alt="Oria"
                className="h-7 sm:h-10 w-auto object-contain"
              />
              <h1 className="text-lg sm:text-2xl md:text-3xl font-serif font-medium text-foreground">
                {t('resonanzradar.title')}
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xs sm:text-sm text-muted-foreground max-w-xl hidden sm:block"
            >
              {t('resonanzradar.subtitle')}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Chat Area */}
      <section className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-3 sm:px-6 pb-4 sm:pb-6 min-h-0">
        {!hasStarted ? (
          /* Welcome Screen */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex flex-col items-center justify-center text-center py-6 sm:py-12"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4 sm:mb-6">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
            </div>
            <h2 className="text-base sm:text-xl font-serif text-foreground mb-2 sm:mb-3">
              {t('resonanzradar.welcomeTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mb-4 sm:mb-6 leading-relaxed px-2">
              {t('resonanzradar.welcomeDesc')}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground/70 max-w-sm mb-6 sm:mb-8 italic px-4">
              {t('resonanzradar.privacyNote')}
            </p>
            <Button
              onClick={startSession}
              disabled={isLoading}
              className="bg-accent text-accent-foreground hover:bg-accent/90 text-sm sm:text-base px-4 sm:px-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('resonanzradar.connecting')}
                </>
              ) : (
                t('resonanzradar.startButton')
              )}
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto py-3 sm:py-4 space-y-3 sm:space-y-4 min-h-0">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[90%] sm:max-w-[85%] rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 ${
                      msg.role === "user"
                        ? "bg-accent text-accent-foreground rounded-br-md"
                        : "bg-card border border-border rounded-bl-md"
                    }`}
                  >
                    <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
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
                  <div className="bg-card border border-border rounded-2xl rounded-bl-md px-3 py-2.5 sm:px-4 sm:py-3">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="shrink-0 border-t border-border pt-3 sm:pt-4 pb-safe">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={resetSession}
                  title={t('resonanzradar.resetSession')}
                  className="shrink-0 h-10 w-10 sm:h-auto sm:w-auto"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <div className="flex-1 relative">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t('resonanzradar.inputPlaceholder')}
                    disabled={isLoading}
                    className="min-h-[44px] sm:min-h-[52px] max-h-28 sm:max-h-32 resize-none pr-11 sm:pr-12 text-sm"
                    rows={1}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="absolute right-1.5 sm:right-2 bottom-1.5 sm:bottom-2 h-7 w-7 sm:h-8 sm:w-8 bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    {isLoading ? (
                      <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground/60 text-center mt-2 sm:mt-3">
                {t('resonanzradar.disclaimer')}
              </p>
            </div>
          </>
        )}
      </section>

      {/* Save to Vault Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('resonanzradar.saveDialogTitle')}</DialogTitle>
            <DialogDescription>
              {t('resonanzradar.saveDialogDesc')}
            </DialogDescription>
          </DialogHeader>
          
          {user ? (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="save-title" className="text-sm font-medium">
                  {t('resonanzradar.saveDialogLabel')}
                </label>
                <Input
                  id="save-title"
                  value={saveTitle}
                  onChange={(e) => setSaveTitle(e.target.value)}
                  placeholder={t('resonanzradar.saveDialogPlaceholder')}
                  className="w-full"
                />
              </div>
            </div>
          ) : (
            <div className="py-4 text-sm text-muted-foreground">
              {t('resonanzradar.loginRequired')}
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={skipSave} disabled={isSaving}>
              <X className="w-4 h-4 mr-2" />
              {t('resonanzradar.dontSave')}
            </Button>
            {user && (
              <Button 
                onClick={saveToVault} 
                disabled={!saveTitle.trim() || isSaving}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {t('resonanzradar.saveToVault')}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Resonanzradar;

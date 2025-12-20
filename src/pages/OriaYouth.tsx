import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, Send, Loader2, Plus, Trash2, Save, X, 
  MessageCircle, Backpack, Users, Trophy, Home, Smartphone,
  ChevronLeft, Music
} from "lucide-react";
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

type Topic = {
  id: string;
  title: string;
  icon: keyof typeof topicIcons;
  messages: Message[];
  createdAt: Date;
};

const topicIcons = {
  school: Backpack,
  friends: Users,
  sports: Trophy,
  family: Home,
  social: Smartphone,
  music: Music,
  general: MessageCircle,
};

const topicLabels = {
  de: {
    school: "Schule",
    friends: "Freunde",
    sports: "Sport/Hobby",
    family: "Familie",
    social: "Social Media",
    music: "Songs",
    general: "Sonstiges",
  },
  en: {
    school: "School",
    friends: "Friends",
    sports: "Sports/Hobby",
    family: "Family",
    social: "Social Media",
    music: "Songs",
    general: "Other",
  },
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/oria-youth-chat`;

const OriaYouth = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTopicPicker, setShowTopicPicker] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [topicToSave, setTopicToSave] = useState<Topic | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeTopic = topics.find(t => t.id === activeTopicId);
  const messages = activeTopic?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const streamChat = async (chatMessages: Message[], topicId: string) => {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ 
        messages: chatMessages,
        userId: user?.id,
        topicId,
      }),
    });

    if (!resp.ok) {
      if (resp.status === 429) {
        throw new Error("Kurze Pause nötig. Versuch's gleich nochmal.");
      }
      if (resp.status === 402) {
        throw new Error("Service gerade nicht verfügbar.");
      }
      throw new Error("Verbindung zu Oria fehlgeschlagen.");
    }

    if (!resp.body) throw new Error("Keine Antwort");

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
            setTopics(prev => prev.map(topic => {
              if (topic.id !== topicId) return topic;
              const msgs = [...topic.messages];
              const lastMsg = msgs[msgs.length - 1];
              if (lastMsg?.role === "assistant") {
                msgs[msgs.length - 1] = { ...lastMsg, content: assistantContent };
              } else {
                msgs.push({ role: "assistant", content: assistantContent });
              }
              return { ...topic, messages: msgs };
            }));
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }
  };

  const createNewTopic = async (icon: keyof typeof topicIcons) => {
    const newTopic: Topic = {
      id: crypto.randomUUID(),
      title: topicLabels[language as 'de' | 'en'][icon],
      icon,
      messages: [],
      createdAt: new Date(),
    };
    
    setTopics(prev => [...prev, newTopic]);
    setActiveTopicId(newTopic.id);
    setShowTopicPicker(false);
    setShowSidebar(false);
    setIsLoading(true);

    try {
      // Start the conversation
      await streamChat([{ role: "user", content: `Ich möchte über ${topicLabels[language as 'de' | 'en'][icon]} reden.` }], newTopic.id);
    } catch (error) {
      console.error("Start topic error:", error);
      toast.error(error instanceof Error ? error.message : "Verbindungsfehler");
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading || !activeTopicId) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    
    setTopics(prev => prev.map(topic => 
      topic.id === activeTopicId 
        ? { ...topic, messages: newMessages }
        : topic
    ));
    setInput("");
    setIsLoading(true);

    try {
      await streamChat(newMessages, activeTopicId);
    } catch (error) {
      console.error("Send message error:", error);
      toast.error(error instanceof Error ? error.message : "Verbindungsfehler");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTopic = (topicId: string) => {
    const topic = topics.find(t => t.id === topicId);
    if (topic && topic.messages.length > 2) {
      setTopicToSave(topic);
      setShowSaveDialog(true);
    } else {
      setTopics(prev => prev.filter(t => t.id !== topicId));
      if (activeTopicId === topicId) {
        setActiveTopicId(null);
      }
    }
  };

  const saveToVault = async () => {
    if (!user || !saveTitle.trim() || !topicToSave) return;
    
    setIsSaving(true);
    try {
      const conversationContent = topicToSave.messages
        .map(m => `${m.role === 'user' ? 'Du' : 'Oria'}: ${m.content}`)
        .join('\n\n');
      
      const { error } = await supabase.from('memories').insert({
        user_id: user.id,
        title: saveTitle.trim(),
        content: conversationContent,
        memory_type: 'oria-youth',
        emotion: 'reflection',
        summary: `Oria Youth Gespräch: ${topicToSave.title} (${new Date().toLocaleDateString('de-DE')})`
      });

      if (error) throw error;

      toast.success("Gespräch gespeichert!");
      setShowSaveDialog(false);
      setSaveTitle("");
      setTopics(prev => prev.filter(t => t.id !== topicToSave.id));
      if (activeTopicId === topicToSave.id) {
        setActiveTopicId(null);
      }
      setTopicToSave(null);
    } catch (error) {
      console.error('Save to vault error:', error);
      toast.error("Speichern fehlgeschlagen");
    } finally {
      setIsSaving(false);
    }
  };

  const skipSave = () => {
    if (topicToSave) {
      setTopics(prev => prev.filter(t => t.id !== topicToSave.id));
      if (activeTopicId === topicToSave.id) {
        setActiveTopicId(null);
      }
    }
    setShowSaveDialog(false);
    setSaveTitle("");
    setTopicToSave(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      <Header />

      {/* Hero Section - Ultra Compact on Mobile */}
      <section className="pt-14 pb-2 sm:pt-20 sm:pb-4 relative overflow-hidden shrink-0">
        <PolygonalBackground variant="hero" />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-background/80" />

        <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between sm:flex-col sm:text-center">
            <div className="flex items-center gap-2">
              <Link
                to="/oria-apps"
                className="p-1.5 -ml-1.5 rounded-full hover:bg-muted/50 transition-colors sm:hidden"
              >
                <ArrowLeft className="w-4 h-4 text-muted-foreground" />
              </Link>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="hidden sm:block mb-2"
              >
                <Link
                  to="/oria-apps"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Zurück zu Oria Apps
                </Link>
              </motion.div>
              <img
                src={bbOwlLogo}
                alt="Oria"
                className="h-5 sm:h-8 w-auto object-contain"
              />
              <h1 className="text-sm sm:text-xl font-serif font-medium text-foreground">
                Oria Youth
              </h1>
            </div>
            
            {/* Mobile: Topic switcher button */}
            {topics.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(true)}
                className="sm:hidden h-8 px-2 text-xs"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                {topics.length}
              </Button>
            )}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="hidden sm:block text-xs text-muted-foreground max-w-md mx-auto mt-1"
          >
            Entdecke, was in dir mitschwingt – ohne Bewertung, ohne Druck.
          </motion.p>
        </div>
      </section>

      {/* Main Content - Full Height */}
      <section className="flex-1 flex max-w-4xl mx-auto w-full px-2 sm:px-6 pb-2 sm:pb-4 min-h-0 overflow-hidden">
        {/* Sidebar - Topics List */}
        <AnimatePresence>
          {showSidebar && (
            <>
              {/* Mobile overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/50 sm:hidden"
                onClick={() => setShowSidebar(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed left-0 top-0 bottom-0 z-50 w-64 bg-background shadow-xl sm:relative sm:shadow-none sm:w-48 md:w-56 sm:block"
              >
                <div className="p-4 sm:p-0 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4 sm:hidden">
                    <h3 className="text-base font-medium">Deine Themen</h3>
                    <Button variant="ghost" size="icon" onClick={() => setShowSidebar(false)}>
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTopicPicker(true)}
                    className="w-full mb-4 text-sm h-10"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Neues Thema
                  </Button>

                  <div className="flex-1 overflow-y-auto space-y-2">
                    {topics.map(topic => {
                      const Icon = topicIcons[topic.icon];
                      return (
                        <div
                          key={topic.id}
                          className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all active:scale-[0.98] ${
                            activeTopicId === topic.id 
                              ? 'bg-accent/10 border border-accent/30' 
                              : 'hover:bg-muted/50 active:bg-muted'
                          }`}
                          onClick={() => {
                            setActiveTopicId(topic.id);
                            setShowSidebar(false);
                          }}
                        >
                          <Icon className="w-5 h-5 text-muted-foreground shrink-0" />
                          <span className="text-sm truncate flex-1">{topic.title}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteTopic(topic.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        {topics.length > 0 && (
          <div className="hidden sm:block w-48 md:w-56 shrink-0 pr-4 border-r border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTopicPicker(true)}
              className="w-full mb-3 text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Neues Thema
            </Button>

            <div className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-200px)]">
              {topics.map(topic => {
                const Icon = topicIcons[topic.icon];
                return (
                  <div
                    key={topic.id}
                    className={`group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                      activeTopicId === topic.id 
                        ? 'bg-accent/10 border border-accent/30' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setActiveTopicId(topic.id)}
                  >
                    <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-xs truncate flex-1">{topic.title}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTopic(topic.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3 text-muted-foreground" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-h-0 sm:pl-4">
          {!activeTopicId ? (
            /* Welcome Screen - Mobile optimized */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 flex flex-col items-center justify-center text-center px-2 py-4"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-accent" />
              </div>
              <h2 className="text-base sm:text-lg font-serif text-foreground mb-1.5">
                Hey! 👋
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xs mb-4 leading-relaxed">
                Wähle ein Thema. Du kannst jederzeit stoppen.
              </p>
              
              <div className="grid grid-cols-2 gap-2 w-full max-w-xs sm:max-w-sm mb-3">
                {(Object.keys(topicIcons) as Array<keyof typeof topicIcons>).map(iconKey => {
                  const Icon = topicIcons[iconKey];
                  return (
                    <Button
                      key={iconKey}
                      variant="outline"
                      className="flex flex-col items-center gap-1 h-auto py-2.5 sm:py-3 hover:border-accent/50 active:scale-[0.98] transition-transform"
                      onClick={() => createNewTopic(iconKey)}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                      <span className="text-[11px] sm:text-xs">{topicLabels[language as 'de' | 'en'][iconKey]}</span>
                    </Button>
                  );
                })}
              </div>

              <p className="text-[9px] text-muted-foreground/60 max-w-xs italic px-4">
                Deine Gespräche sind privat.
              </p>
            </motion.div>
          ) : (
            <>
              {/* Mobile: Current topic header */}
              <div className="flex items-center gap-2 py-2 border-b border-border sm:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTopicId(null)}
                  className="h-8 px-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {activeTopic && (
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {(() => {
                      const Icon = topicIcons[activeTopic.icon];
                      return <Icon className="w-4 h-4 text-muted-foreground shrink-0" />;
                    })()}
                    <span className="text-sm font-medium truncate">
                      {activeTopic.title}
                    </span>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => activeTopic && deleteTopic(activeTopic.id)}
                >
                  <Trash2 className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>

              {/* Messages - Touch optimized */}
              <div className="flex-1 overflow-y-auto py-3 space-y-3 min-h-0 overscroll-contain">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3.5 py-2.5 ${
                        msg.role === "user"
                          ? "bg-accent text-accent-foreground rounded-br-md"
                          : "bg-card border border-border rounded-bl-md"
                      }`}
                    >
                      <p className="text-[13px] sm:text-sm whitespace-pre-wrap leading-relaxed">
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
                    <div className="bg-card border border-border rounded-2xl rounded-bl-md px-3.5 py-2.5">
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area - Mobile optimized with safe area */}
              <div className="shrink-0 border-t border-border pt-2 pb-2 bg-background" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>
                <div className="flex gap-2 items-end">
                  <div className="flex-1 relative">
                    <Textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Schreib was dich beschäftigt..."
                      disabled={isLoading}
                      className="min-h-[44px] max-h-28 resize-none pr-12 text-[15px] sm:text-sm rounded-xl"
                      rows={1}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!input.trim() || isLoading}
                      size="icon"
                      className="absolute right-1.5 bottom-1.5 h-8 w-8 bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <p className="text-[9px] text-muted-foreground/60 text-center mt-1.5">
                  Bei ernsten Themen: 116 111
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Topic Picker Dialog - Mobile optimized */}
      <Dialog open={showTopicPicker} onOpenChange={setShowTopicPicker}>
        <DialogContent className="max-w-[92vw] sm:max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-base">Neues Thema</DialogTitle>
            <DialogDescription className="text-center text-sm">
              Worüber möchtest du reden?
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-2 py-3">
            {(Object.keys(topicIcons) as Array<keyof typeof topicIcons>).map(iconKey => {
              const Icon = topicIcons[iconKey];
              return (
                <Button
                  key={iconKey}
                  variant="outline"
                  className="flex flex-col items-center gap-1.5 h-auto py-3 hover:border-accent/50 active:scale-[0.98] transition-transform"
                  onClick={() => createNewTopic(iconKey)}
                >
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  <span className="text-xs sm:text-sm">{topicLabels[language as 'de' | 'en'][iconKey]}</span>
                </Button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Save to Vault Dialog - Mobile optimized */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="max-w-[92vw] sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base">Gespräch behalten?</DialogTitle>
            <DialogDescription className="text-sm">
              Möchtest du dieses Gespräch in deinem Tresor speichern?
            </DialogDescription>
          </DialogHeader>
          
          {user ? (
            <div className="space-y-3 py-3">
              <div className="space-y-1.5">
                <label htmlFor="save-title" className="text-sm font-medium">
                  Titel
                </label>
                <Input
                  id="save-title"
                  value={saveTitle}
                  onChange={(e) => setSaveTitle(e.target.value)}
                  placeholder="z.B. Gespräch über Schule"
                  className="w-full h-11 text-[15px]"
                />
              </div>
            </div>
          ) : (
            <div className="py-3 text-sm text-muted-foreground">
              Du musst angemeldet sein, um Gespräche zu speichern.
            </div>
          )}

          <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={skipSave} 
              disabled={isSaving}
              className="h-11 text-sm"
            >
              <X className="w-4 h-4 mr-2" />
              Löschen
            </Button>
            {user && (
              <Button 
                onClick={saveToVault} 
                disabled={!saveTitle.trim() || isSaving}
                className="bg-accent text-accent-foreground hover:bg-accent/90 h-11 text-sm"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Speichern
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OriaYouth;

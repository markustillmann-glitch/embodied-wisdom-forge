import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, Send, Loader2, Plus, Trash2, Save, X, 
  MessageCircle, Backpack, Users, Trophy, Home, Smartphone,
  ChevronLeft
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
  general: MessageCircle,
};

const topicLabels = {
  de: {
    school: "Schule",
    friends: "Freunde",
    sports: "Sport/Hobby",
    family: "Familie",
    social: "Social Media",
    general: "Sonstiges",
  },
  en: {
    school: "School",
    friends: "Friends",
    sports: "Sports/Hobby",
    family: "Family",
    social: "Social Media",
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
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Hero Section - Compact */}
      <section className="pt-16 pb-3 sm:pt-20 sm:pb-4 relative overflow-hidden shrink-0">
        <PolygonalBackground variant="hero" />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-background/80" />

        <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-6">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mb-2"
            >
              <Link
                to="/oria-apps"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Zurück zu Oria Apps
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-2 mb-1"
            >
              <img
                src={bbOwlLogo}
                alt="Oria"
                className="h-6 sm:h-8 w-auto object-contain"
              />
              <h1 className="text-base sm:text-xl font-serif font-medium text-foreground">
                Oria Youth
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-[11px] sm:text-xs text-muted-foreground max-w-md"
            >
              Entdecke, was in dir mitschwingt – ohne Bewertung, ohne Druck.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 flex max-w-4xl mx-auto w-full px-3 sm:px-6 pb-4 min-h-0">
        {/* Sidebar - Topics List */}
        <AnimatePresence>
          {(showSidebar || topics.length > 0) && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`${showSidebar ? 'fixed inset-0 z-50 bg-background sm:relative sm:bg-transparent' : 'hidden sm:block'} sm:w-48 md:w-56 shrink-0 sm:pr-4 sm:border-r sm:border-border`}
            >
              <div className="p-4 sm:p-0 h-full flex flex-col">
                <div className="flex items-center justify-between mb-3 sm:hidden">
                  <h3 className="text-sm font-medium">Deine Themen</h3>
                  <Button variant="ghost" size="icon" onClick={() => setShowSidebar(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTopicPicker(true)}
                  className="w-full mb-3 text-xs"
                >
                  <Plus className="w-3.5 h-3.5 mr-1.5" />
                  Neues Thema
                </Button>

                <div className="flex-1 overflow-y-auto space-y-1.5">
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
                        onClick={() => {
                          setActiveTopicId(topic.id);
                          setShowSidebar(false);
                        }}
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {!activeTopicId ? (
            /* Welcome Screen */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 flex flex-col items-center justify-center text-center py-6"
            >
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <MessageCircle className="w-7 h-7 text-accent" />
              </div>
              <h2 className="text-lg font-serif text-foreground mb-2">
                Hey! 👋
              </h2>
              <p className="text-sm text-muted-foreground max-w-xs mb-4 leading-relaxed">
                Wähle ein Thema, über das du reden möchtest. Du kannst jederzeit stoppen.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-sm mb-4">
                {(Object.keys(topicIcons) as Array<keyof typeof topicIcons>).map(iconKey => {
                  const Icon = topicIcons[iconKey];
                  return (
                    <Button
                      key={iconKey}
                      variant="outline"
                      className="flex flex-col items-center gap-1.5 h-auto py-3 hover:border-accent/50"
                      onClick={() => createNewTopic(iconKey)}
                    >
                      <Icon className="w-5 h-5 text-muted-foreground" />
                      <span className="text-xs">{topicLabels[language as 'de' | 'en'][iconKey]}</span>
                    </Button>
                  );
                })}
              </div>

              <p className="text-[10px] text-muted-foreground/60 max-w-xs italic">
                Deine Gespräche sind privat und werden nicht gespeichert, es sei denn, du möchtest sie behalten.
              </p>
            </motion.div>
          ) : (
            <>
              {/* Mobile: Back button */}
              <div className="flex items-center gap-2 mb-2 sm:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSidebar(true)}
                  className="text-xs"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Themen
                </Button>
                {activeTopic && (
                  <span className="text-xs text-muted-foreground">
                    {activeTopic.title}
                  </span>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto py-2 space-y-3 min-h-0">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[88%] sm:max-w-[80%] rounded-2xl px-3 py-2.5 ${
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
                    <div className="bg-card border border-border rounded-2xl rounded-bl-md px-3 py-2.5">
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="shrink-0 border-t border-border pt-3 pb-safe">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Schreib was dich beschäftigt..."
                      disabled={isLoading}
                      className="min-h-[44px] max-h-24 resize-none pr-11 text-sm"
                      rows={1}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!input.trim() || isLoading}
                      size="icon"
                      className="absolute right-1.5 bottom-1.5 h-7 w-7 bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      {isLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
                <p className="text-[9px] text-muted-foreground/60 text-center mt-2">
                  Kein Ersatz für echte Gespräche. Bei ernsten Themen: Nummer gegen Kummer 116 111
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Topic Picker Dialog */}
      <Dialog open={showTopicPicker} onOpenChange={setShowTopicPicker}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">Neues Thema</DialogTitle>
            <DialogDescription className="text-center">
              Worüber möchtest du reden?
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-2 py-4">
            {(Object.keys(topicIcons) as Array<keyof typeof topicIcons>).map(iconKey => {
              const Icon = topicIcons[iconKey];
              return (
                <Button
                  key={iconKey}
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-auto py-4 hover:border-accent/50"
                  onClick={() => createNewTopic(iconKey)}
                >
                  <Icon className="w-6 h-6 text-muted-foreground" />
                  <span className="text-sm">{topicLabels[language as 'de' | 'en'][iconKey]}</span>
                </Button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Save to Vault Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Gespräch behalten?</DialogTitle>
            <DialogDescription>
              Möchtest du dieses Gespräch in deinem Tresor speichern?
            </DialogDescription>
          </DialogHeader>
          
          {user ? (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="save-title" className="text-sm font-medium">
                  Titel
                </label>
                <Input
                  id="save-title"
                  value={saveTitle}
                  onChange={(e) => setSaveTitle(e.target.value)}
                  placeholder="z.B. Gespräch über Schule"
                  className="w-full"
                />
              </div>
            </div>
          ) : (
            <div className="py-4 text-sm text-muted-foreground">
              Du musst angemeldet sein, um Gespräche zu speichern.
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={skipSave} disabled={isSaving}>
              <X className="w-4 h-4 mr-2" />
              Löschen
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

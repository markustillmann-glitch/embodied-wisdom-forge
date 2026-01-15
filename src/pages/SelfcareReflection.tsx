import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, RotateCcw, Save, Sparkles, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import ChatMessage from '@/components/ChatMessage';

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/selfcare-chat`;

const SELFCARE_STATEMENTS = [
  // Originale Statements
  "Manchmal gewinnt man, manchmal lernt man",
  "Wachse und gedeihe",
  "Umgib dich mit Menschen, die dich wachsen sehen wollen",
  "Betrachte die Welt, als würdest du sie zum ersten Mal sehen",
  "Je stiller du bist, desto mehr wirst du hören",
  "Scheue dich nie, um die Hilfe zu bitten, die du brauchst",
  "Begrenze nicht die Herausforderungen, fordere die Grenzen heraus",
  "Vergleichen macht unglücklich",
  "Weniger scrollen, mehr leben",
  "Lass ab von dem, was war, und vertraue dem, was kommt",
  "Eine Umarmung macht alles besser",
  "Finde heraus, was du brauchst, scheue dich nicht, darum zu bitten",
  "Du kontrollierst deine Finanzen, nicht sie dich",
  "Aus kleinen Samen wachsen mächtige Bäume",
  "Nimm jeden Tag, wie er kommt",
  "Ein Duft kann tausend Erinnerungen zurückbringen",
  "Es sind die kleinen Dinge, die den größten Unterschied machen",
  "Die Welt gehört jenen, die lesen",
  "Kreativität ist eine unendliche Ressource: je mehr du sie nutzt, desto mehr hast du",
  "Das Leben ist ein Song: Singe!",
  "To do: Lebe den Moment",
  "Aufgeräumtes Haus, aufgeräumte Seele",
  "Wenn nicht jetzt, wann dann?",
  "Manchmal ist Entspannung das Produktivste, was man tun kann",
  "Verwandle Angst in Energie",
  "Achte auf dich von innen heraus",
  "Entwickle gesunde Gewohnheiten, nicht Einschränkungen",
  "Kleine Schritte führen zu großen Veränderungen",
  "Entspannen, erfrischen, erholen",
  "Kreiere deine eigene Stille",
  "Lehre dich die Kunst des Ausruhens",
  "Dein Heim ist ein Zufluchtsort: erfülle es mit Frieden",
  "Tanke neue Kraft, erneuere deinen Geist",
  "Verliebe dich in deine Selbstpflege",
  "Nimm dir Zeit für Dinge, die deine Seele glücklich machen",
  "In der Selbstfreundlichkeit liegt die Kraft",
  "Verbringe Quality Time mit dir selbst",
  "Lass dich von der Natur beleben",
  "Auf Regen folgt immer Sonnenschein",
  "Folge keinem Weg – gehe deinen eigenen",
  "Beruhige deinen Geist, befreie deinen Körper",
  "Dein größter Reichtum ist deine Gesundheit",
  "Nähre dich, um zu gedeihen",
  "Beginne jeden Tag mit einem positiven Gedanken und sieh, wohin er dich führt",
  "Wie du mit dir selbst sprichst, macht viel aus",
  "Das Leben ist schöner, wenn man es mit einem Freund teilt",
  "Sei freundlich zu dir selbst – du gibst dein Bestes",
  "Es gibt immer etwas, für das man dankbar sein kann",
  "Sei kämpferisch, nicht grüblerisch",
  "So, wie du bist, bist du genug",
  "Das Leben ist schöner, wenn man lacht",
  "In der Einfachheit liegt so viel Schönheit",
  "Du darfst langsam sein",
  "Ruhe ist kein Stillstand, sondern Regeneration",
  "Höre auf deinen Körper – er spricht mit dir",
  "Selbstfürsorge ist kein Luxus, sondern eine Grundlage",
  "Du musst nicht alles heute schaffen",
  "Deine Bedürfnisse sind wichtig",
  "Atme ein – lass los",
  "Grenzen setzen ist ein Akt der Selbstachtung",
  "Nicht jeder Tag muss produktiv sein",
  "Du darfst Pausen machen, ohne sie zu rechtfertigen",
  "Sanftheit ist auch eine Stärke",
  "Dein Wert hängt nicht von deiner Leistung ab",
  "Manchmal ist genug wirklich genug",
  "Erholung ist Teil des Weges, nicht die Abweichung",
  "Sei geduldig mit deinem Prozess",
  
  // GfK-inspirierte Statements
  "Ich wünsche mir, gehört zu werden, ohne mich rechtfertigen zu müssen",
  "Mir ist wichtig, dass mein Beitrag ernst genommen wird",
  "Ich brauche Raum, um mich in meinem Tempo zu entwickeln",
  "Ich sehne mich nach Klarheit darüber, was von mir erwartet wird",
  "Ich möchte mich sicher fühlen, wenn ich meine Meinung äußere",
  "Mir tut es gut, wenn meine Anstrengungen gesehen werden",
  "Ich brauche Verlässlichkeit, um entspannen zu können",
  "Ich wünsche mir Verbindung, ohne mich verbiegen zu müssen",
  "Mir ist wichtig, selbst entscheiden zu dürfen",
  "Ich brauche Pausen, um meine Kraft zu bewahren",
  "Ich möchte verstehen, was hinter dem Verhalten anderer steht",
  "Mir gibt es Ruhe, wenn Absprachen eingehalten werden",
  "Ich wünsche mir Wertschätzung – auch für kleine Schritte",
  "Ich brauche Orientierung, um mich sicher zu fühlen",
  "Ich möchte dazugehören, ohne mich anpassen zu müssen",
  "Mir ist Fairness wichtig, auch wenn Meinungen unterschiedlich sind",
  "Ich brauche Zeit, um Vertrauen aufzubauen",
  "Ich wünsche mir Offenheit für meine Perspektive",
  "Mir ist Ehrlichkeit wichtig, auch wenn sie unbequem ist",
  "Ich brauche Unterstützung, ohne dafür schwach zu sein",
  "Ich möchte mich wirksam erleben in dem, was ich tue",
  "Mir ist es wichtig, respektvoll behandelt zu werden",
  "Ich brauche Verständnis für meine Grenzen",
  "Ich wünsche mir Leichtigkeit neben all der Verantwortung",
  "Mir gibt es Kraft, wenn ich mich verbunden fühle",
  "Ich brauche Stabilität, um mutig sein zu können",
  "Ich möchte lernen dürfen, ohne bewertet zu werden",
  "Mir ist Transparenz wichtig, um Vertrauen zu entwickeln",
  "Ich brauche Anerkennung für das, was mir wichtig ist",
  "Ich wünsche mir Gleichwertigkeit im Miteinander",
  "Ich möchte mich zeigen dürfen, so wie ich bin",
  "Mir ist wichtig, dass meine Bedürfnisse Platz haben",
  "Ich brauche Ruhe, um meine Gedanken zu sortieren",
  "Ich wünsche mir Kooperation statt Konkurrenz",
  "Mir gibt es Sicherheit, wenn Konflikte offen angesprochen werden",
  "Ich brauche Sinn in dem, was ich tue",
  "Ich möchte mich respektiert fühlen – auch bei Unterschiedlichkeit",
  "Mir ist es wichtig, lernen und wachsen zu dürfen",
  "Ich brauche Verbundenheit, besonders in schwierigen Momenten",
  "Ich wünsche mir Vertrauen in meine Fähigkeiten",
  "Ich möchte Entscheidungen mittragen können, die mich betreffen",
  "Mir ist wichtig, dass Gefühle ernst genommen werden",
  "Ich brauche Erholung, um langfristig präsent zu sein",
  "Ich wünsche mir Mitgefühl – auch für mich selbst",
  "Mir gibt es Halt, wenn ich nicht alleine bin",
  "Ich brauche Freiheit innerhalb klarer Strukturen",
  "Ich möchte beitragen, auf eine Weise, die stimmig für mich ist",
  "Mir ist wichtig, gesehen zu werden – nicht nur meine Leistung",
  "Ich brauche Hoffnung, um dranzubleiben",
  "Ich wünsche mir ein Miteinander, das nährt statt erschöpft",
  
  // IFS-inspirierte Statements
  "Ein Teil von mir meint es gut, auch wenn sein Verhalten mich belastet",
  "Ich darf neugierig auf meine inneren Reaktionen sein",
  "Nicht alles in mir will dasselbe – und das ist okay",
  "Manche Teile versuchen, mich vor alten Verletzungen zu schützen",
  "Ich kann mir selbst mit Freundlichkeit begegnen",
  "Gefühle sind Signale, keine Befehle",
  "Ich darf innehalten, bevor ich reagiere",
  "Es gibt in mir einen ruhigen, klaren Ort",
  "Auch widersprüchliche Anteile gehören zu mir",
  "Ich muss keinen Teil loswerden, um ganz zu sein",
  "Ein Teil von mir trägt eine Geschichte, die gehört werden will",
  "Ich kann beobachten, ohne mich zu verlieren",
  "Schutzstrategien entstanden aus Notwendigkeit",
  "Ich darf lernen, meine inneren Stimmen zu unterscheiden",
  "Nicht jeder Impuls braucht sofortige Handlung",
  "Ich kann meine Anteile würdigen, ohne ihnen zu folgen",
  "Manche Teile sind sehr alt, auch wenn sie sich heute melden",
  "Ich darf Tempo rausnehmen, wenn es sich zu viel anfühlt",
  "Ich bin mehr als meine stärksten Gefühle",
  "Es ist möglich, inneren Konflikten mit Mitgefühl zu begegnen",
  "Ein Teil von mir möchte Kontrolle, ein anderer Ruhe",
  "Ich kann Raum schaffen zwischen Reiz und Reaktion",
  "Auch innere Kritiker hatten einmal eine gute Absicht",
  "Ich darf meine Verletzlichkeit schützen, ohne mich zu verschließen",
  "Nicht jeder Teil braucht Veränderung – manche brauchen Verständnis",
  "Ich kann lernen, mir selbst Sicherheit zu geben",
  "Innere Anteile dürfen sich verändern, wenn sie sich gesehen fühlen",
  "Ich muss nichts erzwingen, um mich zu entwickeln",
  "Ich darf neugierig sein statt wertend",
  "Mein inneres Erleben ist komplex – und das ist menschlich",
  "Ich kann meine Aufmerksamkeit bewusst lenken",
  "Ein Teil von mir darf Pause machen",
  "Auch starke Emotionen können gehalten werden",
  "Ich bin nicht falsch, weil es in mir laut ist",
  "Ich darf Verantwortung übernehmen, ohne mich zu überfordern",
  "Meine inneren Erfahrungen verdienen Respekt",
  "Ich kann lernen, mir selbst zuzuhören",
  "Innere Führung fühlt sich ruhig und klar an",
  "Ich darf alte Muster würdigen und neue wählen",
  "Es ist möglich, innerlich verbunden zu sein, auch im Chaos",
  "Ich kann zwischen mir und meinen Anteilen unterscheiden",
  "Nicht alles, was dringend wirkt, ist wirklich dringend",
  "Ich darf mir selbst ein sicherer Ort sein",
  "Auch ungeliebte Teile gehören zu meinem System",
  "Veränderung beginnt oft mit Zuhören",
  "Ich kann meine innere Welt erforschen, ohne sie zu kontrollieren",
  "Manche Teile brauchen Geduld, keine Lösung",
  "Ich darf mir selbst vertrauen lernen",
  "In mir gibt es Ressourcen, auch wenn ich sie gerade nicht spüre",
  "Ich kann mich innerlich führen – Schritt für Schritt"
];

type Message = { role: "user" | "assistant"; content: string };

const SelfcareReflection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStatement, setCurrentStatement] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getRandomStatement = () => {
    const randomIndex = Math.floor(Math.random() * SELFCARE_STATEMENTS.length);
    return SELFCARE_STATEMENTS[randomIndex];
  };

  const streamChat = async (userMessage: string, history: Message[], statement: string) => {
    setIsLoading(true);
    
    const allMessages = [...history, { role: "user" as const, content: userMessage }];
    setMessages(allMessages);
    setConversationHistory(allMessages);

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ 
          messages: allMessages,
          userId: user?.id,
          statement: statement
        }),
      });

      if (!resp.ok) {
        if (resp.status === 429) throw new Error("Bitte warte einen Moment.");
        if (resp.status === 402) throw new Error("Service nicht verfügbar.");
        throw new Error("Verbindung fehlgeschlagen.");
      }

      if (!resp.body) throw new Error("Keine Antwort");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let assistantMessage = "";

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
              assistantMessage += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: assistantMessage } : m
                  );
                }
                return [...prev, { role: "assistant", content: assistantMessage }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      setConversationHistory((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantMessage } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantMessage }];
      });
    } catch (error) {
      console.error('Error in chat:', error);
      toast.error('Fehler bei der Verbindung zu Oria. Bitte versuche es erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  const startSession = () => {
    const statement = getRandomStatement();
    setCurrentStatement(statement);
    setSessionStarted(true);
    
    // Verschiedene Einleitungsvarianten für mehr Abwechslung
    const introVariants = [
      `🌱 **Dein Impuls für heute:**\n\n*„${statement}"*\n\nNimm dir einen Moment, diesen Gedanken auf dich wirken zu lassen.\n\nWas spürst du, wenn du diesen Satz liest? Welche Resonanz entsteht in dir – vielleicht Zustimmung, Widerstand, Sehnsucht oder Neugier?`,
      `✨ **Heute für dich:**\n\n*„${statement}"*\n\nLass diesen Gedanken einen Moment in dir ankommen.\n\nWas löst er aus? Ein Gefühl, eine Erinnerung, vielleicht einen inneren Widerspruch?`,
      `🌿 **Dein Moment der Reflexion:**\n\n*„${statement}"*\n\nSpüre in dich hinein: Was passiert, wenn du diese Worte liest?\n\nGibt es eine körperliche Reaktion, ein Gefühl, einen Gedanken?`,
      `💫 **Ein Impuls wartet auf dich:**\n\n*„${statement}"*\n\nNimm dir Zeit, diese Worte wirken zu lassen.\n\nWelche Saite wird in dir angeschlagen? Resonanz, Sehnsucht, vielleicht auch Skepsis?`,
      `🌸 **Für diesen Augenblick:**\n\n*„${statement}"*\n\nBevor wir tiefer gehen – was bemerkst du zuerst?\n\nEin Gefühl? Einen Gedanken? Eine körperliche Empfindung?`
    ];
    
    const randomIntro = introVariants[Math.floor(Math.random() * introVariants.length)];
    
    const introMessage: Message = {
      role: "assistant",
      content: randomIntro
    };
    
    setMessages([introMessage]);
    setConversationHistory([introMessage]);
  };

  const sendMessage = () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput("");
    streamChat(userMessage, conversationHistory, currentStatement);
  };

  const resetSession = () => {
    if (conversationHistory.length > 1) {
      setShowSaveDialog(true);
    } else {
      setSessionStarted(false);
      setMessages([]);
      setConversationHistory([]);
      setCurrentStatement("");
    }
  };

  const saveToVault = async () => {
    if (!user) {
      toast.error('Bitte melde dich an, um Gespräche zu speichern');
      return;
    }

    const content = conversationHistory
      .map(m => `${m.role === 'user' ? 'Du' : 'Oria'}: ${m.content}`)
      .join('\n\n');

    const title = saveTitle.trim() || `Selfcare: ${currentStatement.substring(0, 40)}...`;

    try {
      const { error } = await supabase.from('memories').insert({
        user_id: user.id,
        title: title,
        content: content,
        memory_type: 'selfcare-reflection',
        summary: `Reflexion über: "${currentStatement}"`
      });

      if (error) throw error;

      toast.success('Reflexion im Tresor gespeichert');
      setShowSaveDialog(false);
      setSaveTitle("");
      setSessionStarted(false);
      setMessages([]);
      setConversationHistory([]);
      setCurrentStatement("");
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Fehler beim Speichern');
    }
  };

  const skipSave = () => {
    setShowSaveDialog(false);
    setSaveTitle("");
    setSessionStarted(false);
    setMessages([]);
    setConversationHistory([]);
    setCurrentStatement("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const deepenInOria = () => {
    const context = conversationHistory
      .map(m => `${m.role === 'user' ? 'Nutzer' : 'Oria'}: ${m.content}`)
      .join('\n\n');
    
    // Coach erwartet den Kontext in sessionStorage
    const deepenData = {
      context: `Ich komme aus einer Selfcare-Reflexion über den Impuls: "${currentStatement}"\n\nHier ist unser bisheriges Gespräch:\n${context}\n\nIch möchte dieses Thema tiefer erkunden.`,
      topic: `Selfcare: ${currentStatement.substring(0, 50)}`,
      source: 'selfcare-reflection'
    };
    
    sessionStorage.setItem('coach-deepen-context', JSON.stringify(deepenData));
    navigate('/coach?new=true');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-accent/5 pb-[140px] md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/oria-apps" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Zurück</span>
          </Link>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            <h1 className="font-serif text-lg font-medium">Selfcare Impuls</h1>
          </div>
          <div className="w-16" />
        </div>
      </header>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="py-8 px-4 text-center border-b border-border/30"
      >
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-600 text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Tägliche Selbstreflexion</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-foreground mb-3">
            Selfcare Impulse
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Ein zufälliger Impuls lädt dich zur Reflexion ein. Oria begleitet dich dabei, 
            herauszufinden, was dieser Gedanke für dich und dein Leben bedeutet.
          </p>
        </div>
      </motion.section>

      {/* Chat Area */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6">
        {!sessionStarted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-serif text-xl font-medium mb-3">
                Bereit für deinen Impuls?
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                Oria wählt zufällig einen Selfcare-Impuls für dich aus. 
                Gemeinsam erkunden wir, welche Bedeutung er für dich hat.
              </p>
            </div>
            <Button 
              onClick={startSession}
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Impuls entdecken
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {/* Current Statement Banner */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-200/30 rounded-lg p-4 text-center"
            >
              <p className="text-xs uppercase tracking-wide text-pink-600 mb-1">Heutiger Impuls</p>
              <p className="font-serif text-lg font-medium text-foreground italic">
                „{currentStatement}"
              </p>
            </motion.div>

            {/* Messages */}
            <div className="space-y-4 min-h-[300px]">
              {messages.map((message, index) => (
                <ChatMessage key={index} content={message.content} role={message.role} />
              ))}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-accent/50 rounded-2xl rounded-tl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Fixed on mobile */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border/50 px-4 py-3 md:relative md:border-t-0 md:bg-background/80 md:px-0 md:py-0 md:mt-4">
              <div className="max-w-3xl mx-auto">
                <div className="flex gap-2 items-end">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Teile deine Gedanken..."
                    className="min-h-[48px] max-h-24 resize-none flex-1"
                    disabled={isLoading}
                  />
                  <Button 
                    onClick={sendMessage} 
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="h-12 w-12 shrink-0 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 mt-2 justify-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetSession}
                    className="text-muted-foreground text-xs h-8"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Neuer Impuls
                  </Button>
                  {conversationHistory.length > 2 && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={deepenInOria}
                      className="text-pink-600 border-pink-200 hover:bg-pink-50 text-xs h-8"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      Vertiefen
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reflexion speichern?</DialogTitle>
            <DialogDescription>
              Möchtest du diese Selfcare-Reflexion in deinem Tresor speichern?
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Titel (optional)"
            value={saveTitle}
            onChange={(e) => setSaveTitle(e.target.value)}
          />
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={skipSave}>
              Verwerfen
            </Button>
            <Button onClick={saveToVault} className="bg-gradient-to-r from-pink-500 to-rose-500">
              <Save className="w-4 h-4 mr-1" />
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="py-4 px-4 border-t border-border/30 text-center">
        <p className="text-xs text-muted-foreground">
          © 2025 Oria · Selfcare Impulse
        </p>
      </footer>
    </div>
  );
};

export default SelfcareReflection;

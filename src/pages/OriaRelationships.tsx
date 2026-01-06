import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  ArrowLeft, Send, Loader2, RotateCcw, Heart, Save, X, 
  Users, Plus, ChevronDown, ChevronUp, Sparkles, Shield, 
  Eye, MessageCircle, Smile, Lock, Flame, Hand, Lightbulb, Info
} from "lucide-react";
import { PolygonalBackground } from "@/components/PolygonalBackground";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import bbOwlLogo from "@/assets/bb-owl-new.png";

type Message = { role: "user" | "assistant"; content: string };
type Relationship = {
  id: string;
  name: string;
  type: string;
  created_at: string;
};

// 10 Dimensions with icons, descriptions and characteristic keywords (positive & negative)
const DIMENSIONS = [
  { 
    key: 'toleranz', 
    icon: Hand, 
    label: 'Toleranz', 
    desc: 'Unterschiedlichkeit aushalten ohne Selbstverleugnung',
    keywords: [
      'Anderssein akzeptieren', 'Eigenheiten respektieren', 'Meinungsverschiedenheiten aushalten',
      'Unterschiedliche Werte würdigen', 'Raum für Verschiedenheit', 'Geduld mit Gewohnheiten',
      'Grenzen des Erträglichen', 'Ohne Anpassungsdruck', 'Vielfalt als Bereicherung',
      'Toleranz vs. Selbstverleugnung', 'Neugier statt Abwehr', 'Weite vs. Enge'
    ],
    negativeKeywords: [
      'Ständige Kritik', 'Kein Raum für Anderssein', 'Anpassungsdruck', 'Abwertung von Unterschieden',
      'Intoleranz bei Kleinigkeiten', 'Verachtung', 'Enge statt Weite', 'Ungeduld',
      'Ablehnung von Eigenheiten', 'Missionieren wollen'
    ]
  },
  { 
    key: 'verlaesslichkeit', 
    icon: Shield, 
    label: 'Verlässlichkeit', 
    desc: 'Erlebte Kontinuität und Erwartungssicherheit',
    keywords: [
      'Zusagen einhalten', 'Berechenbarkeit', 'Pünktlichkeit', 'Erreichbarkeit',
      'Konstanz im Verhalten', 'Versprechen halten', 'Absprachen respektieren',
      'Stabilität bieten', 'Erwartungen erfüllen', 'Kontinuität im Alltag',
      'Zuverlässigkeit in Krisen', 'Regelmäßige Präsenz'
    ],
    negativeKeywords: [
      'Gebrochene Versprechen', 'Unberechenbarkeit', 'Ständiges Zuspätkommen', 'Nicht erreichbar',
      'Wechselhaftes Verhalten', 'Vergessene Absprachen', 'Ausreden', 'Instabilität',
      'Enttäuschte Erwartungen', 'Plötzliches Verschwinden'
    ]
  },
  { 
    key: 'vertrauen', 
    icon: Lock, 
    label: 'Vertrauen', 
    desc: 'Wiederholte emotionale Sicherheit',
    keywords: [
      'Geheimnisse bewahren', 'Ehrlichkeit', 'Transparenz', 'Verletzlichkeit zeigen',
      'Keine Hintergedanken', 'Aufrichtigkeit', 'Loyalität', 'Treue',
      'Glaubwürdigkeit', 'Sich fallen lassen', 'Vertrauen aufbauen',
      'Nach Vertrauensbruch heilen'
    ],
    negativeKeywords: [
      'Lügen', 'Geheimnisse weitergeben', 'Hintergedanken', 'Misstrauen säen',
      'Untreue', 'Manipulation', 'Kontrolle', 'Vertrauensbruch',
      'Unehrlichkeit', 'Verrat', 'Versteckspiel'
    ]
  },
  { 
    key: 'offenheit', 
    icon: Eye, 
    label: 'Offenheit', 
    desc: 'Authentische Mitteilung ohne Schonungslosigkeit',
    keywords: [
      'Gedanken teilen', 'Gefühle aussprechen', 'Wünsche äußern', 'Ängste zeigen',
      'Echte Gespräche', 'Keine Tabuthemen', 'Authentisch sein', 'Verletzlichkeit wagen',
      'Feedback geben', 'Zuhören können', 'Mut zur Wahrheit', 'Timing beachten'
    ],
    negativeKeywords: [
      'Verschlossenheit', 'Gefühle unterdrücken', 'Mauern aufbauen', 'Tabuthemen',
      'Schweigen als Strafe', 'Keine echten Gespräche', 'Fassade', 'Vermeidung',
      'Unausgesprochenes', 'Rückzug bei Konflikten'
    ]
  },
  { 
    key: 'wertschaetzung', 
    icon: Sparkles, 
    label: 'Wertschätzung', 
    desc: 'Gesehen-werden im eigenen Wesen',
    keywords: [
      'Anerkennung zeigen', 'Dankbarkeit ausdrücken', 'Komplimente machen', 'Stärken sehen',
      'Erfolge feiern', 'Bemühungen würdigen', 'Einzigartigkeit schätzen', 'Aufmerksamkeit schenken',
      'Interesse zeigen', 'Wert bestätigen', 'Lob aussprechen', 'Gesehen werden'
    ],
    negativeKeywords: [
      'Ignorieren', 'Selbstverständlichkeit', 'Kein Lob', 'Kritik statt Anerkennung',
      'Bemühungen übersehen', 'Gleichgültigkeit', 'Herabsetzung', 'Vergleiche mit anderen',
      'Unsichtbar fühlen', 'Mangelndes Interesse'
    ]
  },
  { 
    key: 'respekt', 
    icon: Hand, 
    label: 'Respekt', 
    desc: 'Achtung vor Grenzen – eigenen und fremden',
    keywords: [
      'Grenzen achten', 'Nein akzeptieren', 'Privatsphäre wahren', 'Meinungen respektieren',
      'Würde bewahren', 'Keine Abwertung', 'Autonomie achten', 'Entscheidungen respektieren',
      'Höflichkeit', 'Keine Übergriffe', 'Selbstachtung', 'Gegenseitige Achtung'
    ],
    negativeKeywords: [
      'Grenzüberschreitungen', 'Nein ignorieren', 'Privatsphäre verletzen', 'Abwertung',
      'Bevormundung', 'Demütigung', 'Übergriffe', 'Kontrolle ausüben',
      'Respektlosigkeit', 'Würde verletzen'
    ]
  },
  { 
    key: 'naehe', 
    icon: Heart, 
    label: 'Nähe', 
    desc: 'Emotionale und körperliche Verbundenheit',
    keywords: [
      'Körperliche Berührung', 'Emotionale Intimität', 'Gemeinsame Zeit', 'Kuscheln',
      'Tiefe Gespräche', 'Blickkontakt', 'Präsenz', 'Verbundenheit spüren',
      'Seelische Nähe', 'Geborgenheit', 'Zusammengehörigkeit', 'Nähe-Distanz-Balance'
    ],
    negativeKeywords: [
      'Distanz', 'Kälte', 'Keine Berührung', 'Emotionale Abwesenheit',
      'Keine gemeinsame Zeit', 'Oberflächlichkeit', 'Fremdheit', 'Einsamkeit zu zweit',
      'Klammern', 'Erdrückende Nähe'
    ]
  },
  { 
    key: 'humor', 
    icon: Smile, 
    label: 'Humor', 
    desc: 'Gemeinsame Leichtigkeit ohne Abwertung',
    keywords: [
      'Gemeinsam lachen', 'Leichtigkeit', 'Albernheit', 'Insider-Witze',
      'Spielerisches Necken', 'Situationskomik', 'Ironie verstehen', 'Stress abbauen',
      'Freude teilen', 'Spaß haben', 'Positive Stimmung', 'Lachen als Verbindung'
    ],
    negativeKeywords: [
      'Verletzender Spott', 'Sarkasmus auf Kosten anderer', 'Kein gemeinsames Lachen',
      'Schwere', 'Verbitterung', 'Auslachen', 'Zynismus', 'Witze auf Kosten des Partners',
      'Humor als Waffe', 'Keine Leichtigkeit'
    ]
  },
  { 
    key: 'sicherheit', 
    icon: Shield, 
    label: 'Sicherheit', 
    desc: 'Emotionale Grundstabilität in der Beziehung',
    keywords: [
      'Emotionaler Halt', 'Schutz bieten', 'Stabilität', 'Vorhersehbarkeit',
      'Ruhe ausstrahlen', 'Konfliktfähigkeit', 'Keine Angst vor Verlassen', 'Beständigkeit',
      'Sicherer Hafen', 'Nervensystem beruhigen', 'Ankerpunkt sein', 'Geborgenheit'
    ],
    negativeKeywords: [
      'Angst vor Verlassenwerden', 'Emotionale Instabilität', 'Wutausbrüche', 'Drohungen',
      'Unberechenbarkeit', 'Ständige Unsicherheit', 'Kein sicherer Hafen', 'Nervosität',
      'Walking on eggshells', 'Fehlender Halt'
    ]
  },
  { 
    key: 'empathie', 
    icon: MessageCircle, 
    label: 'Empathie', 
    desc: 'Sich gesehen fühlen – ohne Lösung',
    keywords: [
      'Mitfühlen', 'Verstehen wollen', 'Zuhören ohne Ratschlag', 'Perspektive wechseln',
      'Gefühle validieren', 'Anteilnahme zeigen', 'Einfühlungsvermögen', 'Resonanz geben',
      'Nicht bewerten', 'Da sein', 'Trost spenden', 'Emotionen halten'
    ],
    negativeKeywords: [
      'Kein Verständnis', 'Gefühle abtun', 'Sofort Ratschläge geben', 'Bagatellisieren',
      'Nicht zuhören', 'Eigene Perspektive aufzwingen', 'Kälte', 'Desinteresse',
      'Gefühle bewerten', 'Allein gelassen fühlen'
    ]
  },
];

const RELATIONSHIP_TYPES = [
  { value: 'partner', label: 'Partner/in' },
  { value: 'family', label: 'Familie' },
  { value: 'friend', label: 'Freund/in' },
  { value: 'colleague', label: 'Kollege/in' },
  { value: 'other', label: 'Andere' },
];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/relationships-chat`;

// Type for navigation state when deepening from another chat
type DeepenState = {
  context?: string;
  topic?: string;
  source?: string;
};

const OriaRelationships = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null);
  const [showAddRelationship, setShowAddRelationship] = useState(false);
  const [newRelationshipName, setNewRelationshipName] = useState("");
  const [newRelationshipType, setNewRelationshipType] = useState("partner");
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [selectedRelationship, setSelectedRelationship] = useState<Relationship | null>(null);
  const [showRelationshipSelector, setShowRelationshipSelector] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [previewDimension, setPreviewDimension] = useState<string | null>(null);
  const [deepenContext, setDeepenContext] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Check for deepen state from navigation
  useEffect(() => {
    const state = location.state as DeepenState | null;
    if (state?.context) {
      setDeepenContext(state.context);
      // Auto-start session with the context
      startSessionWithContext(state.context, state.topic);
      // Clear the navigation state
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state]);

  useEffect(() => {
    if (user) {
      loadRelationships();
    }
  }, [user]);

  const loadRelationships = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('memories')
        .select('id, title, content, created_at')
        .eq('user_id', user.id)
        .eq('memory_type', 'relationship-profile')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const parsed = (data || []).map(item => {
        try {
          const content = JSON.parse(item.content);
          return {
            id: item.id,
            name: content.name || item.title,
            type: content.type || 'other',
            created_at: item.created_at,
          };
        } catch {
          return {
            id: item.id,
            name: item.title,
            type: 'other',
            created_at: item.created_at,
          };
        }
      });
      setRelationships(parsed);
    } catch (error) {
      console.error('Error loading relationships:', error);
    }
  };

  const addRelationship = async () => {
    if (!user || !newRelationshipName.trim()) return;
    
    try {
      const { error } = await supabase
        .from('memories')
        .insert({
          user_id: user.id,
          title: newRelationshipName.trim(),
          content: JSON.stringify({ name: newRelationshipName.trim(), type: newRelationshipType }),
          memory_type: 'relationship-profile',
        });

      if (error) throw error;
      
      toast.success('Beziehung hinzugefügt');
      setNewRelationshipName("");
      setShowAddRelationship(false);
      loadRelationships();
    } catch (error) {
      console.error('Error adding relationship:', error);
      toast.error('Fehler beim Hinzufügen');
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
        userId: user?.id,
        dimension: selectedDimension,
        relationshipName: selectedRelationship?.name,
        relationshipType: selectedRelationship?.type,
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

  const selectDimension = (dimension: string) => {
    setPreviewDimension(dimension);
  };

  const activeDimension = selectedDimension ? DIMENSIONS.find(d => d.key === selectedDimension) : null;

  const startSession = async (dimension?: string) => {
    const dimToUse = dimension || previewDimension || undefined;
    if (dimToUse) setSelectedDimension(dimToUse);
    setPreviewDimension(null);
    setHasStarted(true);
    setMessages([]);
    setIsLoading(true);

    try {
      const introMessage: Message = { 
        role: "user", 
        content: dimToUse 
          ? `Ich möchte über die Dimension "${DIMENSIONS.find(d => d.key === dimToUse)?.label}" in meiner Beziehung${selectedRelationship ? ` mit ${selectedRelationship.name}` : ''} reflektieren.`
          : `Ich möchte über meine Beziehung${selectedRelationship ? ` mit ${selectedRelationship.name}` : ''} reflektieren.`
      };
      await streamChat([introMessage]);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Verbindungsfehler");
    } finally {
      setIsLoading(false);
    }
  };

  // Start session with context from another chat (e.g. Life Check-in)
  const startSessionWithContext = async (context: string, topic?: string) => {
    setHasStarted(true);
    setMessages([]);
    setIsLoading(true);

    try {
      const introMessage: Message = { 
        role: "user", 
        content: topic 
          ? `Ich komme aus einem anderen Gespräch und möchte folgendes Thema hier vertiefen:\n\n**Thema:** ${topic}\n\n**Kontext aus dem vorherigen Gespräch:**\n${context}`
          : `Ich komme aus einem anderen Gespräch und möchte folgendes hier vertiefen:\n\n${context}`
      };
      await streamChat([introMessage]);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Verbindungsfehler");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      await streamChat(newMessages);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Fehler");
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const resetSession = () => {
    if (messages.length > 0) {
      setShowSaveDialog(true);
    } else {
      setHasStarted(false);
      setMessages([]);
      setSelectedDimension(null);
    }
  };

  const saveToVault = async () => {
    if (!user) {
      toast.error("Du musst angemeldet sein, um zu speichern.");
      return;
    }
    if (!saveTitle.trim()) {
      toast.error("Bitte gib einen Titel ein.");
      return;
    }

    setIsSaving(true);
    try {
      const conversationContent = messages.map(m => `${m.role === 'user' ? 'Du' : 'Oria'}: ${m.content}`).join('\n\n');
      
      const { error } = await supabase.from("memories").insert({
        user_id: user.id,
        title: saveTitle.trim(),
        content: conversationContent,
        memory_type: "relationship-reflection",
        emotion: selectedDimension || undefined,
      });

      if (error) throw error;
      
      toast.success("Reflexion gespeichert");
      setShowSaveDialog(false);
      setSaveTitle("");
      setHasStarted(false);
      setMessages([]);
      setSelectedDimension(null);
    } catch (error) {
      console.error('Error saving:', error);
      toast.error("Fehler beim Speichern");
    } finally {
      setIsSaving(false);
    }
  };

  const discardAndReset = () => {
    setShowSaveDialog(false);
    setSaveTitle("");
    setHasStarted(false);
    setMessages([]);
    setSelectedDimension(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="pt-20 pb-6 sm:pt-24 sm:pb-8 relative overflow-hidden">
        <PolygonalBackground variant="hero" />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-background/80" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mb-4"
            >
              <Link to="/oria-apps" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Zurück zu Oria Apps
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-3"
            >
              <img src={bbOwlLogo} alt="Oria" className="h-10 sm:h-12 w-auto object-contain" />
              <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-medium text-foreground leading-tight">
                Oria Relationships
              </h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-sm text-muted-foreground font-sans max-w-xl leading-relaxed"
            >
              Reflexion, Begleitung und innere Führung in Beziehungen
            </motion.p>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              onClick={() => setShowInfo(true)}
              className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-accent transition-colors"
            >
              <Info className="w-3 h-3" />
              Was ist Oria Relationships?
            </motion.button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 pb-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {!hasStarted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Relationship Selector */}
              {user && (
                <div className="bg-card rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Users className="w-4 h-4 text-accent" />
                      Beziehung auswählen
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAddRelationship(true)}
                      className="text-xs"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Neu
                    </Button>
                  </div>

                  {relationships.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {relationships.map((rel) => (
                        <button
                          key={rel.id}
                          onClick={() => setSelectedRelationship(selectedRelationship?.id === rel.id ? null : rel)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            selectedRelationship?.id === rel.id
                              ? 'bg-accent text-accent-foreground'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }`}
                        >
                          {rel.name}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Noch keine Beziehungen angelegt. Klicke auf "Neu" um eine hinzuzufügen.
                    </p>
                  )}
                </div>
              )}

              {/* Resonance Wheel - Dimensions */}
              <div className="bg-card rounded-xl border border-border p-4 sm:p-6">
                <h3 className="text-base font-medium text-foreground mb-4 text-center">
                  Das Beziehungsrad – 10 Dimensionen
                </h3>
                <p className="text-xs text-muted-foreground text-center mb-6">
                  Wähle eine Dimension, die dich gerade beschäftigt, oder starte eine freie Reflexion.
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-6">
                  {DIMENSIONS.map((dim) => {
                    const Icon = dim.icon;
                    const isSelected = previewDimension === dim.key;
                    return (
                      <button
                        key={dim.key}
                        onClick={() => selectDimension(dim.key)}
                        className={`group flex flex-col items-center p-3 rounded-lg transition-all ${
                          isSelected 
                            ? 'bg-accent/20 border-accent/50 border' 
                            : 'bg-muted/50 hover:bg-accent/10 border border-transparent hover:border-accent/30'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-colors ${
                          isSelected ? 'bg-accent/30' : 'bg-accent/10 group-hover:bg-accent/20'
                        }`}>
                          <Icon className="w-4 h-4 text-accent" />
                        </div>
                        <span className={`text-xs font-medium transition-colors ${
                          isSelected ? 'text-accent' : 'text-foreground group-hover:text-accent'
                        }`}>
                          {dim.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Dimension Keywords Preview */}
                {previewDimension && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 bg-accent/5 rounded-lg border border-accent/20 p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      {(() => {
                        const dim = DIMENSIONS.find(d => d.key === previewDimension);
                        if (!dim) return null;
                        const Icon = dim.icon;
                        return (
                          <>
                            <Icon className="w-5 h-5 text-accent" />
                            <h4 className="text-sm font-medium text-foreground">{dim.label}</h4>
                          </>
                        );
                      })()}
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      {DIMENSIONS.find(d => d.key === previewDimension)?.desc}
                    </p>
                    <p className="text-xs text-muted-foreground mb-2 font-medium">
                      Typische Aspekte dieser Dimension:
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {DIMENSIONS.find(d => d.key === previewDimension)?.keywords.map((keyword, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded-full"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => startSession()}
                        className="bg-accent text-accent-foreground hover:bg-accent/90"
                        size="sm"
                      >
                        <Heart className="w-3 h-3 mr-1" />
                        Reflexion starten
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewDimension(null)}
                      >
                        Andere wählen
                      </Button>
                    </div>
                  </motion.div>
                )}

                {!previewDimension && (
                  <div className="text-center">
                    <Button
                      onClick={() => startSession()}
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Freie Reflexion starten
                    </Button>
                  </div>
                )}
              </div>

              {/* Philosophy Note */}
              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <p className="text-xs text-muted-foreground italic">
                  „Wie fühlt sich diese Beziehung in mir an – und was brauche ich gerade?"
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {/* Context Bar */}
              <div className="flex items-center justify-between bg-muted/30 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {selectedRelationship && (
                    <span className="bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                      {selectedRelationship.name}
                    </span>
                  )}
                  {selectedDimension && (
                    <span className="bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                      {DIMENSIONS.find(d => d.key === selectedDimension)?.label}
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetSession}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Neu
                </Button>
              </div>

              {/* Messages */}
              {/* Dimension Keywords Info Box */}
              {activeDimension && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-accent/10 rounded-lg border border-accent/20 p-3"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <activeDimension.icon className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium text-foreground">{activeDimension.label}</span>
                    <span className="text-xs text-muted-foreground">– {activeDimension.desc}</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-accent font-medium mb-1 block">Nährend:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeDimension.keywords.map((keyword, idx) => (
                          <span 
                            key={idx} 
                            className="text-xs bg-accent/20 text-foreground px-2 py-0.5 rounded-full border border-accent/30"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-destructive font-medium mb-1 block">Belastend:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeDimension.negativeKeywords.map((keyword, idx) => (
                          <span 
                            key={idx} 
                            className="text-xs bg-destructive/10 text-foreground px-2 py-0.5 rounded-full border border-destructive/30"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="bg-card rounded-xl border border-border p-4 min-h-[400px] max-h-[500px] overflow-y-auto">
                {messages.length === 0 && isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-6 h-6 text-accent animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((m, i) => (
                      <div
                        key={i}
                        className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-lg px-4 py-3 ${
                            m.role === 'user'
                              ? 'bg-accent text-accent-foreground'
                              : 'bg-muted text-foreground'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Schreibe hier..."
                  className="min-h-[60px] resize-none"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSubmit}
                  disabled={!input.trim() || isLoading}
                  className="bg-accent text-accent-foreground hover:bg-accent/90 px-4"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSaveDialog(true)}
                  className="text-xs"
                >
                  <Save className="w-3 h-3 mr-1" />
                  Im Tresor speichern
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/coach', { 
                    state: { 
                      initialMessage: `Ich möchte ein Thema aus meiner Beziehungsreflexion vertiefen${selectedRelationship ? ` (Beziehung mit ${selectedRelationship.name})` : ''}${selectedDimension ? `. Es geht um die Dimension "${DIMENSIONS.find(d => d.key === selectedDimension)?.label}"` : ''}.`
                    }
                  })}
                  className="text-xs"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  In Frag Oria vertiefen
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Oria ersetzt keine Therapie. Bei belastenden Themen suche professionelle Unterstützung.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Add Relationship Dialog */}
      <Dialog open={showAddRelationship} onOpenChange={setShowAddRelationship}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Neue Beziehung anlegen</DialogTitle>
            <DialogDescription>
              Gib der Beziehung einen Namen (z.B. Vorname) und wähle den Typ.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              value={newRelationshipName}
              onChange={(e) => setNewRelationshipName(e.target.value)}
              placeholder="Name der Person"
            />
            <div className="flex flex-wrap gap-2">
              {RELATIONSHIP_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setNewRelationshipType(type.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    newRelationshipType === type.value
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddRelationship(false)}>
              Abbrechen
            </Button>
            <Button onClick={addRelationship} disabled={!newRelationshipName.trim()}>
              Hinzufügen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Im Tresor speichern?</DialogTitle>
            <DialogDescription>
              Möchtest du diese Reflexion speichern?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={saveTitle}
              onChange={(e) => setSaveTitle(e.target.value)}
              placeholder="Titel für den Eintrag"
            />
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={discardAndReset}>
              Nicht speichern
            </Button>
            <Button onClick={saveToVault} disabled={!saveTitle.trim() || isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Info Dialog */}
      <Dialog open={showInfo} onOpenChange={setShowInfo}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-accent" />
              Was ist Oria Relationships?
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-medium text-foreground mb-2">Was Oria nicht ist</h4>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Keine Paartherapie-App</li>
                <li>Kein Diagnosetool</li>
                <li>Kein Bewertungs- oder Optimierungsinstrument</li>
                <li>Kein „Relationship Score"</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-2">Was Oria ist</h4>
              <p className="text-xs leading-relaxed">
                Oria ist ein innerer Begleiter, der Menschen dabei unterstützt, ihre Beziehungen bewusster wahrzunehmen, 
                eigene Gefühle, Bedürfnisse und Grenzen zu klären, Muster über Zeit zu erkennen, 
                und daraus stimmige nächste Schritte abzuleiten.
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs italic text-center">
                Zentral ist nicht die Frage: „Ist diese Beziehung gut oder schlecht?"<br />
                sondern: „Wie fühlt sich diese Beziehung in mir an – und was brauche ich gerade?"
              </p>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-2">Die 10 Dimensionen</h4>
              <p className="text-xs leading-relaxed mb-3">
                Die Dimensionen sind keine Eigenschaften von Personen, sondern erlebte Qualitäten im Beziehungsgeschehen:
              </p>
              <div className="grid grid-cols-2 gap-1 text-xs">
                {DIMENSIONS.map((dim) => (
                  <div key={dim.key} className="flex items-center gap-1">
                    <span className="text-accent">•</span>
                    <span>{dim.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-2">Theoretisches Fundament</h4>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li><strong>Erinnerung:</strong> Konkrete Situationen, emotionale Prägungen, Körperempfindungen</li>
                <li><strong>GFK:</strong> Gefühle & Bedürfnisse als Wegweiser</li>
                <li><strong>IFS:</strong> Innere Anteile, Schutzreaktionen, Selbstführung</li>
                <li><strong>Resonanzraum:</strong> Beziehung als Wechselwirkung von Innen & Außen</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowInfo(false)}>Verstanden</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="py-4 text-center border-t border-chapter-divider">
        <p className="text-xs text-muted-foreground">
          © 2025 Inner Guidance. <Link to="/impressum" className="underline hover:text-accent">Impressum</Link>
        </p>
      </footer>
    </div>
  );
};

export default OriaRelationships;

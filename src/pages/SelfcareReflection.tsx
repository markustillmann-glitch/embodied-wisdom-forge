import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Send, RotateCcw, Save, Sparkles, Heart, Flower2, Calendar, ChevronDown, ChevronUp, Flame, Trophy, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { PolygonalBackground } from '@/components/PolygonalBackground';
import { Header } from '@/components/Header';
import bbOwlLogo from '@/assets/bb-owl-new.png';
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
import { format, differenceInDays, isToday, isYesterday, startOfDay } from 'date-fns';
import { de } from 'date-fns/locale';

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/selfcare-chat`;

type StatementCategory = 'selfcare' | 'gfk' | 'ifs';

interface StatementWithCategory {
  text: string;
  category: StatementCategory;
}

const SELFCARE_STATEMENTS: StatementWithCategory[] = [
  // Originale Statements (Selfcare)
  { text: "Manchmal gewinnt man, manchmal lernt man", category: "selfcare" },
  { text: "Wachse und gedeihe", category: "selfcare" },
  { text: "Umgib dich mit Menschen, die dich wachsen sehen wollen", category: "selfcare" },
  { text: "Betrachte die Welt, als würdest du sie zum ersten Mal sehen", category: "selfcare" },
  { text: "Je stiller du bist, desto mehr wirst du hören", category: "selfcare" },
  { text: "Scheue dich nie, um die Hilfe zu bitten, die du brauchst", category: "selfcare" },
  { text: "Begrenze nicht die Herausforderungen, fordere die Grenzen heraus", category: "selfcare" },
  { text: "Vergleichen macht unglücklich", category: "selfcare" },
  { text: "Weniger scrollen, mehr leben", category: "selfcare" },
  { text: "Lass ab von dem, was war, und vertraue dem, was kommt", category: "selfcare" },
  { text: "Eine Umarmung macht alles besser", category: "selfcare" },
  { text: "Finde heraus, was du brauchst, scheue dich nicht, darum zu bitten", category: "selfcare" },
  { text: "Du kontrollierst deine Finanzen, nicht sie dich", category: "selfcare" },
  { text: "Aus kleinen Samen wachsen mächtige Bäume", category: "selfcare" },
  { text: "Nimm jeden Tag, wie er kommt", category: "selfcare" },
  { text: "Ein Duft kann tausend Erinnerungen zurückbringen", category: "selfcare" },
  { text: "Es sind die kleinen Dinge, die den größten Unterschied machen", category: "selfcare" },
  { text: "Die Welt gehört jenen, die lesen", category: "selfcare" },
  { text: "Kreativität ist eine unendliche Ressource: je mehr du sie nutzt, desto mehr hast du", category: "selfcare" },
  { text: "Das Leben ist ein Song: Singe!", category: "selfcare" },
  { text: "To do: Lebe den Moment", category: "selfcare" },
  { text: "Aufgeräumtes Haus, aufgeräumte Seele", category: "selfcare" },
  { text: "Wenn nicht jetzt, wann dann?", category: "selfcare" },
  { text: "Manchmal ist Entspannung das Produktivste, was man tun kann", category: "selfcare" },
  { text: "Verwandle Angst in Energie", category: "selfcare" },
  { text: "Achte auf dich von innen heraus", category: "selfcare" },
  { text: "Entwickle gesunde Gewohnheiten, nicht Einschränkungen", category: "selfcare" },
  { text: "Kleine Schritte führen zu großen Veränderungen", category: "selfcare" },
  { text: "Entspannen, erfrischen, erholen", category: "selfcare" },
  { text: "Kreiere deine eigene Stille", category: "selfcare" },
  { text: "Lehre dich die Kunst des Ausruhens", category: "selfcare" },
  { text: "Dein Heim ist ein Zufluchtsort: erfülle es mit Frieden", category: "selfcare" },
  { text: "Tanke neue Kraft, erneuere deinen Geist", category: "selfcare" },
  { text: "Verliebe dich in deine Selbstpflege", category: "selfcare" },
  { text: "Nimm dir Zeit für Dinge, die deine Seele glücklich machen", category: "selfcare" },
  { text: "In der Selbstfreundlichkeit liegt die Kraft", category: "selfcare" },
  { text: "Verbringe Quality Time mit dir selbst", category: "selfcare" },
  { text: "Lass dich von der Natur beleben", category: "selfcare" },
  { text: "Auf Regen folgt immer Sonnenschein", category: "selfcare" },
  { text: "Folge keinem Weg – gehe deinen eigenen", category: "selfcare" },
  { text: "Beruhige deinen Geist, befreie deinen Körper", category: "selfcare" },
  { text: "Dein größter Reichtum ist deine Gesundheit", category: "selfcare" },
  { text: "Nähre dich, um zu gedeihen", category: "selfcare" },
  { text: "Beginne jeden Tag mit einem positiven Gedanken und sieh, wohin er dich führt", category: "selfcare" },
  { text: "Wie du mit dir selbst sprichst, macht viel aus", category: "selfcare" },
  { text: "Das Leben ist schöner, wenn man es mit einem Freund teilt", category: "selfcare" },
  { text: "Sei freundlich zu dir selbst – du gibst dein Bestes", category: "selfcare" },
  { text: "Es gibt immer etwas, für das man dankbar sein kann", category: "selfcare" },
  { text: "Sei kämpferisch, nicht grüblerisch", category: "selfcare" },
  { text: "So, wie du bist, bist du genug", category: "selfcare" },
  { text: "Das Leben ist schöner, wenn man lacht", category: "selfcare" },
  { text: "In der Einfachheit liegt so viel Schönheit", category: "selfcare" },
  { text: "Du darfst langsam sein", category: "selfcare" },
  { text: "Ruhe ist kein Stillstand, sondern Regeneration", category: "selfcare" },
  { text: "Höre auf deinen Körper – er spricht mit dir", category: "selfcare" },
  { text: "Selbstfürsorge ist kein Luxus, sondern eine Grundlage", category: "selfcare" },
  { text: "Du musst nicht alles heute schaffen", category: "selfcare" },
  { text: "Deine Bedürfnisse sind wichtig", category: "selfcare" },
  { text: "Atme ein – lass los", category: "selfcare" },
  { text: "Grenzen setzen ist ein Akt der Selbstachtung", category: "selfcare" },
  { text: "Nicht jeder Tag muss produktiv sein", category: "selfcare" },
  { text: "Du darfst Pausen machen, ohne sie zu rechtfertigen", category: "selfcare" },
  { text: "Sanftheit ist auch eine Stärke", category: "selfcare" },
  { text: "Dein Wert hängt nicht von deiner Leistung ab", category: "selfcare" },
  { text: "Manchmal ist genug wirklich genug", category: "selfcare" },
  { text: "Erholung ist Teil des Weges, nicht die Abweichung", category: "selfcare" },
  { text: "Sei geduldig mit deinem Prozess", category: "selfcare" },
  
  // GfK-inspirierte Statements
  { text: "Ich wünsche mir, gehört zu werden, ohne mich rechtfertigen zu müssen", category: "gfk" },
  { text: "Mir ist wichtig, dass mein Beitrag ernst genommen wird", category: "gfk" },
  { text: "Ich brauche Raum, um mich in meinem Tempo zu entwickeln", category: "gfk" },
  { text: "Ich sehne mich nach Klarheit darüber, was von mir erwartet wird", category: "gfk" },
  { text: "Ich möchte mich sicher fühlen, wenn ich meine Meinung äußere", category: "gfk" },
  { text: "Mir tut es gut, wenn meine Anstrengungen gesehen werden", category: "gfk" },
  { text: "Ich brauche Verlässlichkeit, um entspannen zu können", category: "gfk" },
  { text: "Ich wünsche mir Verbindung, ohne mich verbiegen zu müssen", category: "gfk" },
  { text: "Mir ist wichtig, selbst entscheiden zu dürfen", category: "gfk" },
  { text: "Ich brauche Pausen, um meine Kraft zu bewahren", category: "gfk" },
  { text: "Ich möchte verstehen, was hinter dem Verhalten anderer steht", category: "gfk" },
  { text: "Mir gibt es Ruhe, wenn Absprachen eingehalten werden", category: "gfk" },
  { text: "Ich wünsche mir Wertschätzung – auch für kleine Schritte", category: "gfk" },
  { text: "Ich brauche Orientierung, um mich sicher zu fühlen", category: "gfk" },
  { text: "Ich möchte dazugehören, ohne mich anpassen zu müssen", category: "gfk" },
  { text: "Mir ist Fairness wichtig, auch wenn Meinungen unterschiedlich sind", category: "gfk" },
  { text: "Ich brauche Zeit, um Vertrauen aufzubauen", category: "gfk" },
  { text: "Ich wünsche mir Offenheit für meine Perspektive", category: "gfk" },
  { text: "Mir ist Ehrlichkeit wichtig, auch wenn sie unbequem ist", category: "gfk" },
  { text: "Ich brauche Unterstützung, ohne dafür schwach zu sein", category: "gfk" },
  { text: "Ich möchte mich wirksam erleben in dem, was ich tue", category: "gfk" },
  { text: "Mir ist es wichtig, respektvoll behandelt zu werden", category: "gfk" },
  { text: "Ich brauche Verständnis für meine Grenzen", category: "gfk" },
  { text: "Ich wünsche mir Leichtigkeit neben all der Verantwortung", category: "gfk" },
  { text: "Mir gibt es Kraft, wenn ich mich verbunden fühle", category: "gfk" },
  { text: "Ich brauche Stabilität, um mutig sein zu können", category: "gfk" },
  { text: "Ich möchte lernen dürfen, ohne bewertet zu werden", category: "gfk" },
  { text: "Mir ist Transparenz wichtig, um Vertrauen zu entwickeln", category: "gfk" },
  { text: "Ich brauche Anerkennung für das, was mir wichtig ist", category: "gfk" },
  { text: "Ich wünsche mir Gleichwertigkeit im Miteinander", category: "gfk" },
  { text: "Ich möchte mich zeigen dürfen, so wie ich bin", category: "gfk" },
  { text: "Mir ist wichtig, dass meine Bedürfnisse Platz haben", category: "gfk" },
  { text: "Ich brauche Ruhe, um meine Gedanken zu sortieren", category: "gfk" },
  { text: "Ich wünsche mir Kooperation statt Konkurrenz", category: "gfk" },
  { text: "Mir gibt es Sicherheit, wenn Konflikte offen angesprochen werden", category: "gfk" },
  { text: "Ich brauche Sinn in dem, was ich tue", category: "gfk" },
  { text: "Ich möchte mich respektiert fühlen – auch bei Unterschiedlichkeit", category: "gfk" },
  { text: "Mir ist es wichtig, lernen und wachsen zu dürfen", category: "gfk" },
  { text: "Ich brauche Verbundenheit, besonders in schwierigen Momenten", category: "gfk" },
  { text: "Ich wünsche mir Vertrauen in meine Fähigkeiten", category: "gfk" },
  { text: "Ich möchte Entscheidungen mittragen können, die mich betreffen", category: "gfk" },
  { text: "Mir ist wichtig, dass Gefühle ernst genommen werden", category: "gfk" },
  { text: "Ich brauche Erholung, um langfristig präsent zu sein", category: "gfk" },
  { text: "Ich wünsche mir Mitgefühl – auch für mich selbst", category: "gfk" },
  { text: "Mir gibt es Halt, wenn ich nicht alleine bin", category: "gfk" },
  { text: "Ich brauche Freiheit innerhalb klarer Strukturen", category: "gfk" },
  { text: "Ich möchte beitragen, auf eine Weise, die stimmig für mich ist", category: "gfk" },
  { text: "Mir ist wichtig, gesehen zu werden – nicht nur meine Leistung", category: "gfk" },
  { text: "Ich brauche Hoffnung, um dranzubleiben", category: "gfk" },
  { text: "Ich wünsche mir ein Miteinander, das nährt statt erschöpft", category: "gfk" },
  
  // IFS-inspirierte Statements
  { text: "Ein Teil von mir meint es gut, auch wenn sein Verhalten mich belastet", category: "ifs" },
  { text: "Ich darf neugierig auf meine inneren Reaktionen sein", category: "ifs" },
  { text: "Nicht alles in mir will dasselbe – und das ist okay", category: "ifs" },
  { text: "Manche Teile versuchen, mich vor alten Verletzungen zu schützen", category: "ifs" },
  { text: "Ich kann mir selbst mit Freundlichkeit begegnen", category: "ifs" },
  { text: "Gefühle sind Signale, keine Befehle", category: "ifs" },
  { text: "Ich darf innehalten, bevor ich reagiere", category: "ifs" },
  { text: "Es gibt in mir einen ruhigen, klaren Ort", category: "ifs" },
  { text: "Auch widersprüchliche Anteile gehören zu mir", category: "ifs" },
  { text: "Ich muss keinen Teil loswerden, um ganz zu sein", category: "ifs" },
  { text: "Ein Teil von mir trägt eine Geschichte, die gehört werden will", category: "ifs" },
  { text: "Ich kann beobachten, ohne mich zu verlieren", category: "ifs" },
  { text: "Schutzstrategien entstanden aus Notwendigkeit", category: "ifs" },
  { text: "Ich darf lernen, meine inneren Stimmen zu unterscheiden", category: "ifs" },
  { text: "Nicht jeder Impuls braucht sofortige Handlung", category: "ifs" },
  { text: "Ich kann meine Anteile würdigen, ohne ihnen zu folgen", category: "ifs" },
  { text: "Manche Teile sind sehr alt, auch wenn sie sich heute melden", category: "ifs" },
  { text: "Ich darf Tempo rausnehmen, wenn es sich zu viel anfühlt", category: "ifs" },
  { text: "Ich bin mehr als meine stärksten Gefühle", category: "ifs" },
  { text: "Es ist möglich, inneren Konflikten mit Mitgefühl zu begegnen", category: "ifs" },
  { text: "Ein Teil von mir möchte Kontrolle, ein anderer Ruhe", category: "ifs" },
  { text: "Ich kann Raum schaffen zwischen Reiz und Reaktion", category: "ifs" },
  { text: "Auch innere Kritiker hatten einmal eine gute Absicht", category: "ifs" },
  { text: "Ich darf meine Verletzlichkeit schützen, ohne mich zu verschließen", category: "ifs" },
  { text: "Nicht jeder Teil braucht Veränderung – manche brauchen Verständnis", category: "ifs" },
  { text: "Ich kann lernen, mir selbst Sicherheit zu geben", category: "ifs" },
  { text: "Innere Anteile dürfen sich verändern, wenn sie sich gesehen fühlen", category: "ifs" },
  { text: "Ich muss nichts erzwingen, um mich zu entwickeln", category: "ifs" },
  { text: "Ich darf neugierig sein statt wertend", category: "ifs" },
  { text: "Mein inneres Erleben ist komplex – und das ist menschlich", category: "ifs" },
  { text: "Ich kann meine Aufmerksamkeit bewusst lenken", category: "ifs" },
  { text: "Ein Teil von mir darf Pause machen", category: "ifs" },
  { text: "Auch starke Emotionen können gehalten werden", category: "ifs" },
  { text: "Ich bin nicht falsch, weil es in mir laut ist", category: "ifs" },
  { text: "Ich darf Verantwortung übernehmen, ohne mich zu überfordern", category: "ifs" },
  { text: "Meine inneren Erfahrungen verdienen Respekt", category: "ifs" },
  { text: "Ich kann lernen, mir selbst zuzuhören", category: "ifs" },
  { text: "Innere Führung fühlt sich ruhig und klar an", category: "ifs" },
  { text: "Ich darf alte Muster würdigen und neue wählen", category: "ifs" },
  { text: "Es ist möglich, innerlich verbunden zu sein, auch im Chaos", category: "ifs" },
  { text: "Ich kann zwischen mir und meinen Anteilen unterscheiden", category: "ifs" },
  { text: "Nicht alles, was dringend wirkt, ist wirklich dringend", category: "ifs" },
  { text: "Ich darf mir selbst ein sicherer Ort sein", category: "ifs" },
  { text: "Auch ungeliebte Teile gehören zu meinem System", category: "ifs" },
  { text: "Veränderung beginnt oft mit Zuhören", category: "ifs" },
  { text: "Ich kann meine innere Welt erforschen, ohne sie zu kontrollieren", category: "ifs" },
  { text: "Manche Teile brauchen Geduld, keine Lösung", category: "ifs" },
  { text: "Ich darf mir selbst vertrauen lernen", category: "ifs" },
  { text: "In mir gibt es Ressourcen, auch wenn ich sie gerade nicht spüre", category: "ifs" },
  { text: "Ich kann mich innerlich führen – Schritt für Schritt", category: "ifs" }
];

const categoryLabels: Record<StatementCategory, { label: string; color: string; bg: string }> = {
  selfcare: { label: "Selfcare", color: "text-pink-600", bg: "bg-pink-500/15" },
  gfk: { label: "GfK", color: "text-emerald-600", bg: "bg-emerald-500/15" },
  ifs: { label: "IFS", color: "text-violet-600", bg: "bg-violet-500/15" },
};

type Message = { role: "user" | "assistant"; content: string };
type SelfcareMemory = {
  id: string;
  title: string;
  content: string;
  memory_date: string;
  summary: string | null;
  created_at: string;
};

// Gamification: Calculate streak from reflections
const calculateStreak = (memories: SelfcareMemory[]): number => {
  if (memories.length === 0) return 0;
  
  const sortedDates = memories
    .map(m => startOfDay(new Date(m.created_at || m.memory_date)))
    .sort((a, b) => b.getTime() - a.getTime());
  
  const uniqueDates = [...new Set(sortedDates.map(d => d.getTime()))].map(t => new Date(t));
  
  let streak = 0;
  const today = startOfDay(new Date());
  
  for (let i = 0; i < uniqueDates.length; i++) {
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    
    const diff = differenceInDays(startOfDay(expectedDate), startOfDay(uniqueDates[i]));
    
    if (diff === 0) {
      streak++;
    } else if (i === 0 && diff === 1) {
      // Today not yet done, check if yesterday was done
      continue;
    } else {
      break;
    }
  }
  
  return streak;
};

// Gamification badges
const getBadges = (totalReflections: number, streak: number) => {
  const badges = [];
  
  if (totalReflections >= 1) badges.push({ icon: '🌱', label: 'Erste Schritte', desc: 'Erste Reflexion gemacht' });
  if (totalReflections >= 7) badges.push({ icon: '🌿', label: 'Wachsend', desc: '7 Reflexionen' });
  if (totalReflections >= 30) badges.push({ icon: '🌳', label: 'Verwurzelt', desc: '30 Reflexionen' });
  if (totalReflections >= 100) badges.push({ icon: '✨', label: 'Leuchtend', desc: '100 Reflexionen' });
  
  if (streak >= 3) badges.push({ icon: '🔥', label: '3-Tage-Streak', desc: '3 Tage in Folge' });
  if (streak >= 7) badges.push({ icon: '💫', label: 'Wochenkrieger', desc: '7 Tage in Folge' });
  if (streak >= 30) badges.push({ icon: '🏆', label: 'Meister', desc: '30 Tage in Folge' });
  
  return badges;
};

const SelfcareReflection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStatement, setCurrentStatement] = useState<StatementWithCategory | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [hideStatementBanner, setHideStatementBanner] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Past reflections state
  const [pastReflections, setPastReflections] = useState<SelfcareMemory[]>([]);
  const [showPastReflections, setShowPastReflections] = useState(false);
  const [loadingPast, setLoadingPast] = useState(false);
  const [streak, setStreak] = useState(0);
  const [reflectedToday, setReflectedToday] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load past reflections
  useEffect(() => {
    if (user) {
      loadPastReflections();
    }
  }, [user]);

  const loadPastReflections = async () => {
    if (!user) return;
    setLoadingPast(true);
    try {
      const { data, error } = await supabase
        .from('memories')
        .select('id, title, content, memory_date, summary, created_at')
        .eq('user_id', user.id)
        .eq('memory_type', 'selfcare-reflection')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      const memories = (data || []) as SelfcareMemory[];
      setPastReflections(memories);
      
      // Calculate streak
      const currentStreak = calculateStreak(memories);
      setStreak(currentStreak);
      
      // Check if reflected today
      const todayReflection = memories.some(m => isToday(new Date(m.created_at)));
      setReflectedToday(todayReflection);
    } catch (error) {
      console.error('Error loading past reflections:', error);
    } finally {
      setLoadingPast(false);
    }
  };

  const groupReflectionsByMonth = () => {
    const groups: { [key: string]: SelfcareMemory[] } = {};
    pastReflections.forEach(reflection => {
      const date = new Date(reflection.created_at || reflection.memory_date);
      const monthKey = format(date, 'MMMM yyyy', { locale: de });
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(reflection);
    });
    return groups;
  };

  // Handle autostart from URL params (when coming from Index page)
  useEffect(() => {
    const impulse = searchParams.get('impulse');
    const autostart = searchParams.get('autostart');
    
    if (impulse && autostart === 'true' && !sessionStarted) {
      // Find the statement that matches the impulse or create a custom one
      const matchingStatement = SELFCARE_STATEMENTS.find(s => s.text === impulse);
      const statement = matchingStatement || { text: impulse, category: 'selfcare' as StatementCategory };
      
      setCurrentStatement(statement);
      setSessionStarted(true);
      setHideStatementBanner(true);
      
      // Start with an opening question about the impulse
      const openingMessage: Message = {
        role: 'assistant',
        content: `„${impulse}"\n\nDieser Impuls begleitet dich heute. Was geht dir durch den Kopf, wenn du ihn liest? Gibt es etwas in deinem Leben gerade, das damit in Verbindung steht?`
      };
      setMessages([openingMessage]);
      setConversationHistory([openingMessage]);
      
      // Clear the URL params to prevent re-triggering
      navigate('/selfcare-reflection', { replace: true });
    }
  }, [searchParams, sessionStarted, navigate]);

  const getRandomStatement = (): StatementWithCategory => {
    const randomIndex = Math.floor(Math.random() * SELFCARE_STATEMENTS.length);
    return SELFCARE_STATEMENTS[randomIndex];
  };

  const getRandomImpulse = (): string => {
    const randomIndex = Math.floor(Math.random() * SELFCARE_STATEMENTS.length);
    return SELFCARE_STATEMENTS[randomIndex].text;
  };

  const startWithRandomImpulse = () => {
    const impulse = getRandomImpulse();
    const matchingStatement = SELFCARE_STATEMENTS.find(s => s.text === impulse);
    const statement = matchingStatement || { text: impulse, category: 'selfcare' as StatementCategory };
    setCurrentStatement(statement);
    setSessionStarted(true);
    setHideStatementBanner(true);
    
    // Start with an opening question about the impulse
    const openingMessage: Message = {
      role: 'assistant',
      content: `„${impulse}"\n\nDieser Impuls begleitet dich heute. Was geht dir durch den Kopf, wenn du ihn liest? Gibt es etwas in deinem Leben gerade, das damit in Verbindung steht?`
    };
    setMessages([openingMessage]);
    setConversationHistory([openingMessage]);
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
    
    // Verschiedene Einleitungsvarianten für mehr Abwechslung - Statement wird separat angezeigt
    const introVariants = [
      `Nimm dir einen Moment, diesen Gedanken auf dich wirken zu lassen.\n\nWas spürst du, wenn du diesen Satz liest? Welche Resonanz entsteht in dir – vielleicht Zustimmung, Widerstand, Sehnsucht oder Neugier?`,
      `Lass diesen Gedanken einen Moment in dir ankommen.\n\nWas löst er aus? Ein Gefühl, eine Erinnerung, vielleicht einen inneren Widerspruch?`,
      `Spüre in dich hinein: Was passiert, wenn du diese Worte liest?\n\nGibt es eine körperliche Reaktion, ein Gefühl, einen Gedanken?`,
      `Nimm dir Zeit, diese Worte wirken zu lassen.\n\nWelche Saite wird in dir angeschlagen? Resonanz, Sehnsucht, vielleicht auch Skepsis?`,
      `Bevor wir tiefer gehen – was bemerkst du zuerst?\n\nEin Gefühl? Einen Gedanken? Eine körperliche Empfindung?`
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
    streamChat(userMessage, conversationHistory, currentStatement?.text || "");
  };

  const resetSession = () => {
    if (conversationHistory.length > 1) {
      setShowSaveDialog(true);
    } else {
      setSessionStarted(false);
      setMessages([]);
      setConversationHistory([]);
      setCurrentStatement(null);
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

    const title = saveTitle.trim() || `Selfcare: ${currentStatement?.text.substring(0, 40)}...`;

    try {
      const { error } = await supabase.from('memories').insert({
        user_id: user.id,
        title: title,
        content: content,
        memory_type: 'selfcare-reflection',
        summary: `Reflexion über: "${currentStatement?.text}"`,
        created_at: new Date().toISOString()
      });

      if (error) throw error;

      // Check for streak achievements
      const newStreak = streak + (reflectedToday ? 0 : 1);
      if (newStreak === 3) {
        toast.success('🔥 3-Tage-Streak erreicht! Weiter so!');
      } else if (newStreak === 7) {
        toast.success('💫 Wochenkrieger! 7 Tage in Folge!');
      } else if (newStreak === 30) {
        toast.success('🏆 Meister! 30 Tage in Folge reflektiert!');
      } else {
        toast.success('Reflexion im Tresor gespeichert 💫');
      }

      setShowSaveDialog(false);
      setSaveTitle("");
      setSessionStarted(false);
      setMessages([]);
      setConversationHistory([]);
      setCurrentStatement(null);
      loadPastReflections(); // Reload to update stats
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
    setCurrentStatement(null);
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
      context: `Ich komme aus einer Selfcare-Reflexion über den Impuls: "${currentStatement?.text}"\n\nHier ist unser bisheriges Gespräch:\n${context}\n\nIch möchte dieses Thema tiefer erkunden.`,
      topic: `Selfcare: ${currentStatement?.text.substring(0, 50)}`,
      source: 'selfcare-reflection'
    };
    
    sessionStorage.setItem('coach-deepen-context', JSON.stringify(deepenData));
    navigate('/coach?new=true');
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
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
                Selfcare Impulse
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-sm text-muted-foreground max-w-xl hidden sm:block mt-3"
            >
              Oria begleitet dich bei der Reflexion über Impulse für dein Wohlbefinden
            </motion.p>
          </div>
        </div>
      </section>

      {/* Chat Area */}
      <section className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-3 sm:px-6 min-h-0">
        {!sessionStarted ? (
          /* Welcome Screen */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex flex-col items-center justify-center text-center py-4 sm:py-8 px-2 pb-24 md:pb-8"
          >
            {/* Gamification Stats - Only show if user has reflections */}
            {user && pastReflections.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="w-full max-w-md mb-6"
              >
                <div className="flex justify-center gap-4 mb-4">
                  {/* Streak */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
                    <Flame className={`w-5 h-5 ${streak > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
                    <div className="text-left">
                      <p className={`text-lg font-bold ${streak > 0 ? 'text-orange-500' : 'text-muted-foreground'}`}>{streak}</p>
                      <p className="text-[10px] text-muted-foreground">Tage Streak</p>
                    </div>
                  </div>
                  
                  {/* Total */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
                    <Star className="w-5 h-5 text-accent" />
                    <div className="text-left">
                      <p className="text-lg font-bold text-foreground">{pastReflections.length}</p>
                      <p className="text-[10px] text-muted-foreground">Reflexionen</p>
                    </div>
                  </div>
                  
                  {/* Today status */}
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${reflectedToday ? 'bg-green-500/10 border-green-500/30' : 'bg-card border-border'}`}>
                    <Trophy className={`w-5 h-5 ${reflectedToday ? 'text-green-500' : 'text-muted-foreground'}`} />
                    <div className="text-left">
                      <p className={`text-xs font-medium ${reflectedToday ? 'text-green-600' : 'text-muted-foreground'}`}>
                        {reflectedToday ? 'Erledigt!' : 'Heute'}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{reflectedToday ? '✓' : 'offen'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Badges - show earned badges */}
                {getBadges(pastReflections.length, streak).length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {getBadges(pastReflections.length, streak).slice(0, 4).map((badge, idx) => (
                      <div 
                        key={idx} 
                        className="group relative px-2 py-1 bg-accent/10 rounded-full text-xs flex items-center gap-1 cursor-help"
                        title={badge.desc}
                      >
                        <span>{badge.icon}</span>
                        <span className="text-accent hidden sm:inline">{badge.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Daily Impulse Card */}
            <div className="w-full max-w-md mb-6">
              <div className="inline-flex items-center gap-2 text-accent text-sm font-medium mb-3">
                <Flower2 className="w-4 h-4" />
                <span>Impuls des Tages</span>
              </div>
              
              <div className="relative bg-card rounded-xl p-6 border border-border shadow-sm">
                <div className="absolute top-3 left-4 text-accent/20 text-2xl font-serif">"</div>
                <div className="absolute bottom-3 right-4 text-accent/20 text-2xl font-serif rotate-180">"</div>
                
                <p className="font-serif text-lg md:text-xl text-foreground leading-relaxed px-4">
                  {getRandomImpulse()}
                </p>
              </div>
              
              <Button 
                onClick={startWithRandomImpulse}
                className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90 h-12 px-6 touch-manipulation active:scale-95 transition-transform"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Diesen Impuls reflektieren
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground/70 mb-4">oder</p>
            
            <Button 
              onClick={startSession}
              variant="outline"
              className="touch-manipulation"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Anderen Impuls reflektieren
            </Button>

            {/* Past Reflections Section */}
            {user && pastReflections.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 w-full max-w-md"
              >
                <button
                  onClick={() => setShowPastReflections(!showPastReflections)}
                  className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full py-2 touch-manipulation"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Vergangene Reflexionen ({pastReflections.length})</span>
                  {showPastReflections ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showPastReflections && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 space-y-4 max-h-64 overflow-y-auto"
                  >
                    {Object.entries(groupReflectionsByMonth()).map(([month, reflections]) => (
                      <div key={month}>
                        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 sticky top-0 bg-background py-1">
                          {month}
                        </h4>
                        <div className="space-y-2">
                          {reflections.map(reflection => (
                            <button
                              key={reflection.id}
                              onClick={() => navigate('/vault')}
                              className="w-full text-left p-3 bg-card rounded-lg border border-border hover:border-accent/50 transition-colors touch-manipulation"
                            >
                              <div className="flex justify-between items-start gap-2">
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-foreground truncate">{reflection.title}</p>
                                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{reflection.summary}</p>
                                </div>
                                <span className="text-xs text-muted-foreground shrink-0">
                                  {format(new Date(reflection.created_at || reflection.memory_date), 'dd.MM.', { locale: de })}
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
          <div className="flex-1 flex flex-col min-h-0">
            {/* Current Statement Banner - Only show if not hidden */}
            {!hideStatementBanner && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-4 p-4 bg-card rounded-lg border border-border shrink-0"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <Flower2 className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Dein Impuls</p>
                    <p className="font-serif text-foreground leading-relaxed">
                      {currentStatement?.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Messages - Scrollable area with padding for fixed input */}
            <div className="flex-1 overflow-y-auto pb-36 md:pb-4 space-y-4">
              {messages.map((message, index) => (
                <ChatMessage key={index} content={message.content} role={message.role} />
              ))}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <Flower2 className="w-4 h-4 text-accent" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Fixed on mobile, relative on desktop */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border/50 px-4 py-3 safe-area-pb md:relative md:border-t-0 md:bg-transparent md:backdrop-blur-none md:px-0 md:py-0 md:mt-4">
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
                    className="h-12 w-12 shrink-0 bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 mt-2 justify-center pb-2 md:pb-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetSession}
                    className="text-muted-foreground text-xs h-9 px-4"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Neuer Impuls
                  </Button>
                  {conversationHistory.length > 2 && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={deepenInOria}
                      className="text-accent border-accent/30 hover:bg-accent/10 text-xs h-9 px-4"
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
      </section>

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
            <Button onClick={saveToVault} className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Save className="w-4 h-4 mr-1" />
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer - Hidden on mobile when session started to not interfere with fixed input */}
      <footer className={`py-4 px-4 border-t border-border/30 text-center shrink-0 ${sessionStarted ? 'hidden md:block' : ''}`}>
        <p className="text-xs text-muted-foreground">
          © 2025 Oria · Selfcare Impulse
        </p>
      </footer>
    </div>
  );
};

export default SelfcareReflection;

import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Send, RotateCcw, Save, Sparkles, Heart, Flower2, Calendar, ChevronDown, ChevronUp, Flame, Star, MapPin, Lock, MessageSquare, Play, Trash2, X, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

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
import { GamificationDashboard } from '@/components/gamification';

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/selfcare-chat`;
const SUMMARY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-summary`;

type StatementCategory = 'selfcare' | 'gfk';

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
  
];

const categoryLabels: Record<StatementCategory, { label: string; color: string; bg: string }> = {
  selfcare: { label: "Selfcare", color: "text-pink-600", bg: "bg-pink-500/15" },
  gfk: { label: "GfK", color: "text-emerald-600", bg: "bg-emerald-500/15" },
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

// Type for ongoing conversations
type OngoingConversation = {
  id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
  statement?: string;
  messageCount?: number;
  lastMessage?: string;
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
  
  // Summary feature state
  const [wantsSummary, setWantsSummary] = useState(false);
  const [saveLocation, setSaveLocation] = useState("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState<any>(null);
  
  // Past reflections state
  const [pastReflections, setPastReflections] = useState<SelfcareMemory[]>([]);
  const [showPastReflections, setShowPastReflections] = useState(false);
  const [loadingPast, setLoadingPast] = useState(false);
  const [streak, setStreak] = useState(0);
  const [reflectedToday, setReflectedToday] = useState(false);
  const [displayedImpulse] = useState<StatementWithCategory>(() => {
    const randomIndex = Math.floor(Math.random() * SELFCARE_STATEMENTS.length);
    return SELFCARE_STATEMENTS[randomIndex];
  });
  
  // Ongoing conversations state
  const [ongoingConversations, setOngoingConversations] = useState<OngoingConversation[]>([]);
  const [showOngoingConversations, setShowOngoingConversations] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  
  // Gamification state
  const [showGamification, setShowGamification] = useState(false);
  
  // Reflection mode state
  type ReflectionMode = 'impulse' | 'situation';
  const [reflectionMode, setReflectionMode] = useState<ReflectionMode>('impulse');

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
      loadOngoingConversations();
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

  // Load ongoing conversations
  const loadOngoingConversations = async () => {
    if (!user) return;
    setLoadingConversations(true);
    try {
      // Get conversations with message count
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select('id, title, created_at, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Get message counts and last messages for each conversation
      const conversationsWithDetails = await Promise.all(
        (conversations || []).map(async (conv) => {
          const { data: messages, error: msgError } = await supabase
            .from('messages')
            .select('content, role')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(10);

          const lastUserMessage = messages?.find(m => m.role === 'user');
          
          return {
            ...conv,
            messageCount: messages?.length || 0,
            lastMessage: lastUserMessage?.content?.substring(0, 80) || conv.title || 'Keine Nachrichten',
          };
        })
      );

      setOngoingConversations(conversationsWithDetails);
    } catch (error) {
      console.error('Error loading ongoing conversations:', error);
    } finally {
      setLoadingConversations(false);
    }
  };

  // Save current conversation to database
  const saveConversationToDb = async (msgs: Message[], statement: string, convId?: string) => {
    if (!user || msgs.length < 2) return convId || null;

    try {
      let conversationId = convId;
      
      if (!conversationId) {
        // Create new conversation
        const title = statement ? `${statement.substring(0, 50)}...` : 'Selfcare-Reflexion';
        const { data: newConv, error: convError } = await supabase
          .from('conversations')
          .insert({
            user_id: user.id,
            title: title,
          })
          .select('id')
          .single();

        if (convError) throw convError;
        conversationId = newConv.id;
        setCurrentConversationId(conversationId);
      } else {
        // Update timestamp
        await supabase
          .from('conversations')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', conversationId);
      }

      // Delete existing messages and insert all
      await supabase
        .from('messages')
        .delete()
        .eq('conversation_id', conversationId);

      const messagesToInsert = msgs.map((msg, index) => ({
        conversation_id: conversationId,
        role: msg.role,
        content: msg.content,
        created_at: new Date(Date.now() + index).toISOString(),
      }));

      const { error: msgError } = await supabase
        .from('messages')
        .insert(messagesToInsert);

      if (msgError) throw msgError;

      return conversationId;
    } catch (error) {
      console.error('Error saving conversation:', error);
      return convId || null;
    }
  };

  // Resume a conversation
  const resumeConversation = async (conversationId: string) => {
    if (!user) return;

    try {
      // Load conversation
      const { data: conv, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();

      if (convError) throw convError;

      // Load messages
      const { data: msgs, error: msgError } = await supabase
        .from('messages')
        .select('role, content')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (msgError) throw msgError;

      const loadedMessages: Message[] = (msgs || []).map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

      // Extract statement from title if possible
      const titleMatch = conv.title?.match(/^(.+?)\.\.\.$/);
      const statementText = titleMatch ? titleMatch[1] : conv.title || 'Selfcare-Reflexion';
      
      setCurrentStatement({ text: statementText, category: 'selfcare' });
      setMessages(loadedMessages);
      setConversationHistory(loadedMessages);
      setCurrentConversationId(conversationId);
      setSessionStarted(true);
      setHideStatementBanner(true);
      setShowOngoingConversations(false);

      toast.success('Unterhaltung wird fortgesetzt');
    } catch (error) {
      console.error('Error resuming conversation:', error);
      toast.error('Fehler beim Laden der Unterhaltung');
    }
  };

  // Delete a conversation
  const deleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;

    try {
      // Delete messages first (cascade should handle this, but just in case)
      await supabase
        .from('messages')
        .delete()
        .eq('conversation_id', conversationId);

      // Delete conversation
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);

      if (error) throw error;

      setOngoingConversations(prev => prev.filter(c => c.id !== conversationId));
      toast.success('Unterhaltung gelöscht');
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast.error('Fehler beim Löschen');
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
      navigate('/selfcare', { replace: true });
    }
  }, [searchParams, sessionStarted, navigate]);

  const getRandomStatement = (): StatementWithCategory => {
    const randomIndex = Math.floor(Math.random() * SELFCARE_STATEMENTS.length);
    return SELFCARE_STATEMENTS[randomIndex];
  };

  const startWithDisplayedImpulse = () => {
    setCurrentStatement(displayedImpulse);
    setSessionStarted(true);
    setHideStatementBanner(true);
    
    // Start with an opening question about the impulse
    const openingMessage: Message = {
      role: 'assistant',
      content: `„${displayedImpulse.text}"\n\nDieser Impuls begleitet dich heute. Was geht dir durch den Kopf, wenn du ihn liest? Gibt es etwas in deinem Leben gerade, das damit in Verbindung steht?`
    };
    setMessages([openingMessage]);
    setConversationHistory([openingMessage]);
  };

  const streamChat = async (userMessage: string, history: Message[], statement: string, mode: ReflectionMode = 'impulse') => {
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
          statement: statement,
          mode: mode
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

      const finalHistory = (() => {
        const last = [...history, { role: "user" as const, content: userMessage }];
        const lastMsg = last[last.length - 1];
        if (lastMsg?.role === "assistant") {
          return last.map((m, i) =>
            i === last.length - 1 ? { ...m, content: assistantMessage } : m
          );
        }
        return [...last, { role: "assistant" as const, content: assistantMessage }];
      })();
      
      setConversationHistory(finalHistory);
      
      // Auto-save conversation after each exchange
      if (user && finalHistory.length >= 2) {
        const savedId = await saveConversationToDb(finalHistory, statement, currentConversationId || undefined);
        if (savedId && !currentConversationId) {
          setCurrentConversationId(savedId);
        }
      }
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
    streamChat(userMessage, conversationHistory, currentStatement?.text || "", reflectionMode);
  };
  
  // Start situation reflection mode
  const startSituationReflection = () => {
    setReflectionMode('situation');
    setCurrentStatement({ text: 'Konkrete Situation reflektieren', category: 'selfcare' });
    setSessionStarted(true);
    setHideStatementBanner(true);
    
    // Initial message from Oria for situation mode
    const openingMessage: Message = {
      role: "assistant",
      content: "Hallo 💛 Schön, dass du da bist. Erzähl mir von der Situation, die dich gerade beschäftigt – was ist passiert?"
    };
    
    setMessages([openingMessage]);
    setConversationHistory([openingMessage]);
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

  const generateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const conversation = conversationHistory
        .map(m => `${m.role === 'user' ? 'Nutzer' : 'Oria'}: ${m.content}`)
        .join('\n\n');

      const response = await fetch(SUMMARY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          conversation,
          statement: currentStatement?.text || ''
        }),
      });

      if (!response.ok) {
        throw new Error('Zusammenfassung konnte nicht erstellt werden');
      }

      const summary = await response.json();
      setGeneratedSummary(summary);
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error('Fehler beim Erstellen der Zusammenfassung');
      setGeneratedSummary(null);
    } finally {
      setIsGeneratingSummary(false);
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
      // Always generate summary when saving
      setIsGeneratingSummary(true);
      let summaryData = null;
      
      try {
        const summaryResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-summary`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            conversation: content,
            statement: currentStatement?.text || ''
          }),
        });

        if (summaryResponse.ok) {
          summaryData = await summaryResponse.json();
        }
      } catch (summaryError) {
        console.error('Error generating summary:', summaryError);
        // Continue saving even if summary fails
      }
      
      setIsGeneratingSummary(false);

      const reflectionTypeLabel = reflectionMode === 'situation' ? 'Situations-Reflexion' : 'Impuls-Reflexion';
      const insertData: any = {
        user_id: user.id,
        title: title,
        content: content,
        memory_type: reflectionMode === 'situation' ? 'situation-reflection' : 'impulse-reflection',
        summary: reflectionMode === 'situation' 
          ? `${reflectionTypeLabel}` 
          : `${reflectionTypeLabel}: "${currentStatement?.text}"`,
        created_at: new Date().toISOString(),
        summary_requested: true,
        location: saveLocation.trim() || null,
      };

      if (summaryData) {
        insertData.structured_summary = summaryData;
      }

      const { error } = await supabase.from('memories').insert(insertData);

      if (error) throw error;

      // Delete the ongoing conversation since it's now saved to vault
      if (currentConversationId) {
        await supabase.from('messages').delete().eq('conversation_id', currentConversationId);
        await supabase.from('conversations').delete().eq('id', currentConversationId);
      }

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
      setSaveLocation("");
      setWantsSummary(false);
      setGeneratedSummary(null);
      setSessionStarted(false);
      setMessages([]);
      setConversationHistory([]);
      setCurrentStatement(null);
      setCurrentConversationId(null);
      loadPastReflections(); // Reload to update stats
      loadOngoingConversations(); // Reload ongoing conversations
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Fehler beim Speichern');
      setIsGeneratingSummary(false);
    }
  };

  const skipSave = async () => {
    // Delete the ongoing conversation when skipping
    if (currentConversationId) {
      await supabase.from('messages').delete().eq('conversation_id', currentConversationId);
      await supabase.from('conversations').delete().eq('id', currentConversationId);
      loadOngoingConversations();
    }
    
    setShowSaveDialog(false);
    setSaveTitle("");
    setSaveLocation("");
    setWantsSummary(false);
    setGeneratedSummary(null);
    setSessionStarted(false);
    setMessages([]);
    setConversationHistory([]);
    setCurrentStatement(null);
    setCurrentConversationId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // deepenInOria removed - coach page no longer exists

  // Get user display name
  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'du';

  return (
    <div className="min-h-[100dvh] flex flex-col ios-font relative overflow-hidden">
      
      {/* Warm Gradient Background - Like the reference */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(180deg, hsl(150 30% 85%) 0%, hsl(35 60% 75%) 50%, hsl(25 50% 80%) 100%)'
        }}
      />
      
      {/* Top Navigation Icons */}
      <div className="relative z-10 flex justify-between items-center px-6 pt-[max(env(safe-area-inset-top,20px),20px)]">
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/summaries')}
            className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center"
            aria-label="Tresor öffnen"
          >
            <Lock className="w-5 h-5 text-foreground/70" />
          </motion.button>
          
          {user && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowGamification(true)}
              className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center"
              aria-label="Fortschritt"
            >
              <Gamepad2 className="w-5 h-5 text-foreground/70" />
            </motion.button>
          )}
        </div>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/auth')}
          className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center"
        >
          <Heart className="w-5 h-5 text-foreground/70" />
        </motion.button>
      </div>

      {!sessionStarted ? (
        /* Welcome Screen - Like Reference Image */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex-1 flex flex-col"
        >
          {/* Centered Greeting */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 -mt-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-8"
            >
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground leading-tight">
                Hallo, du,
              </h1>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground leading-tight mt-2">
                hier ist dein Impuls
              </h2>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground leading-tight">
                des Tages.
              </h2>
            </motion.div>
            
            {/* Current Impulse - directly below greeting with spacing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="w-full max-w-md"
            >
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/30">
                <p className="text-center text-lg text-foreground/80 font-serif italic">
                  „{displayedImpulse.text}"
                </p>
              </div>
            </motion.div>

            {/* Stats - Small and subtle */}
            {user && pastReflections.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-4 mt-8"
              >
                <div className="flex items-center gap-1.5 text-foreground/60">
                  <Flame className={`w-4 h-4 ${streak > 0 ? 'text-orange-600' : ''}`} />
                  <span className="text-sm font-medium">{streak} Tage</span>
                </div>
                <div className="w-px h-4 bg-foreground/20" />
                <div className="flex items-center gap-1.5 text-foreground/60">
                  <Star className="w-4 h-4" />
                  <span className="text-sm font-medium">{pastReflections.length} Reflexionen</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Mode Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center mb-6"
          >
            <div className="bg-white/50 backdrop-blur-sm rounded-full p-1 flex gap-1 border border-white/30">
              <button
                onClick={() => setReflectionMode('impulse')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  reflectionMode === 'impulse'
                    ? 'bg-white shadow-sm text-foreground'
                    : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Impuls
                </span>
              </button>
              <button
                onClick={() => setReflectionMode('situation')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  reflectionMode === 'situation'
                    ? 'bg-white shadow-sm text-foreground'
                    : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" />
                  Situation
                </span>
              </button>
            </div>
          </motion.div>

          {/* Action Cards - Horizontal scroll layout at bottom */}
          <div className="px-4 pb-[max(env(safe-area-inset-bottom,24px),24px)]">
            <div className="flex gap-3 justify-center flex-wrap">
              {/* Card - Tresor */}
              <motion.button
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/summaries')}
              >
                <div className="w-24 h-28 sm:w-28 sm:h-32 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg flex flex-col items-center justify-center gap-2 border border-white/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-foreground/80 text-center px-2">Mein Tresor</span>
                </div>
              </motion.button>

              {/* Main Action Card - changes based on mode */}
              <motion.button
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                whileTap={{ scale: 0.95 }}
                onClick={reflectionMode === 'impulse' ? startWithDisplayedImpulse : startSituationReflection}
              >
                <div className="w-28 h-32 sm:w-32 sm:h-36 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl flex flex-col items-center justify-center gap-2 border border-white/50">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    {reflectionMode === 'impulse' ? (
                      <Sparkles className="w-6 h-6 text-accent" />
                    ) : (
                      <MessageSquare className="w-6 h-6 text-accent" />
                    )}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-foreground text-center px-2">
                    {reflectionMode === 'impulse' ? 'Impuls reflektieren' : 'Situation reflektieren'}
                  </span>
                </div>
              </motion.button>

              {/* Card - Neuer Impuls (only in impulse mode) */}
              {reflectionMode === 'impulse' && (
                <motion.button
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startSession}
                >
                  <div className="w-24 h-28 sm:w-28 sm:h-32 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg flex flex-col items-center justify-center gap-2 border border-white/50">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <RotateCcw className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <span className="text-xs font-medium text-foreground/80 text-center px-2">Neuer Impuls</span>
                  </div>
                </motion.button>
              )}

              {/* Card - Laufende Unterhaltungen */}
              {ongoingConversations.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowOngoingConversations(true)}
                >
                  <div className="w-24 h-28 sm:w-28 sm:h-32 bg-white/60 backdrop-blur-md rounded-2xl shadow-lg flex flex-col items-center justify-center gap-2 border border-white/50 relative">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Play className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-xs font-medium text-foreground/80 text-center px-2">Fortsetzen</span>
                    {/* Badge */}
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{ongoingConversations.length}</span>
                    </div>
                  </div>
                </motion.button>
              )}
            </div>

            {/* Owl mascot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="flex justify-center mt-4"
            >
              <div className="w-14 h-14 rounded-full bg-foreground shadow-lg flex items-center justify-center">
                <img src={bbOwlLogo} alt="Oria" className="w-10 h-10 object-contain" />
              </div>
            </motion.div>
          </div>

        </motion.div>
      ) : (
        /* Chat Session */
        <div className="relative z-10 flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 pt-4">
          {/* Current Statement Banner */}
          {!hideStatementBanner && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 shrink-0"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <Flower2 className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-foreground/60 mb-1">Dein Impuls</p>
                  <p className="font-serif text-foreground leading-relaxed">
                    {currentStatement?.text}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto pb-72 md:pb-4 space-y-3 px-1">
            {messages.map((message, index) => (
              <ChatMessage key={index} content={message.content} role={message.role} />
            ))}
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center flex-shrink-0">
                  <Flower2 className="w-4 h-4 text-accent" />
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl rounded-tl-md px-4 py-3">
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

          {/* Input Area */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-white/30 px-4 py-3 pb-[calc(env(safe-area-inset-bottom,12px)+8px)] md:relative md:border-t-0 md:bg-transparent md:backdrop-blur-none md:px-0 md:py-0 md:mt-4 md:pb-4">
            <div className="max-w-3xl mx-auto flex flex-col gap-3">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Teile deine Gedanken..."
                className="h-[100px] min-h-[100px] max-h-[100px] resize-none w-full rounded-2xl border-white/50 bg-white/60 backdrop-blur-sm overflow-y-auto text-base"
                disabled={isLoading}
                rows={3}
                style={{ fontSize: '16px' }}
              />
              
              <motion.button 
                onClick={sendMessage} 
                disabled={!input.trim() || isLoading}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 bg-foreground text-white font-semibold rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                <span className="text-base">Nachricht senden</span>
              </motion.button>
              
              <div className="flex flex-wrap gap-3 justify-center">
                <button 
                  onClick={() => setShowSaveDialog(true)}
                  className="text-foreground/70 text-sm flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/40 hover:bg-white/60 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  Im Tresor speichern
                </button>
                <button 
                  onClick={async () => {
                    await saveConversationToDb(messages, currentStatement?.text || '', currentConversationId || undefined);
                    toast.success('Unterhaltung gespeichert');
                    navigate('/');
                  }}
                  className="text-foreground/70 text-sm flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/40 hover:bg-white/60 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Später fortsetzen
                </button>
                <button 
                  onClick={() => navigate('/')}
                  className="text-foreground/70 text-sm flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/40 hover:bg-white/60 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Zurück
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reflexion speichern?</DialogTitle>
            <DialogDescription>
              Möchtest du diese Selfcare-Reflexion in deinem Tresor speichern?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Input
              placeholder="Titel (optional)"
              value={saveTitle}
              onChange={(e) => setSaveTitle(e.target.value)}
            />
            
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Ort (optional)"
                value={saveLocation}
                onChange={(e) => setSaveLocation(e.target.value)}
                className="flex-1"
              />
            </div>

            {/* Summary Option */}
            <div className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => {
                    const newValue = !wantsSummary;
                    setWantsSummary(newValue);
                    if (newValue && !generatedSummary && !isGeneratingSummary) {
                      generateSummary();
                    }
                  }}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    wantsSummary 
                      ? 'bg-accent border-accent text-accent-foreground' 
                      : 'border-muted-foreground/50 hover:border-accent'
                  }`}
                >
                  {wantsSummary && <span className="text-xs">✓</span>}
                </button>
                <div className="flex-1">
                  <p className="font-medium text-sm text-foreground">Zusammenfassung erstellen</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Oria analysiert dein Gespräch nach dem Oria-Modell: Muster, Bedürfnisse, innere Teile und Körperbereiche.
                  </p>
                </div>
              </div>

              {wantsSummary && isGeneratingSummary && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded p-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent"></div>
                  <span>Zusammenfassung wird erstellt...</span>
                </div>
              )}

              {wantsSummary && generatedSummary && !isGeneratingSummary && (
                <div className="bg-muted/30 rounded p-3 text-sm">
                  <p className="text-foreground leading-relaxed">{generatedSummary.summary_text}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {generatedSummary.needs?.slice(0, 3).map((need: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-pink-500/10 text-pink-700 text-xs rounded-full">
                        {need}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Link to Summaries Page */}
            {user && (
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  navigate('/summaries');
                }}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Lock className="w-4 h-4" />
                <span>Zum Tresor</span>
              </button>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={skipSave}>
              Verwerfen
            </Button>
            <Button 
              onClick={saveToVault} 
              disabled={wantsSummary && isGeneratingSummary}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Save className="w-4 h-4 mr-1" />
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ongoing Conversations Modal */}
      <Dialog open={showOngoingConversations} onOpenChange={setShowOngoingConversations}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              Laufende Unterhaltungen
            </DialogTitle>
            <DialogDescription>
              Setze eine frühere Unterhaltung fort
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto -mx-6 px-6">
            {loadingConversations ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : ongoingConversations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p>Keine laufenden Unterhaltungen</p>
              </div>
            ) : (
              <div className="space-y-2 py-2">
                {ongoingConversations.map((conv) => (
                  <motion.div
                    key={conv.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group relative"
                  >
                    <button
                      onClick={() => resumeConversation(conv.id)}
                      className="w-full text-left p-3 bg-muted/30 hover:bg-muted/50 rounded-xl transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                          <Play className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground truncate pr-8">
                            {conv.title || 'Selfcare-Reflexion'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {conv.lastMessage}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                            <span>{format(new Date(conv.updated_at), 'dd.MM.yyyy', { locale: de })}</span>
                            <span>·</span>
                            <span>{conv.messageCount} Nachrichten</span>
                          </div>
                        </div>
                      </div>
                    </button>
                    
                    {/* Delete button */}
                    <button
                      onClick={(e) => deleteConversation(conv.id, e)}
                      className="absolute top-3 right-3 w-7 h-7 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-600" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowOngoingConversations(false)}>
              Schließen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Gamification Dashboard */}
      <GamificationDashboard 
        isOpen={showGamification} 
        onClose={() => setShowGamification(false)} 
      />

      {/* Footer - Hidden on mobile when session started to not interfere with fixed input */}
      <footer className={`py-4 pb-[max(env(safe-area-inset-bottom,16px),16px)] px-4 border-t border-border/30 text-center shrink-0 ${sessionStarted ? 'hidden md:block' : ''}`}>
        <p className="text-xs text-muted-foreground">
          © 2025 Oria · Selfcare Impulse
        </p>
      </footer>
    </div>
  );
};

export default SelfcareReflection;

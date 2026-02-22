import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Send, RotateCcw, Save, Sparkles, Heart, Flower2, Calendar, ChevronDown, ChevronUp, Flame, Star, MapPin, Lock, MessageSquare, Play, Trash2, X, Gamepad2, Lightbulb, MessageCircleQuestion, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
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
import { useImpulseManager, TIER_LIMITS } from '@/hooks/useImpulseManager';
import { updateGamificationOnReflection } from '@/hooks/useGamification';
import { BASE_IMPULSES_BILINGUAL, PACK_IMPULSES_BILINGUAL, type BilingualImpulse } from '@/data/impulses';

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/selfcare-chat`;
const SUMMARY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-summary`;

type StatementCategory = 'selfcare' | 'gfk';

interface StatementWithCategory {
  text: string;
  textEn?: string;
  category: StatementCategory;
}

// Build bilingual statements from the impulses data
const SELFCARE_STATEMENTS: StatementWithCategory[] = BASE_IMPULSES_BILINGUAL.map((imp, i) => ({
  text: imp.de,
  textEn: imp.en,
  category: i < 67 ? 'selfcare' as StatementCategory : 'gfk' as StatementCategory,
}));

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
  const { t, language } = useLanguage();
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
  const [isSaving, setIsSaving] = useState(false);
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  
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
  
  // Helper to get impulse text in current language
  const getImpulseDisplayText = (stmt: StatementWithCategory) => {
    return language === 'en' && stmt.textEn ? stmt.textEn : stmt.text;
  };
  
  // Ongoing conversations state
  const [ongoingConversations, setOngoingConversations] = useState<OngoingConversation[]>([]);
  const [showOngoingConversations, setShowOngoingConversations] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  
  // Gamification state
  const [showGamification, setShowGamification] = useState(false);
  
  // Reflection mode state
  type ReflectionMode = 'impulse' | 'situation' | 'ask';
  const [reflectionMode, setReflectionMode] = useState<ReflectionMode>('impulse');

  // Impulse Manager for tracking impulse usage
  const { subscription, impulsesRemaining, useImpulse, loading: impulseLoading } = useImpulseManager();

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
        .in('memory_type', ['selfcare-reflection', 'impulse-reflection', 'situation-reflection'])
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
    const startFromUrlImpulse = async () => {
      const impulse = searchParams.get('impulse');
      const autostart = searchParams.get('autostart');
      const triggerCardParam = searchParams.get('triggerCard');
      
      // Handle trigger card context
      if (triggerCardParam && autostart === 'true' && !sessionStarted) {
        try {
          const cardData = JSON.parse(decodeURIComponent(triggerCardParam));
          const statement: StatementWithCategory = { text: cardData.title, category: 'selfcare' };
          
          setCurrentStatement(statement);
          setSessionStarted(true);
          setHideStatementBanner(true);
          setReflectionMode('ask');
          
          const openingMessage: Message = {
            role: 'assistant',
            content: `🃏 **Trigger-Karte: ${cardData.title}**\n\n*„${cardData.innereTriggerGeschichte}"*\n\n${cardData.wasPassiert}\n\nIch möchte mit dir über diesen Trigger reflektieren. Hier sind einige Fragen, die dir helfen können:\n\n${cardData.selfCheck.map((q: string) => `• ${q}`).join('\n')}\n\nWelche dieser Fragen spricht dich gerade am meisten an? Oder möchtest du einfach erzählen, wie sich dieser Trigger in deinem Leben zeigt?`
          };
          setMessages([openingMessage]);
          setConversationHistory([openingMessage]);
          
          navigate('/selfcare', { replace: true });
          return;
        } catch (e) {
          console.error('Error parsing trigger card data:', e);
        }
      }
      
      if (impulse && autostart === 'true' && !sessionStarted && !impulseLoading) {
        // Mark impulse as used
        const success = await useImpulse(impulse);
        
        if (!success) {
          toast.error('Keine Impulse mehr verfügbar. Upgrade dein Paket für mehr Impulse.');
          navigate('/pricing', { replace: true });
          return;
        }
        
        // Find the statement that matches the impulse or create a custom one
        const matchingStatement = SELFCARE_STATEMENTS.find(s => s.text === impulse);
        const statement = matchingStatement || { text: impulse, category: 'selfcare' as StatementCategory };
        
        setCurrentStatement(statement);
        setSessionStarted(true);
        setHideStatementBanner(true);
        
        // Start with an opening question about the impulse
        const openingMessage: Message = {
          role: 'assistant',
          content: language === 'en' ? `"${impulse}"\n\nThis impulse accompanies you today. What comes to mind when you read it? Is there something in your life right now that connects with it?` : `„${impulse}"\n\nDieser Impuls begleitet dich heute. Was geht dir durch den Kopf, wenn du ihn liest? Gibt es etwas in deinem Leben gerade, das damit in Verbindung steht?`
        };
        setMessages([openingMessage]);
        setConversationHistory([openingMessage]);
        
        // Clear the URL params to prevent re-triggering
        navigate('/selfcare', { replace: true });
      }
    };
    
    startFromUrlImpulse();
  }, [searchParams, sessionStarted, navigate, impulseLoading, useImpulse]);

  const getRandomStatement = (): StatementWithCategory => {
    const randomIndex = Math.floor(Math.random() * SELFCARE_STATEMENTS.length);
    return SELFCARE_STATEMENTS[randomIndex];
  };


  const startWithDisplayedImpulse = async () => {
    // Mark the impulse as used
    const success = await useImpulse(displayedImpulse.text);
    
    if (!success) {
      toast.error('Keine Impulse mehr verfügbar. Upgrade dein Paket für mehr Impulse.');
      navigate('/pricing');
      return;
    }

    setCurrentStatement(displayedImpulse);
    setSessionStarted(true);
    setHideStatementBanner(true);
    
    const impulseText = getImpulseDisplayText(displayedImpulse);
    const openingMessage: Message = {
      role: 'assistant',
      content: language === 'en' ? `"${impulseText}"\n\nThis impulse accompanies you today. What comes to mind when you read it? Is there something in your life right now that connects with it?` : `„${impulseText}"\n\nDieser Impuls begleitet dich heute. Was geht dir durch den Kopf, wenn du ihn liest? Gibt es etwas in deinem Leben gerade, das damit in Verbindung steht?`
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
          mode: mode,
          language: language
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
      
      // Check if user wants to save - detect save intent in user message
      const saveKeywords = ['speichern', 'tresor', 'aufbewahren', 'sichern', 'abspeichern', 'save', 'vault', 'store'];
      const userWantsToSave = saveKeywords.some(keyword => 
        userMessage.toLowerCase().includes(keyword)
      );
      
      if (userWantsToSave) {
        // Open save dialog when user mentions saving
        setTimeout(() => {
          setShowSaveDialog(true);
        }, 1500); // Small delay to let the assistant's response appear first
      }
      
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
      content: language === 'en' ? "Hello 💛 Glad you're here. Tell me about the situation that's on your mind – what happened?" : "Hallo 💛 Schön, dass du da bist. Erzähl mir von der Situation, die dich gerade beschäftigt – was ist passiert?"
    };
    
    setMessages([openingMessage]);
    setConversationHistory([openingMessage]);
  };

  // Start ask Oria mode - free questions without structured reflection
  const startAskOria = () => {
    setReflectionMode('ask');
    setCurrentStatement({ text: 'Frag Oria', category: 'selfcare' });
    setSessionStarted(true);
    setHideStatementBanner(true);
    
    // Initial message from Oria for ask mode
    const openingMessage: Message = {
      role: "assistant",
      content: language === 'en' ? "Hello 💛 What's on your mind? You can ask me anything – about feelings, needs, inner parts, body sensations, or whatever is on your heart." : "Hallo 💛 Was beschäftigt dich gerade? Du kannst mir alles fragen – zu Gefühlen, Bedürfnissen, inneren Teilen, Körperwahrnehmungen oder was dir sonst auf dem Herzen liegt."
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
          statement: currentStatement?.text || '',
          language: language
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

    setIsSaving(true);

    const content = conversationHistory
      .map(m => `${m.role === 'user' ? 'Du' : 'Oria'}: ${m.content}`)
      .join('\n\n');

    const title = saveTitle.trim() || `Selfcare: ${currentStatement?.text.substring(0, 40)}...`;

    try {
      // Always generate summary when saving
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
            statement: currentStatement?.text || '',
            language: language
          }),
        });

        if (summaryResponse.ok) {
          summaryData = await summaryResponse.json();
        }
      } catch (summaryError) {
        console.error('Error generating summary:', summaryError);
        // Continue saving even if summary fails
      }

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

      // Update gamification data (add plant to garden, update streak, etc.)
      const reflectionTopic = currentStatement?.text || title || 'Reflexion';
      await updateGamificationOnReflection(user.id, reflectionTopic);

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
    } finally {
      setIsSaving(false);
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
      
      {/* Top Navigation Icons - Sticky Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-white/30 pt-[max(env(safe-area-inset-top),20px)]">
        <div className="flex justify-between items-center px-6 py-3">
        <div className="flex gap-2">
          {/* Owl as Home Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (sessionStarted) {
                setSessionStarted(false);
                setMessages([]);
                setConversationHistory([]);
                setCurrentStatement(null);
                setHideStatementBanner(false);
              } else {
                navigate('/pricing');
              }
            }}
            className="w-11 h-11 rounded-full bg-foreground shadow-lg flex items-center justify-center"
            aria-label="Oria Pakete"
          >
            <img src={bbOwlLogo} alt="Oria" className="w-8 h-8 object-contain" />
          </motion.button>
          
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
        
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/help')}
            className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center"
            aria-label="Hilfe"
          >
            <Lightbulb className="w-5 h-5 text-foreground/70" />
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/modell')}
            className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center"
            aria-label="Über das Modell"
          >
            <Heart className="w-5 h-5 text-foreground/70" />
          </motion.button>
          
          <LanguageToggle />
        </div>
        </div>
      </header>

      {!sessionStarted ? (
        /* Welcome Screen - Like Reference Image */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex-1 flex flex-col"
        >
          {/* Centered Greeting */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 min-h-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-8"
            >
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground leading-tight">
                {t('selfcare.greeting')}
              </h1>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground leading-tight mt-2">
                {t('selfcare.impulseIntro')}
              </h2>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground leading-tight">
                {t('selfcare.ofTheDay')}
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
                  „{getImpulseDisplayText(displayedImpulse)}"
                </p>
              </div>
            </motion.div>

            {/* Stats - Small and subtle */}
            {user && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center gap-3 mt-8"
              >
                {/* Trial Banner */}
                {subscription?.isTrialActive && subscription?.trialEndsAt && (
                  <div className="px-4 py-2 rounded-full bg-purple-100/80 backdrop-blur-sm border border-purple-200/50">
                    <span className="text-sm font-medium text-purple-700">
                      ✨ Premium-Test: noch {Math.max(0, Math.ceil((new Date(subscription.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} Tage
                    </span>
                  </div>
                )}
                
                {pastReflections.length > 0 && (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-foreground/60">
                      <Flame className={`w-4 h-4 ${streak > 0 ? 'text-orange-600' : ''}`} />
                      <span className="text-sm font-medium">{streak} {t('selfcare.days')}</span>
                    </div>
                    <div className="w-px h-4 bg-foreground/20" />
                    <button onClick={() => navigate('/summaries')} className="flex items-center gap-1.5 text-foreground/60 hover:text-foreground/90 transition-colors">
                      <Star className="w-4 h-4" />
                      <span className="text-sm font-medium underline underline-offset-2">{pastReflections.length} {t('selfcare.reflections')}</span>
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </div>


          {/* Action Cards - Horizontal scroll layout at bottom */}
          <div className="px-4 pb-[max(env(safe-area-inset-bottom,24px),24px)] mt-auto">
            <div className="flex gap-3 justify-center overflow-x-auto scrollbar-hide pb-2">
              {/* Card - Trigger verstehen */}
              <motion.button
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/trigger-cards')}
              >
                <div className="w-24 h-28 sm:w-28 sm:h-32 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg flex flex-col items-center justify-center gap-2 border border-white/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-primary"><rect x="3" y="2" width="14" height="20" rx="2" /><path d="M7 7h6" /><path d="M7 11h4" /><circle cx="19" cy="5" r="2.5" fill="currentColor" strokeWidth="0" /></svg>
                  </div>
                  <span className="text-xs font-medium text-foreground/80 text-center px-2">{t('selfcare.triggerUnderstand')}</span>
                </div>
              </motion.button>

              {/* Main Action Card - Impuls reflektieren */}
              <motion.button
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                whileTap={{ scale: 0.95 }}
                onClick={startWithDisplayedImpulse}
              >
                <div className="w-28 h-32 sm:w-32 sm:h-36 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl flex flex-col items-center justify-center gap-2 border border-white/50">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-accent" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-foreground text-center px-2">
                    {t('selfcare.reflectImpulse')}
                  </span>
                </div>
              </motion.button>

              {/* Card - Mit Anteilen arbeiten */}
              <motion.button
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/summaries?tab=parts')}
              >
                <div className="w-24 h-28 sm:w-28 sm:h-32 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg flex flex-col items-center justify-center gap-2 border border-white/50">
                  <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-violet-600" />
                  </div>
                  <span className="text-xs font-medium text-foreground/80 text-center px-2">Mit Anteilen arbeiten</span>
                </div>
              </motion.button>

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
                    <span className="text-xs font-medium text-foreground/80 text-center px-2">{t('selfcare.continueConversation')}</span>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{ongoingConversations.length}</span>
                    </div>
                  </div>
                </motion.button>
              )}
            </div>

            {/* Visual Links - Mein Tresor, Anleitung, Impulspakete */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="flex justify-center gap-6 mt-4"
            >
              
              <button
                onClick={() => navigate('/impulse-packs')}
                className="w-10 h-10 rounded-full bg-foreground/10 hover:bg-foreground/20 flex items-center justify-center text-foreground/60 hover:text-foreground/90 transition-colors"
                aria-label="Impulspakete"
              >
                <Flower2 className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={startAskOria}
                className="w-10 h-10 rounded-full bg-foreground/10 hover:bg-foreground/20 flex items-center justify-center text-foreground/60 hover:text-foreground/90 transition-colors"
                aria-label="Frag Oria"
              >
                <MessageCircleQuestion className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={startSituationReflection}
                className="w-10 h-10 rounded-full bg-foreground/10 hover:bg-foreground/20 flex items-center justify-center text-foreground/60 hover:text-foreground/90 transition-colors"
                aria-label="Situation reflektieren"
              >
                <MessageSquare className="w-4.5 h-4.5" />
              </button>
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
                  <p className="text-xs text-foreground/60 mb-1">{t('selfcare.yourImpulse')}</p>
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
                placeholder={t('selfcare.shareThoughts')}
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
                <span className="text-base">{t('selfcare.sendMessage')}</span>
              </motion.button>
              
              <div className="flex flex-wrap gap-3 justify-center">
                <button 
                  onClick={() => setShowSaveDialog(true)}
                  className="text-foreground/70 text-sm flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/40 hover:bg-white/60 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  {t('selfcare.saveToVault')}
                </button>
                <button 
                  onClick={async () => {
                    await saveConversationToDb(messages, currentStatement?.text || '', currentConversationId || undefined);
                    toast.success(t('selfcare.conversationSaved'));
                    navigate('/');
                  }}
                  className="text-foreground/70 text-sm flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/40 hover:bg-white/60 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  {t('selfcare.continueLater')}
                </button>
                <button 
                  onClick={() => navigate('/')}
                  className="text-foreground/70 text-sm flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/40 hover:bg-white/60 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  {t('selfcare.back')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-md max-h-[85vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>{t('selfcare.saveReflection')}</DialogTitle>
            <DialogDescription>
              {t('selfcare.saveReflectionDesc')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 overflow-y-auto flex-1 pr-2">
            <Input
              placeholder={t('selfcare.titleOptional')}
              value={saveTitle}
              onChange={(e) => setSaveTitle(e.target.value)}
            />
            
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t('selfcare.locationOptional')}
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
                  <p className="font-medium text-sm text-foreground">{t('selfcare.createSummary')}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('selfcare.summaryDesc')}
                  </p>
                </div>
              </div>

              {wantsSummary && isGeneratingSummary && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded p-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent"></div>
                  <span>{t('selfcare.generatingSummary')}</span>
                </div>
              )}

              {wantsSummary && generatedSummary && !isGeneratingSummary && (
                <div className="bg-muted/30 rounded p-3 text-sm">
                  <div className="text-foreground leading-relaxed">
                    {summaryExpanded ? (
                      <p>{generatedSummary.summary_text}</p>
                    ) : (
                      <p>{generatedSummary.summary_text?.split(' ').slice(0, 10).join(' ')}...</p>
                    )}
                  </div>
                  <button
                    onClick={() => setSummaryExpanded(!summaryExpanded)}
                    className="text-xs text-accent hover:text-accent/80 mt-1 flex items-center gap-1"
                  >
                    {summaryExpanded ? t('selfcare.showLess') : t('selfcare.showMore')}
                  </button>
                  {summaryExpanded && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {generatedSummary.needs?.slice(0, 3).map((need: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-pink-500/10 text-pink-700 text-xs rounded-full">
                          {need}
                        </span>
                      ))}
                    </div>
                  )}
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
                <span>{t('selfcare.goToVault')}</span>
              </button>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 flex-shrink-0 pt-4 border-t">
            <Button variant="outline" onClick={skipSave}>
              {t('selfcare.discard')}
            </Button>
            <Button 
              onClick={saveToVault} 
              disabled={isSaving || (wantsSummary && isGeneratingSummary)}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-1"></div>
                  {t('selfcare.saving')}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-1" />
                  {t('selfcare.save')}
                </>
              )}
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
              {t('selfcare.ongoingConversations')}
            </DialogTitle>
            <DialogDescription>
              {t('selfcare.continueConversationDesc')}
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
                <p>{t('selfcare.noConversations')}</p>
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
                            <span>{conv.messageCount} {t('selfcare.messages')}</span>
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
              {t('selfcare.close')}
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

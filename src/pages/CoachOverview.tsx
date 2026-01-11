import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MessageSquare, 
  Plus, 
  ArrowRight, 
  Archive, 
  User,
  Brain,
  Loader2,
  Clock,
  ChevronLeft,
} from 'lucide-react';
import bbOwlLogo from '@/assets/bb-owl-new.png';
import { format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import { OriaProcessFlow } from '@/components/OriaProcessFlow';

interface LastConversation {
  id: string;
  title: string;
  updated_at: string;
  messageCount: number;
  lastMessage?: string;
}

const CoachOverview = () => {
  const { user, loading: authLoading } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const [lastConversation, setLastConversation] = useState<LastConversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Check if user has a profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      setHasProfile(!!profile);

      // Load the most recent conversation with message count
      const { data: conversations } = await supabase
        .from('conversations')
        .select('id, title, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (conversations && conversations.length > 0) {
        const conv = conversations[0];
        
        // Get message count and last message
        const { data: messages, count } = await supabase
          .from('messages')
          .select('content, role', { count: 'exact' })
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: false })
          .limit(1);

        const lastAssistantMessage = messages?.find(m => m.role === 'assistant');

        setLastConversation({
          id: conv.id,
          title: conv.title,
          updated_at: conv.updated_at,
          messageCount: count || 0,
          lastMessage: lastAssistantMessage?.content?.slice(0, 150) + (lastAssistantMessage?.content && lastAssistantMessage.content.length > 150 ? '...' : ''),
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, 'dd. MMM yyyy, HH:mm', { 
      locale: language === 'de' ? de : enUS 
    });
  };

  const handleContinueConversation = () => {
    if (lastConversation) {
      navigate(`/coach?conversation=${lastConversation.id}`);
    }
  };

  const handleNewConversation = () => {
    navigate('/coach?new=true');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">{language === 'de' ? 'Zurück' : 'Back'}</span>
          </Link>
          <div className="flex items-center gap-3">
            <img src={bbOwlLogo} alt="Oria" className="h-10 w-auto object-contain" />
            <h1 className="font-serif text-xl font-medium text-foreground">
              {language === 'de' ? 'Frag Oria' : 'Ask Oria'}
            </h1>
          </div>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-foreground mb-3">
            {language === 'de' ? 'Willkommen bei Oria' : 'Welcome to Oria'}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {language === 'de' 
              ? 'Oria begleitet dich Schritt für Schritt – vom ersten Impuls bis zur nachhaltigen Selbsterkenntnis. Du bestimmst Tempo und Tiefe.' 
              : 'Oria guides you step by step – from the first impulse to lasting self-insight. You determine the pace and depth.'}
          </p>
        </div>

        {/* Oria Process Flow */}
        <OriaProcessFlow />

        <div className="mt-8 pt-8 border-t border-border">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4 text-center">
            {language === 'de' ? 'Deine Gespräche' : 'Your Conversations'}
          </h3>
          {/* Continue Last Conversation */}
          {lastConversation && lastConversation.messageCount > 0 && (
            <Card 
              className="group cursor-pointer hover:border-accent/50 transition-all duration-300 hover:shadow-lg"
              onClick={handleContinueConversation}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-medium">
                        {language === 'de' ? 'Letzte Unterhaltung fortsetzen' : 'Continue last conversation'}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(lastConversation.updated_at)}
                      </CardDescription>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-sm font-medium text-foreground mb-1">
                    „{lastConversation.title}"
                  </p>
                  {lastConversation.lastMessage && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {lastConversation.lastMessage}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Start New Conversation */}
          <Card 
            className="group cursor-pointer hover:border-accent/50 transition-all duration-300 hover:shadow-lg"
            onClick={handleNewConversation}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Plus className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-medium">
                      {language === 'de' ? 'Neue Unterhaltung starten' : 'Start new conversation'}
                    </CardTitle>
                    <CardDescription>
                      {language === 'de' 
                        ? 'Beginne ein neues Gespräch mit Oria' 
                        : 'Begin a new conversation with Oria'}
                    </CardDescription>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </CardHeader>
          </Card>

          {/* Other Functions Section */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4 text-center">
              {language === 'de' ? 'Weitere Funktionen' : 'Other Features'}
            </h3>
            
            <div className="grid gap-3 sm:grid-cols-2">
              {/* Memory Vault */}
              <Card 
                className="group cursor-pointer hover:border-border transition-all"
                onClick={() => navigate('/vault')}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <Archive className="w-4 h-4 text-secondary-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm">
                      {language === 'de' ? 'Erinnerungstresor' : 'Memory Vault'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {language === 'de' ? 'Deine gespeicherten Erinnerungen' : 'Your saved memories'}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto shrink-0 group-hover:translate-x-1 transition-transform" />
                </CardContent>
              </Card>

              {/* Profile */}
              <Card 
                className="group cursor-pointer hover:border-border transition-all"
                onClick={() => navigate('/profile')}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-secondary-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm">
                      {language === 'de' ? 'Mein Profil' : 'My Profile'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {hasProfile 
                        ? (language === 'de' ? 'Profil anzeigen & bearbeiten' : 'View & edit profile')
                        : (language === 'de' ? 'Profil erstellen' : 'Create profile')}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto shrink-0 group-hover:translate-x-1 transition-transform" />
                </CardContent>
              </Card>

              {/* Profile Assistant */}
              <Card 
                className="group cursor-pointer hover:border-border transition-all"
                onClick={() => navigate('/profile-assistant')}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <Brain className="w-4 h-4 text-secondary-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm">
                      {language === 'de' ? 'Profil-Assistent' : 'Profile Assistant'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {language === 'de' ? 'Lerne dich selbst besser kennen' : 'Get to know yourself better'}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto shrink-0 group-hover:translate-x-1 transition-transform" />
                </CardContent>
              </Card>

              {/* All Conversations */}
              <Card 
                className="group cursor-pointer hover:border-border transition-all"
                onClick={() => navigate('/coach?showHistory=true')}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4 text-secondary-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm">
                      {language === 'de' ? 'Alle Unterhaltungen' : 'All Conversations'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {language === 'de' ? 'Verlauf durchsuchen' : 'Browse history'}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto shrink-0 group-hover:translate-x-1 transition-transform" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoachOverview;


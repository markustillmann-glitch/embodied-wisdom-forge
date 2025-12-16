import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Loader2, 
  Archive,
  Calendar,
  Music,
  Heart,
  Briefcase,
  Users,
  Plane,
  Trophy,
  UserCheck,
  Trash2,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';

interface Memory {
  id: string;
  title: string;
  summary: string | null;
  content: string;
  memory_type: string;
  emotion: string | null;
  created_at: string;
  memory_date: string | null;
}

const memoryTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  concert: Music,
  relationship: Heart,
  work: Briefcase,
  childhood: Users,
  travel: Plane,
  friendship: UserCheck,
  success: Trophy,
  general: BookOpen,
};

const MemoryVault = () => {
  const { user, loading: authLoading } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadMemories();
    }
  }, [user]);

  const loadMemories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .order('memory_date', { ascending: false });

    if (error) {
      console.error('Error loading memories:', error);
      toast({
        title: t('vault.error'),
        description: t('vault.loadError'),
        variant: 'destructive',
      });
    } else {
      setMemories(data || []);
    }
    setLoading(false);
  };

  const deleteMemory = async (id: string) => {
    const { error } = await supabase
      .from('memories')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: t('vault.error'),
        description: t('vault.deleteError'),
        variant: 'destructive',
      });
    } else {
      setMemories(prev => prev.filter(m => m.id !== id));
      if (selectedMemory?.id === id) {
        setSelectedMemory(null);
      }
      toast({
        title: t('vault.deleted'),
        description: t('vault.deletedDesc'),
      });
    }
  };

  // Group memories by year and month
  const groupedMemories = memories.reduce((acc, memory) => {
    const date = memory.memory_date ? new Date(memory.memory_date) : new Date(memory.created_at);
    const key = format(date, 'yyyy-MM');
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(memory);
    return acc;
  }, {} as Record<string, Memory[]>);

  const dateLocale = language === 'de' ? de : enUS;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/coach" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
              <ArrowLeft className="h-4 w-4" />
              {t('vault.backToCoach')}
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Archive className="h-5 w-5 text-accent" />
            <h1 className="font-serif text-lg">{t('vault.title')}</h1>
          </div>
          <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : memories.length === 0 ? (
          <div className="text-center py-16">
            <Archive className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h2 className="font-serif text-xl mb-2">{t('vault.empty')}</h2>
            <p className="text-muted-foreground mb-6">{t('vault.emptyDesc')}</p>
            <Button onClick={() => navigate('/coach')}>
              {t('vault.startJourney')}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Timeline */}
            <div className="lg:col-span-2">
              <h2 className="font-serif text-xl mb-6 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent" />
                {t('vault.timeline')}
              </h2>
              
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                
                {Object.entries(groupedMemories).map(([monthKey, monthMemories]) => {
                  const date = new Date(monthKey + '-01');
                  return (
                    <div key={monthKey} className="mb-8">
                      {/* Month header */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center z-10">
                          <Calendar className="h-4 w-4 text-accent-foreground" />
                        </div>
                        <h3 className="font-serif text-lg text-foreground">
                          {format(date, 'MMMM yyyy', { locale: dateLocale })}
                        </h3>
                      </div>
                      
                      {/* Memories in this month */}
                      <div className="ml-12 space-y-3">
                        {monthMemories.map((memory) => {
                          const IconComponent = memoryTypeIcons[memory.memory_type] || BookOpen;
                          const memoryDate = memory.memory_date ? new Date(memory.memory_date) : new Date(memory.created_at);
                          
                          return (
                            <div
                              key={memory.id}
                              onClick={() => setSelectedMemory(memory)}
                              className={cn(
                                "group p-4 rounded-lg border cursor-pointer transition-all",
                                selectedMemory?.id === memory.id
                                  ? "bg-secondary border-accent"
                                  : "bg-card border-border hover:border-accent/50"
                              )}
                            >
                              <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-secondary shrink-0">
                                  <IconComponent className="h-4 w-4 text-accent" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <h4 className="font-medium text-foreground truncate">{memory.title}</h4>
                                    <span className="text-xs text-muted-foreground shrink-0">
                                      {format(memoryDate, 'd. MMM', { locale: dateLocale })}
                                    </span>
                                  </div>
                                  {memory.summary && (
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                      {memory.summary}
                                    </p>
                                  )}
                                  {memory.emotion && (
                                    <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                                      {memory.emotion}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detail Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                {selectedMemory ? (
                  <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {(() => {
                          const IconComponent = memoryTypeIcons[selectedMemory.memory_type] || BookOpen;
                          return <IconComponent className="h-5 w-5 text-accent" />;
                        })()}
                        <span className="text-sm text-muted-foreground capitalize">
                          {t(`coach.promptLabels.${selectedMemory.memory_type}`) || selectedMemory.memory_type}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteMemory(selectedMemory.id)}
                        className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </button>
                    </div>
                    
                    <h3 className="font-serif text-xl mb-2">{selectedMemory.title}</h3>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      {format(
                        selectedMemory.memory_date ? new Date(selectedMemory.memory_date) : new Date(selectedMemory.created_at),
                        'PPP',
                        { locale: dateLocale }
                      )}
                    </p>
                    
                    {selectedMemory.emotion && (
                      <div className="mb-4">
                        <span className="text-xs text-muted-foreground">{t('vault.emotion')}:</span>
                        <span className="ml-2 text-sm px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                          {selectedMemory.emotion}
                        </span>
                      </div>
                    )}
                    
                    <ScrollArea className="h-[400px]">
                      <div className="prose prose-sm dark:prose-invert">
                        <p className="whitespace-pre-wrap text-sm text-foreground">
                          {selectedMemory.content}
                        </p>
                      </div>
                    </ScrollArea>
                  </div>
                ) : (
                  <div className="bg-card border border-border rounded-lg p-6 text-center">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-muted-foreground">{t('vault.selectMemory')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MemoryVault;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  Lightbulb, 
  Plus, 
  Check, 
  Undo2, 
  Trash2, 
  MessageSquare,
  Sparkles,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';

interface DeepenIdea {
  id: string;
  title: string;
  note: string | null;
  source: string;
  conversation_id: string | null;
  is_completed: boolean;
  created_at: string;
  completed_at: string | null;
}

interface DeepenIdeasProps {
  onExploreIdea?: (idea: DeepenIdea) => void;
}

const DeepenIdeas: React.FC<DeepenIdeasProps> = ({ onExploreIdea }) => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [ideas, setIdeas] = useState<DeepenIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newNote, setNewNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  const dateLocale = language === 'de' ? de : enUS;

  useEffect(() => {
    if (user) {
      loadIdeas();
    }
  }, [user]);

  const loadIdeas = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('deepen_ideas')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading ideas:', error);
    } else {
      setIdeas(data || []);
    }
    setLoading(false);
  };

  const addIdea = async () => {
    if (!user || !newTitle.trim()) return;
    
    setIsSaving(true);
    const { data, error } = await supabase
      .from('deepen_ideas')
      .insert({
        user_id: user.id,
        title: newTitle.trim(),
        note: newNote.trim() || null,
        source: 'manual',
      })
      .select()
      .single();

    if (error) {
      toast({
        title: t('vault.error'),
        description: t('vault.deepenError'),
        variant: 'destructive',
      });
    } else {
      setIdeas(prev => [data, ...prev]);
      setNewTitle('');
      setNewNote('');
      setShowAddDialog(false);
      toast({
        title: t('vault.deepenSaved'),
        description: t('vault.deepenSavedDesc'),
      });
    }
    setIsSaving(false);
  };

  const toggleComplete = async (idea: DeepenIdea) => {
    const { error } = await supabase
      .from('deepen_ideas')
      .update({
        is_completed: !idea.is_completed,
        completed_at: !idea.is_completed ? new Date().toISOString() : null,
      })
      .eq('id', idea.id);

    if (!error) {
      setIdeas(prev => prev.map(i => 
        i.id === idea.id 
          ? { ...i, is_completed: !i.is_completed, completed_at: !i.is_completed ? new Date().toISOString() : null }
          : i
      ));
    }
  };

  const deleteIdea = async (id: string) => {
    const { error } = await supabase
      .from('deepen_ideas')
      .delete()
      .eq('id', id);

    if (!error) {
      setIdeas(prev => prev.filter(i => i.id !== id));
      toast({
        title: t('vault.deepenDeleted'),
        description: t('vault.deepenDeletedDesc'),
      });
    }
  };

  const handleExplore = (idea: DeepenIdea) => {
    if (onExploreIdea) {
      onExploreIdea(idea);
    } else {
      // Navigate to coach with the idea as initial message
      navigate('/coach', { state: { initialMessage: `Ich möchte folgendes Thema vertiefen: "${idea.title}"${idea.note ? ` - ${idea.note}` : ''}` } });
    }
  };

  const activeIdeas = ideas.filter(i => !i.is_completed);
  const completedIdeas = ideas.filter(i => i.is_completed);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-accent" />
          <h3 className="font-serif text-lg">{t('vault.deepenTitle')}</h3>
          {activeIdeas.length > 0 && (
            <Badge variant="secondary" className="ml-2">{activeIdeas.length}</Badge>
          )}
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => setShowAddDialog(true)}
          className="gap-1"
        >
          <Plus className="h-4 w-4" />
          {t('vault.deepenAddNew')}
        </Button>
      </div>

      {/* Ideas List */}
      {activeIdeas.length === 0 && completedIdeas.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Lightbulb className="h-10 w-10 mx-auto mb-3 opacity-50" />
          <p className="text-sm">{t('vault.deepenEmpty')}</p>
          <p className="text-xs mt-1">{t('vault.deepenEmptyDesc')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Active Ideas */}
          {activeIdeas.map(idea => (
            <div
              key={idea.id}
              className="group p-3 rounded-lg border border-border bg-card hover:border-accent/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-medium text-foreground">{idea.title}</h4>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs",
                        idea.source === 'coach' ? "border-accent text-accent" : ""
                      )}
                    >
                      {idea.source === 'coach' ? (
                        <>
                          <Sparkles className="h-3 w-3 mr-1" />
                          {t('vault.deepenFromCoach')}
                        </>
                      ) : (
                        t('vault.deepenFromManual')
                      )}
                    </Badge>
                  </div>
                  {idea.note && (
                    <p className="text-sm text-muted-foreground mt-1">{idea.note}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {format(new Date(idea.created_at), 'PPP', { locale: dateLocale })}
                  </p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleExplore(idea)}
                    className="p-1.5 hover:bg-accent/10 rounded-md transition-colors"
                    title={t('vault.deepenExplore')}
                  >
                    <MessageSquare className="h-4 w-4 text-accent" />
                  </button>
                  <button
                    onClick={() => toggleComplete(idea)}
                    className="p-1.5 hover:bg-accent/10 rounded-md transition-colors"
                    title={t('vault.deepenMarkComplete')}
                  >
                    <Check className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => deleteIdea(idea.id)}
                    className="p-1.5 hover:bg-destructive/10 rounded-md transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Completed Ideas Toggle */}
          {completedIdeas.length > 0 && (
            <div className="pt-2">
              <button
                onClick={() => setShowCompleted(!showCompleted)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Check className="h-4 w-4" />
                {t('vault.deepenCompleted')} ({completedIdeas.length})
              </button>
              
              {showCompleted && (
                <div className="mt-2 space-y-2">
                  {completedIdeas.map(idea => (
                    <div
                      key={idea.id}
                      className="group p-3 rounded-lg border border-border bg-muted/30 opacity-60 hover:opacity-100 transition-opacity"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground line-through">{idea.title}</h4>
                          {idea.note && (
                            <p className="text-sm text-muted-foreground mt-1 line-through">{idea.note}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => toggleComplete(idea)}
                            className="p-1.5 hover:bg-accent/10 rounded-md transition-colors"
                            title={t('vault.deepenMarkIncomplete')}
                          >
                            <Undo2 className="h-4 w-4 text-muted-foreground" />
                          </button>
                          <button
                            onClick={() => deleteIdea(idea.id)}
                            className="p-1.5 hover:bg-destructive/10 rounded-md transition-colors"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-accent" />
              {t('vault.deepenAddNew')}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder={t('vault.deepenTitlePlaceholder')}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && addIdea()}
            />
            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder={t('vault.deepenNotePlaceholder')}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              {t('vault.cancel')}
            </Button>
            <Button onClick={addIdea} disabled={!newTitle.trim() || isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t('vault.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeepenIdeas;

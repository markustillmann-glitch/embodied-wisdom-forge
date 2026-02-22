import React, { useState, useEffect, useRef } from 'react';
import { Plus, MapPin, Calendar, Heart, Camera, Link, Video, X, Trash2, Pencil, Check, MessageSquare, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import { MemoryChatDialog } from './MemoryChatDialog';
import { MemoryDetailDialog } from './MemoryDetailDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface UserMemory {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  memory_date: string | null;
  location: string | null;
  emotion: string | null;
  tags: string[];
  media: Array<{ type: 'image' | 'video'; url: string; caption?: string }>;
  linked_reflection_id: string | null;
  linked_part_id: string | null;
  chat_content: string | null;
  created_at: string;
  updated_at: string;
}

interface MemoriesSectionProps {
  initialReflectionId?: string | null;
  initialPartId?: string | null;
  initialContext?: string | null;
  onStartBarometer?: (context: string) => void;
}

export const MemoriesSection: React.FC<MemoriesSectionProps> = ({
  initialReflectionId,
  initialPartId,
  initialContext,
  onStartBarometer,
}) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [memories, setMemories] = useState<UserMemory[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [detailMemory, setDetailMemory] = useState<UserMemory | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const dateLocale = language === 'de' ? de : enUS;

  // Auto-open chat if coming from reflection/part
  useEffect(() => {
    if (initialReflectionId || initialPartId) {
      setChatOpen(true);
    }
  }, [initialReflectionId, initialPartId]);

  useEffect(() => {
    if (user) loadMemories();
  }, [user]);

  const loadMemories = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('user_memories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMemories((data || []).map(m => ({
        ...m,
        tags: m.tags || [],
        media: (m.media as any) || [],
      })));
    } catch (error) {
      console.error('Error loading memories:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMemory = async (id: string) => {
    if (!user) return;
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('user_memories')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) throw error;
      setMemories(prev => prev.filter(m => m.id !== id));
      setDeleteId(null);
      toast.success(language === 'de' ? 'Erinnerung gelöscht' : 'Memory deleted');
    } catch (error) {
      console.error('Error deleting memory:', error);
      toast.error(language === 'de' ? 'Fehler beim Löschen' : 'Error deleting');
    } finally {
      setDeleting(false);
    }
  };

  const handleMemorySaved = (memory: UserMemory) => {
    setMemories(prev => [memory, ...prev]);
    setChatOpen(false);
  };

  const handleMemoryUpdated = (updated: UserMemory) => {
    setMemories(prev => prev.map(m => m.id === updated.id ? updated : m));
    setDetailMemory(updated);
  };

  const emotionEmojis: Record<string, string> = {
    'Freude': '😊', 'Dankbarkeit': '🙏', 'Geborgenheit': '🤗', 'Stolz': '💪',
    'Liebe': '❤️', 'Frieden': '☮️', 'Staunen': '✨', 'Hoffnung': '🌱',
    'Erleichterung': '😌', 'Verbundenheit': '🤝',
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {/* New Memory Button */}
      <div className="flex justify-center mb-6">
        <Button onClick={() => setChatOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          {language === 'de' ? 'Neue Erinnerung festhalten' : 'Capture new memory'}
        </Button>
      </div>

      {/* Memories Grid */}
      {memories.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Heart className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">
            {language === 'de' ? 'Noch keine Erinnerungen gespeichert' : 'No memories saved yet'}
          </p>
          <p className="text-sm text-muted-foreground/70 mt-2">
            {language === 'de'
              ? 'Halte besondere Momente fest – Oria hilft dir dabei.'
              : 'Capture special moments – Oria will help you.'}
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {memories.map((memory, index) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setDetailMemory(memory)}
              className="bg-card border border-border rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow group"
            >
              {/* Cover Image */}
              {memory.media.length > 0 && memory.media[0].type === 'image' && (
                <div className="h-36 overflow-hidden">
                  <img
                    src={memory.media[0].url}
                    alt={memory.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-foreground line-clamp-1">{memory.title}</h3>
                  {memory.emotion && (
                    <span className="text-lg shrink-0">{emotionEmojis[memory.emotion] || '💭'}</span>
                  )}
                </div>

                {memory.description && (
                  <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{memory.description}</p>
                )}

                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {memory.memory_date && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(memory.memory_date), 'dd. MMM yyyy', { locale: dateLocale })}
                    </span>
                  )}
                  {memory.location && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {memory.location}
                    </span>
                  )}
                  {memory.media.length > 0 && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <ImageIcon className="w-3 h-3" />
                      {memory.media.length}
                    </span>
                  )}
                </div>

                {memory.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {memory.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Chat Dialog */}
      <MemoryChatDialog
        open={chatOpen}
        onOpenChange={setChatOpen}
        onMemorySaved={handleMemorySaved}
        linkedReflectionId={initialReflectionId || undefined}
        linkedPartId={initialPartId || undefined}
        initialContext={initialContext || undefined}
      />

      {/* Detail Dialog */}
      {detailMemory && (
        <MemoryDetailDialog
          memory={detailMemory}
          open={!!detailMemory}
          onOpenChange={(open) => !open && setDetailMemory(null)}
          onDelete={(id) => { setDetailMemory(null); setDeleteId(id); }}
          onUpdated={handleMemoryUpdated}
          onStartBarometer={onStartBarometer}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{language === 'de' ? 'Erinnerung löschen?' : 'Delete memory?'}</AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'de'
                ? 'Diese Erinnerung wird unwiderruflich gelöscht.'
                : 'This memory will be permanently deleted.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{language === 'de' ? 'Abbrechen' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMemory(deleteId)}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (language === 'de' ? 'Löschen...' : 'Deleting...') : (language === 'de' ? 'Löschen' : 'Delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

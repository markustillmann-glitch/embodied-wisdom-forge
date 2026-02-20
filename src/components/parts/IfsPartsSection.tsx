import React, { useState, useEffect } from 'react';
import { Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { IfsPartCard, type IfsPart } from './IfsPartCard';
import { IfsPartDialog } from './IfsPartDialog';
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

export const IfsPartsSection: React.FC = () => {
  const { user } = useAuth();
  const [parts, setParts] = useState<IfsPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<IfsPart | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [generatingImageId, setGeneratingImageId] = useState<string | null>(null);

  useEffect(() => {
    if (user) loadParts();
  }, [user]);

  const loadParts = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('ifs_parts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setParts((data as unknown as IfsPart[]) || []);
    } catch (error) {
      console.error('Error loading parts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: Omit<IfsPart, 'id' | 'created_at' | 'image_url'>) => {
    if (!user) return;

    try {
      if (editingPart) {
        const { error } = await supabase
          .from('ifs_parts')
          .update(formData as any)
          .eq('id', editingPart.id)
          .eq('user_id', user.id);
        if (error) throw error;
        setParts(prev => prev.map(p => p.id === editingPart.id ? { ...p, ...formData } : p));
        toast.success('Anteil aktualisiert');
      } else {
        const { data, error } = await supabase
          .from('ifs_parts')
          .insert({ ...formData, user_id: user.id } as any)
          .select()
          .single();
        if (error) throw error;
        setParts(prev => [data as unknown as IfsPart, ...prev]);
        toast.success('Anteil erstellt');
      }
      setEditingPart(null);
    } catch (error) {
      console.error('Error saving part:', error);
      toast.error('Fehler beim Speichern');
    }
  };

  const handleDelete = async () => {
    if (!user || !deleteId) return;
    try {
      const { error } = await supabase
        .from('ifs_parts')
        .delete()
        .eq('id', deleteId)
        .eq('user_id', user.id);
      if (error) throw error;
      setParts(prev => prev.filter(p => p.id !== deleteId));
      setDeleteId(null);
      toast.success('Anteil gelöscht');
    } catch (error) {
      console.error('Error deleting part:', error);
      toast.error('Fehler beim Löschen');
    }
  };

  const handleGenerateImage = async (part: IfsPart) => {
    if (!user) return;
    setGeneratingImageId(part.id);

    try {
      const response = await supabase.functions.invoke('generate-part-image', {
        body: {
          partId: part.id,
          imagePrompt: part.image_prompt || '',
          partName: part.name,
          role: part.role,
        },
      });

      if (response.error) throw new Error(response.error.message || 'Fehler bei der Bildgenerierung');

      const { imageUrl } = response.data;
      if (imageUrl) {
        setParts(prev => prev.map(p => p.id === part.id ? { ...p, image_url: imageUrl } : p));
        toast.success('Bild generiert! ✨');
      }
    } catch (error: any) {
      console.error('Error generating image:', error);
      toast.error(error.message || 'Fehler bei der Bildgenerierung');
    } finally {
      setGeneratingImageId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div>
      {/* Add button */}
      <div className="flex justify-center mb-6">
        <Button
          onClick={() => { setEditingPart(null); setDialogOpen(true); }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Neuen Anteil erfassen
        </Button>
      </div>

      {parts.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
          <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">Noch keine Anteile erfasst.</p>
          <p className="text-sm text-muted-foreground/70 mt-2">
            Erfasse Anteile, die du in IFS-Meditationen kennengelernt hast.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {parts.map(part => (
            <IfsPartCard
              key={part.id}
              part={part}
              onEdit={(p) => { setEditingPart(p); setDialogOpen(true); }}
              onDelete={setDeleteId}
              onGenerateImage={handleGenerateImage}
              isGeneratingImage={generatingImageId === part.id}
            />
          ))}
        </div>
      )}

      <IfsPartDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        editingPart={editingPart}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anteil löschen?</AlertDialogTitle>
            <AlertDialogDescription>Diese Aktion kann nicht rückgängig gemacht werden.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Löschen</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

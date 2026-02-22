import React, { useState, useRef } from 'react';
import { MapPin, Calendar, Heart, Camera, Link, Trash2, Pencil, Check, X, Video, Plus, ExternalLink, Loader2, Thermometer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { UserMemory } from './MemoriesSection';

interface MemoryDetailDialogProps {
  memory: UserMemory;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (id: string) => void;
  onUpdated: (memory: UserMemory) => void;
  onStartBarometer?: (context: string) => void;
}

export const MemoryDetailDialog: React.FC<MemoryDetailDialogProps> = ({
  memory,
  open,
  onOpenChange,
  onDelete,
  onUpdated,
  onStartBarometer,
}) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const dateLocale = language === 'de' ? de : enUS;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(memory.title);
  const [editingDesc, setEditingDesc] = useState(false);
  const [descValue, setDescValue] = useState(memory.description || '');
  const [mediaUrl, setMediaUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [saving, setSaving] = useState(false);

  const emotionEmojis: Record<string, string> = {
    'Freude': '😊', 'Dankbarkeit': '🙏', 'Geborgenheit': '🤗', 'Stolz': '💪',
    'Liebe': '❤️', 'Frieden': '☮️', 'Staunen': '✨', 'Hoffnung': '🌱',
    'Erleichterung': '😌', 'Verbundenheit': '🤝',
  };

  const saveField = async (field: string, value: any) => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_memories')
        .update({ [field]: value })
        .eq('id', memory.id)
        .eq('user_id', user.id);
      if (error) throw error;
      onUpdated({ ...memory, [field]: value });
      toast.success(language === 'de' ? 'Gespeichert' : 'Saved');
    } catch (e) {
      console.error('Error saving:', e);
      toast.error(language === 'de' ? 'Fehler beim Speichern' : 'Error saving');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!user) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error(language === 'de' ? 'Nur JPG, PNG oder WebP' : 'Only JPG, PNG or WebP');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error(language === 'de' ? 'Maximal 10 MB' : 'Max 10 MB');
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${user.id}/${memory.id}_${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('memory-uploads')
        .upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: signedData } = await supabase.storage
        .from('memory-uploads')
        .createSignedUrl(fileName, 60 * 60 * 24 * 365);

      if (!signedData?.signedUrl) throw new Error('No signed URL');

      const newMedia = [...memory.media, { type: 'image' as const, url: signedData.signedUrl }];
      await saveField('media', newMedia);
    } catch (e) {
      console.error('Upload error:', e);
      toast.error(language === 'de' ? 'Upload fehlgeschlagen' : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const addMediaUrl = async () => {
    if (!mediaUrl.trim()) return;
    const isVideo = /youtube|youtu\.be|vimeo/i.test(mediaUrl);
    const newMedia = [...memory.media, { type: isVideo ? 'video' as const : 'image' as const, url: mediaUrl.trim() }];
    await saveField('media', newMedia);
    setMediaUrl('');
    setShowUrlInput(false);
  };

  const removeMedia = async (index: number) => {
    const newMedia = memory.media.filter((_, i) => i !== index);
    await saveField('media', newMedia);
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([^&?]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {editingTitle ? (
              <div className="flex-1 flex items-center gap-2">
                <input
                  value={titleValue}
                  onChange={(e) => setTitleValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { saveField('title', titleValue); setEditingTitle(false); } }}
                  className="flex-1 bg-transparent border-b-2 border-primary outline-none"
                  autoFocus
                />
                <button onClick={() => { saveField('title', titleValue); setEditingTitle(false); }} className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-primary" />
                </button>
                <button onClick={() => { setTitleValue(memory.title); setEditingTitle(false); }} className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            ) : (
              <div className="flex-1 flex items-center gap-2 group">
                <span className="flex-1">{memory.title}</span>
                {memory.emotion && <span>{emotionEmojis[memory.emotion] || '💭'}</span>}
                <button onClick={() => setEditingTitle(true)} className="w-6 h-6 rounded-full hover:bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {memory.memory_date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {format(new Date(memory.memory_date), 'dd. MMMM yyyy', { locale: dateLocale })}
              </span>
            )}
            {memory.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {memory.location}
              </span>
            )}
            {memory.emotion && (
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" />
                {memory.emotion}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="group">
            {editingDesc ? (
              <div className="space-y-2">
                <textarea
                  value={descValue}
                  onChange={(e) => setDescValue(e.target.value)}
                  className="w-full text-foreground bg-transparent border border-primary/30 rounded-lg p-3 outline-none focus:border-primary resize-none min-h-[100px] text-sm"
                  autoFocus
                />
                <div className="flex gap-2 justify-end">
                  <button onClick={() => { setDescValue(memory.description || ''); setEditingDesc(false); }} className="px-3 py-1.5 text-sm rounded-lg bg-muted text-muted-foreground">
                    {language === 'de' ? 'Abbrechen' : 'Cancel'}
                  </button>
                  <button onClick={() => { saveField('description', descValue); setEditingDesc(false); }} className="px-3 py-1.5 text-sm rounded-lg bg-primary/10 text-primary font-medium">
                    {language === 'de' ? 'Speichern' : 'Save'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <p className="text-foreground text-sm leading-relaxed pr-8">
                  {memory.description || (language === 'de' ? 'Keine Beschreibung' : 'No description')}
                </p>
                <button onClick={() => setEditingDesc(true)} className="absolute top-0 right-0 w-6 h-6 rounded-full hover:bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            )}
          </div>

          {/* Tags */}
          {memory.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {memory.tags.map((tag, i) => (
                <span key={i} className="px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Media */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">
              {language === 'de' ? 'Medien' : 'Media'}
            </h4>

            {/* Existing media */}
            <div className="grid grid-cols-2 gap-2">
              {memory.media.map((item, i) => (
                <div key={i} className="relative group/media rounded-lg overflow-hidden">
                  {item.type === 'image' ? (
                    <img src={item.url} alt="" className="w-full h-32 object-cover" />
                  ) : (
                    (() => {
                      const embedUrl = getYouTubeEmbedUrl(item.url);
                      return embedUrl ? (
                        <iframe src={embedUrl} className="w-full h-32" allowFullScreen />
                      ) : (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="w-full h-32 bg-muted flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <Video className="w-5 h-5" /> Video
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      );
                    })()
                  )}
                  <button
                    onClick={() => removeMedia(i)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center opacity-0 group-hover/media:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add media buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="gap-1.5"
              >
                {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
                {language === 'de' ? 'Foto' : 'Photo'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="gap-1.5"
              >
                <Link className="w-3.5 h-3.5" />
                {language === 'de' ? 'Link' : 'Link'}
              </Button>
            </div>

            {/* URL input */}
            {showUrlInput && (
              <div className="flex gap-2">
                <Input
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder={language === 'de' ? 'Bild- oder Video-URL...' : 'Image or video URL...'}
                  className="text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && addMediaUrl()}
                />
                <Button size="sm" onClick={addMediaUrl} disabled={!mediaUrl.trim()}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Delete */}
          <div className="pt-2 border-t border-border flex flex-wrap gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(memory.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              {language === 'de' ? 'Erinnerung löschen' : 'Delete memory'}
            </Button>
            {onStartBarometer && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => {
                  onStartBarometer(`Erinnerung: ${memory.title}`);
                  onOpenChange(false);
                }}
              >
                <Thermometer className="w-4 h-4" />
                Self-Barometer
              </Button>
            )}
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file);
            e.target.value = '';
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

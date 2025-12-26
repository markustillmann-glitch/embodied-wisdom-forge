import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import MemoryBook from '@/components/MemoryBook';
import DeepenIdeas from '@/components/DeepenIdeas';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Loader2, 
  Archive,
  Calendar,
  Music,
  Music2,
  Heart,
  Briefcase,
  Users,
  Baby,
  Plane,
  Trophy,
  UserCheck,
  Trash2,
  BookOpen,
  Pencil,
  Download,
  Upload,
  Sparkles,
  Image as ImageIcon,
  X,
  BookMarked,
  FileText,
  ExternalLink,
  Lock,
  Eye,
  EyeOff
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
  additional_thoughts: string | null;
  image_url: string | null;
  feeling_after: string[] | null;
  needs_after: string[] | null;
  memory_book_data?: unknown;
  pdf_url?: string | null;
}

const memoryTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  concert: Music,
  relationship: Heart,
  work: Briefcase,
  childhood: Users,
  early_childhood: Baby,
  travel: Plane,
  friendship: UserCheck,
  success: Trophy,
  meditation: Sparkles,
  song: Music2,
  general: BookOpen,
  'oria-youth': Users,
};

const nvcFeelings = [
  'relieved', 'confused', 'peaceful', 'sad', 'grateful', 
  'hopeful', 'vulnerable', 'energized', 'tender', 'overwhelmed', 
  'curious', 'moved'
];

const nvcNeeds = [
  'connection', 'understanding', 'autonomy', 'security', 'meaning',
  'play', 'rest', 'authenticity', 'growth', 'contribution',
  'empathy', 'clarity'
];

const MemoryVault = () => {
  const { user, loading: authLoading } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  
  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [editAdditionalThoughts, setEditAdditionalThoughts] = useState('');
  const [editFeelingsAfter, setEditFeelingsAfter] = useState<string[]>([]);
  const [editNeedsAfter, setEditNeedsAfter] = useState<string[]>([]);
  const [editImageUrl, setEditImageUrl] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  
  // Password protection state
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [storedPasswordHash, setStoredPasswordHash] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      checkPasswordProtection();
    }
  }, [user]);

  useEffect(() => {
    if (user && isUnlocked) {
      loadMemories();
    }
  }, [user, isUnlocked]);

  // Simple hash function for password verification
  const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const checkPasswordProtection = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('vault_password_hash')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error checking password:', error);
      setHasPassword(false);
      setIsUnlocked(true);
      return;
    }

    if (data?.vault_password_hash) {
      setHasPassword(true);
      setStoredPasswordHash(data.vault_password_hash);
      setIsUnlocked(false);
    } else {
      setHasPassword(false);
      setIsUnlocked(true);
    }
  };

  const verifyPassword = async () => {
    if (!passwordInput || !storedPasswordHash) return;
    
    const inputHash = await hashPassword(passwordInput);
    
    if (inputHash === storedPasswordHash) {
      setIsUnlocked(true);
      setPasswordError(false);
      setPasswordInput('');
    } else {
      setPasswordError(true);
      toast({
        title: t('vault.passwordWrong'),
        description: t('vault.passwordWrongDesc'),
        variant: 'destructive',
      });
    }
  };

  const loadMemories = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .eq('user_id', user.id)
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

  const openEditDialog = (memory: Memory) => {
    setEditTitle(memory.title);
    setEditSummary(memory.summary || '');
    setEditAdditionalThoughts(memory.additional_thoughts || '');
    setEditFeelingsAfter(memory.feeling_after || []);
    setEditNeedsAfter(memory.needs_after || []);
    setEditImageUrl(memory.image_url || '');
    setEditDialogOpen(true);
  };

  const updateMemory = async () => {
    if (!selectedMemory) return;
    
    setIsUpdating(true);
    
    const { data, error } = await supabase
      .from('memories')
      .update({
        title: editTitle.trim(),
        summary: editSummary.trim() || null,
        additional_thoughts: editAdditionalThoughts.trim() || null,
        feeling_after: editFeelingsAfter.length > 0 ? editFeelingsAfter : null,
        needs_after: editNeedsAfter.length > 0 ? editNeedsAfter : null,
        image_url: editImageUrl || null,
      })
      .eq('id', selectedMemory.id)
      .select()
      .single();

    setIsUpdating(false);

    if (error) {
      toast({
        title: t('vault.error'),
        description: t('vault.updateError'),
        variant: 'destructive',
      });
    } else {
      setMemories(prev => prev.map(m => m.id === selectedMemory.id ? data : m));
      setSelectedMemory(data);
      setEditDialogOpen(false);
      toast({
        title: t('vault.updated'),
        description: t('vault.updatedDesc'),
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploadingImage(true);
    
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${selectedMemory?.id || 'temp'}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('memory-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      toast({
        title: t('vault.error'),
        description: uploadError.message,
        variant: 'destructive',
      });
      setIsUploadingImage(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('memory-images')
      .getPublicUrl(filePath);

    setEditImageUrl(publicUrl);
    setIsUploadingImage(false);
  };

  const generateAIImage = async () => {
    if (!selectedMemory) return;
    
    setIsGeneratingImage(true);

    try {
      const response = await supabase.functions.invoke('generate-memory-image', {
        body: {
          title: editTitle || selectedMemory.title,
          summary: editSummary || selectedMemory.summary,
          emotion: editFeelingsAfter.length > 0 ? editFeelingsAfter[0] : selectedMemory.emotion,
          memoryType: selectedMemory.memory_type,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const { imageUrl } = response.data;
      
      if (imageUrl) {
        // Upload the base64 image to storage
        const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, '');
        const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        const blob = new Blob([binaryData], { type: 'image/png' });
        
        const filePath = `${user?.id}/${selectedMemory.id}-ai-${Date.now()}.png`;
        
        const { error: uploadError } = await supabase.storage
          .from('memory-images')
          .upload(filePath, blob);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('memory-images')
          .getPublicUrl(filePath);

        setEditImageUrl(publicUrl);
        
        toast({
          title: t('vault.imageGenerated'),
          description: t('vault.imageGeneratedDesc'),
        });
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: t('vault.error'),
        description: t('vault.imageError'),
        variant: 'destructive',
      });
    }

    setIsGeneratingImage(false);
  };

  const exportMemory = (memory: Memory) => {
    const dateLocale = language === 'de' ? de : enUS;
    const memoryDate = memory.memory_date ? new Date(memory.memory_date) : new Date(memory.created_at);
    
    let content = `# ${memory.title}\n\n`;
    content += `Datum: ${format(memoryDate, 'PPP', { locale: dateLocale })}\n`;
    content += `Typ: ${t(`coach.promptLabels.${memory.memory_type}`) || memory.memory_type}\n`;
    
    if (memory.emotion) {
      content += `Gefühl während: ${memory.emotion}\n`;
    }
    
    if (memory.feeling_after && memory.feeling_after.length > 0) {
      const feelingsLabels = memory.feeling_after.map(f => t(`vault.nvcFeelings.${f}`) || f).join(', ');
      content += `Gefühle danach: ${feelingsLabels}\n`;
    }
    
    if (memory.needs_after && memory.needs_after.length > 0) {
      const needsLabels = memory.needs_after.map(n => t(`vault.nvcNeeds.${n}`) || n).join(', ');
      content += `Bedürfnisse: ${needsLabels}\n`;
    }
    
    content += `\n---\n\n`;
    
    if (memory.summary) {
      content += `## Zusammenfassung\n${memory.summary}\n\n`;
    }
    
    content += `## Inhalt\n${memory.content}\n`;
    
    if (memory.additional_thoughts) {
      content += `\n## Weitere Gedanken\n${memory.additional_thoughts}\n`;
    }

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${memory.title.replace(/[^a-z0-9]/gi, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: t('vault.exportSuccess'),
      description: t('vault.exportSuccessDesc'),
    });
  };

  const toggleFeeling = (feeling: string) => {
    setEditFeelingsAfter(prev => 
      prev.includes(feeling) 
        ? prev.filter(f => f !== feeling)
        : [...prev, feeling]
    );
  };

  const toggleNeed = (need: string) => {
    setEditNeedsAfter(prev => 
      prev.includes(need) 
        ? prev.filter(n => n !== need)
        : [...prev, need]
    );
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

  if (authLoading || hasPassword === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Password protection screen
  if (hasPassword && !isUnlocked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-card rounded-xl border border-border p-6 sm:p-8 text-center">
            <div className="p-4 rounded-full bg-accent/10 w-fit mx-auto mb-6">
              <Lock className="h-8 w-8 text-accent" />
            </div>
            <h2 className="font-serif text-xl mb-2">{t('vault.passwordRequired')}</h2>
            <p className="text-muted-foreground text-sm mb-6">{t('vault.passwordRequiredDesc')}</p>
            
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type={showPasswordInput ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError(false);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && verifyPassword()}
                  placeholder={t('vault.passwordPlaceholder')}
                  className={cn("pr-10", passwordError && "border-destructive")}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordInput(!showPasswordInput)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPasswordInput ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              <Button onClick={verifyPassword} className="w-full">
                {t('vault.passwordUnlock')}
              </Button>
            </div>
            
            <div className="mt-6 pt-6 border-t border-border">
              <Link 
                to="/oria-coach"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4 inline mr-1" />
                {t('vault.backToCoach')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/oria-coach" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
              <ArrowLeft className="h-4 w-4" />
              {t('vault.backToCoach')}
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Archive className="h-5 w-5 text-accent" />
            <h1 className="font-serif text-lg">{t('vault.title')}</h1>
          </div>
          <div className="w-24" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : (
          <>
            {/* Deepen Ideas Section - Always visible */}
            <div className="mb-8 p-6 rounded-lg border border-border bg-card">
              <DeepenIdeas />
            </div>

            {memories.length === 0 ? (
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
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                    
                    {Object.entries(groupedMemories).map(([monthKey, monthMemories]) => {
                      const date = new Date(monthKey + '-01');
                      return (
                        <div key={monthKey} className="mb-8">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center z-10">
                              <Calendar className="h-4 w-4 text-accent-foreground" />
                            </div>
                            <h3 className="font-serif text-lg text-foreground">
                              {format(date, 'MMMM yyyy', { locale: dateLocale })}
                            </h3>
                          </div>
                          
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
                                    {memory.image_url ? (
                                      <img 
                                        src={memory.image_url} 
                                        alt="" 
                                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                                      />
                                    ) : (
                                      <div className="p-2 rounded-lg bg-secondary shrink-0">
                                        <IconComponent className="h-4 w-4 text-accent" />
                                      </div>
                                    )}
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
                                      <div className="flex flex-wrap gap-1 mt-2">
                                        {memory.emotion && (
                                          <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                                            {memory.emotion}
                                          </span>
                                        )}
                                        {memory.feeling_after && memory.feeling_after.length > 0 && memory.feeling_after.slice(0, 2).map(feeling => (
                                          <span key={feeling} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                            {t(`vault.nvcFeelings.${feeling}`) || feeling}
                                          </span>
                                        ))}
                                      </div>
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
                    {/* Image */}
                    {selectedMemory.image_url && (
                      <div className="mb-4 -mx-6 -mt-6">
                        <img 
                          src={selectedMemory.image_url} 
                          alt="" 
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      </div>
                    )}
                    
                    {/* Actions */}
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
                      <div className="flex items-center gap-1">
                        {selectedMemory.pdf_url && (
                          <a
                            href={selectedMemory.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-accent/10 rounded-lg transition-colors flex items-center gap-1"
                            title={t('vault.book.openPdf')}
                          >
                            <FileText className="h-4 w-4 text-accent" />
                            <ExternalLink className="h-3 w-3 text-accent" />
                          </a>
                        )}
                        <button
                          onClick={() => setBookOpen(true)}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                          title={t('vault.book.createBook')}
                        >
                          <BookMarked className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => exportMemory(selectedMemory)}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                          title={t('vault.export')}
                        >
                          <Download className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => openEditDialog(selectedMemory)}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                          title={t('vault.edit')}
                        >
                          <Pencil className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => deleteMemory(selectedMemory.id)}
                          className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="font-serif text-xl mb-2">{selectedMemory.title}</h3>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      {format(
                        selectedMemory.memory_date ? new Date(selectedMemory.memory_date) : new Date(selectedMemory.created_at),
                        'PPP',
                        { locale: dateLocale }
                      )}
                    </p>
                    
                    {/* Emotions & Needs */}
                    <div className="space-y-3 mb-4">
                      {selectedMemory.emotion && (
                        <div>
                          <span className="text-xs text-muted-foreground">{t('vault.emotion')}:</span>
                          <span className="ml-2 text-sm px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                            {selectedMemory.emotion}
                          </span>
                        </div>
                      )}
                      
                      {selectedMemory.feeling_after && selectedMemory.feeling_after.length > 0 && (
                        <div>
                          <span className="text-xs text-muted-foreground block mb-1">{t('vault.feelingAfter')}:</span>
                          <div className="flex flex-wrap gap-1">
                            {selectedMemory.feeling_after.map(feeling => (
                              <Badge key={feeling} variant="secondary" className="text-xs">
                                {t(`vault.nvcFeelings.${feeling}`) || feeling}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {selectedMemory.needs_after && selectedMemory.needs_after.length > 0 && (
                        <div>
                          <span className="text-xs text-muted-foreground block mb-1">{t('vault.needsAfter')}:</span>
                          <div className="flex flex-wrap gap-1">
                            {selectedMemory.needs_after.map(need => (
                              <Badge key={need} variant="outline" className="text-xs">
                                {t(`vault.nvcNeeds.${need}`) || need}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <ScrollArea className="h-[300px]">
                      <div className="prose prose-sm dark:prose-invert">
                        <p className="whitespace-pre-wrap text-sm text-foreground">
                          {selectedMemory.content}
                        </p>
                        
                        {selectedMemory.additional_thoughts && (
                          <>
                            <hr className="my-4 border-border" />
                            <h4 className="text-sm font-medium mb-2">{t('vault.additionalThoughts')}</h4>
                            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                              {selectedMemory.additional_thoughts}
                            </p>
                          </>
                        )}
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
          </>
        )}
      </main>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('vault.editTitle')}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Title */}
            <div>
              <label className="text-sm font-medium mb-1 block">{t('vault.saveTitle')}</label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder={t('vault.saveTitlePlaceholder')}
              />
            </div>
            
            {/* Summary */}
            <div>
              <label className="text-sm font-medium mb-1 block">{t('vault.saveSummary')}</label>
              <Textarea
                value={editSummary}
                onChange={(e) => setEditSummary(e.target.value)}
                rows={2}
              />
            </div>
            
            {/* Additional Thoughts */}
            <div>
              <label className="text-sm font-medium mb-1 block">{t('vault.additionalThoughts')}</label>
              <Textarea
                value={editAdditionalThoughts}
                onChange={(e) => setEditAdditionalThoughts(e.target.value)}
                placeholder={t('vault.additionalThoughtsPlaceholder')}
                rows={4}
              />
            </div>
            
            {/* Image Section */}
            <div>
              <label className="text-sm font-medium mb-2 block">{t('vault.image')}</label>
              
              {editImageUrl && (
                <div className="relative mb-2">
                  <img src={editImageUrl} alt="" className="w-full h-32 object-cover rounded-lg" />
                  <button
                    onClick={() => setEditImageUrl('')}
                    className="absolute top-2 right-2 p-1 bg-background/80 rounded-full hover:bg-background"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  {t('vault.uploadImage')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateAIImage}
                  disabled={isGeneratingImage}
                >
                  {isGeneratingImage ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  {isGeneratingImage ? t('vault.generatingImage') : t('vault.generateImage')}
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            
            {/* Feelings After */}
            <div>
              <label className="text-sm font-medium mb-2 block">{t('vault.feelingAfter')}</label>
              <div className="flex flex-wrap gap-2">
                {nvcFeelings.map(feeling => (
                  <Badge
                    key={feeling}
                    variant={editFeelingsAfter.includes(feeling) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleFeeling(feeling)}
                  >
                    {t(`vault.nvcFeelings.${feeling}`) || feeling}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Needs After */}
            <div>
              <label className="text-sm font-medium mb-2 block">{t('vault.needsAfter')}</label>
              <div className="flex flex-wrap gap-2">
                {nvcNeeds.map(need => (
                  <Badge
                    key={need}
                    variant={editNeedsAfter.includes(need) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleNeed(need)}
                  >
                    {t(`vault.nvcNeeds.${need}`) || need}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              {t('vault.cancel')}
            </Button>
            <Button onClick={updateMemory} disabled={isUpdating || !editTitle.trim()}>
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('vault.saving')}
                </>
              ) : (
                t('vault.save')
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Memory Book */}
      {selectedMemory && (
        <MemoryBook 
          memory={selectedMemory} 
          open={bookOpen} 
          onClose={() => setBookOpen(false)}
          onBookSaved={loadMemories}
        />
      )}
    </div>
  );
};

export default MemoryVault;

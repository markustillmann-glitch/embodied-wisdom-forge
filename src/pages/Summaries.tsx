import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, Calendar, MapPin, Clock, Heart, Brain, Sparkles, Target, Activity, Lock, Trash2, Eye, EyeOff, Settings, KeyRound, Camera, Download, X, Image as ImageIcon, Wand2, MessageSquare, FileText, Users, ClipboardList, Pencil, Check, Thermometer } from 'lucide-react';
import AppHeader from '@/components/AppHeader';
import { IfsPartsSection } from '@/components/parts/IfsPartsSection';
import { TriggerTestHistory } from '@/components/trigger/TriggerTestHistory';
import { MemoriesSection } from '@/components/memories/MemoriesSection';
import SelfBarometer from '@/components/SelfBarometer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import { usePdfGenerator } from '@/hooks/usePdfGenerator';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface StructuredSummary {
  patterns: string[];
  needs: string[];
  parts: Array<{ name: string; type: string; description: string }>;
  body_areas: Array<{ area: string; significance: string }>;
  insights: string[];
  recommendations: {
    body_exercise: string;
    micro_action: string;
    reflection_question: string;
  };
  summary_text: string;
}

interface SummaryMemory {
  id: string;
  title: string;
  summary: string | null;
  structured_summary: StructuredSummary | null;
  location: string | null;
  created_at: string;
  memory_date: string | null;
  memory_type: string;
  image_url: string | null;
  content: string;
}

const partTypeLabels: Record<string, { label: { de: string; en: string }; color: string }> = {
  manager: { label: { de: 'Manager', en: 'Manager' }, color: 'bg-blue-500/20 text-blue-700' },
  firefighter: { label: { de: 'Feuerwehr', en: 'Firefighter' }, color: 'bg-orange-500/20 text-orange-700' },
  exile: { label: { de: 'Exilant', en: 'Exile' }, color: 'bg-purple-500/20 text-purple-700' },
  self: { label: { de: 'Selbst', en: 'Self' }, color: 'bg-green-500/20 text-green-700' },
};

// Simple hash function for password (client-side, for UX purposes)
const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const Summaries = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { generatePdf, generateConversationPdf } = usePdfGenerator();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [summaries, setSummaries] = useState<SummaryMemory[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Password protection state
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [checkingPassword, setCheckingPassword] = useState(true);
  
  // Password setup dialog
  const [showSetPasswordDialog, setShowSetPasswordDialog] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // Delete confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Image upload state
  const [uploadingSummaryId, setUploadingSummaryId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // PDF export state
  const [exportingSummaryId, setExportingSummaryId] = useState<string | null>(null);
  
  // AI image generation state
  const [generatingImageId, setGeneratingImageId] = useState<string | null>(null);

  // Inline editing state
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editingTitleValue, setEditingTitleValue] = useState('');
  const [editingSummaryId, setEditingSummaryId] = useState<string | null>(null);
  const [editingSummaryValue, setEditingSummaryValue] = useState('');
  const [editingConversationId, setEditingConversationId] = useState<string | null>(null);
  const [editingConversationValue, setEditingConversationValue] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  // Barometer state
  const [showBarometer, setShowBarometer] = useState(false);
  const [barometerContext, setBarometerContext] = useState('');

  // View mode state: 'summary' or 'conversation'
  const [viewModes, setViewModes] = useState<Record<string, 'summary' | 'conversation'>>({});
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'reflections' | 'parts' | 'tests' | 'memories'>(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'parts') return 'parts';
    if (tabParam === 'tests') return 'tests';
    if (tabParam === 'memories') return 'memories';
    return 'reflections';
  });

  // Sync active tab when URL params change (e.g. navigating from another page)
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'parts') setActiveTab('parts');
    else if (tabParam === 'tests') setActiveTab('tests');
    else if (tabParam === 'memories') setActiveTab('memories');
  }, [searchParams]);

  const getViewMode = (id: string) => viewModes[id] || 'summary';
  const toggleViewMode = (id: string) => {
    setViewModes(prev => ({
      ...prev,
      [id]: prev[id] === 'conversation' ? 'summary' : 'conversation'
    }));
  };

  const dateLocale = language === 'de' ? de : enUS;

  // Check if user has a vault password set
  useEffect(() => {
    if (user) {
      checkVaultPassword();
    }
  }, [user]);

  const checkVaultPassword = async () => {
    if (!user) return;
    setCheckingPassword(true);
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('vault_password_hash')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data?.vault_password_hash) {
        setHasPassword(true);
        setIsUnlocked(false);
      } else {
        setHasPassword(false);
        setIsUnlocked(true); // No password set, auto-unlock
        loadSummaries();
      }
    } catch (error) {
      console.error('Error checking vault password:', error);
      // If no profile exists, no password is set
      setHasPassword(false);
      setIsUnlocked(true);
      loadSummaries();
    } finally {
      setCheckingPassword(false);
    }
  };

  const unlockVault = async () => {
    if (!user || !passwordInput) return;

    try {
      const inputHash = await hashPassword(passwordInput);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('vault_password_hash')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (data.vault_password_hash === inputHash) {
        setIsUnlocked(true);
        setPasswordInput('');
        loadSummaries();
        toast.success(t('vault.unlocked'));
      } else {
        toast.error(t('vault.wrongPassword'));
        setPasswordInput('');
      }
    } catch (error) {
      console.error('Error unlocking vault:', error);
      toast.error(t('vault.errorUnlocking'));
    }
  };

  const setVaultPassword = async () => {
    if (!user) return;
    
    if (newPassword.length < 4) {
      toast.error(t('vault.passwordMinError'));
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error(t('vault.passwordMismatch'));
      return;
    }

    try {
      const passwordHash = await hashPassword(newPassword);
      
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('user_profiles')
          .update({ vault_password_hash: passwordHash })
          .eq('user_id', user.id);
        
        if (error) throw error;
      } else {
        // Create new profile
        const { error } = await supabase
          .from('user_profiles')
          .insert({ 
            user_id: user.id, 
            vault_password_hash: passwordHash 
          });
        
        if (error) throw error;
      }

      setHasPassword(true);
      setShowSetPasswordDialog(false);
      setNewPassword('');
      setConfirmPassword('');
      toast.success(t('vault.passwordSet'));
    } catch (error) {
      console.error('Error setting vault password:', error);
      toast.error(t('vault.errorSettingPassword'));
    }
  };

  const removeVaultPassword = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ vault_password_hash: null })
        .eq('user_id', user.id);

      if (error) throw error;

      setHasPassword(false);
      setShowSetPasswordDialog(false);
      toast.success(t('vault.passwordRemoved'));
    } catch (error) {
      console.error('Error removing vault password:', error);
      toast.error(t('vault.errorRemovingPassword'));
    }
  };

  const loadSummaries = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('memories')
        .select('id, title, summary, structured_summary, location, created_at, memory_date, memory_type, image_url, content')
        .eq('user_id', user.id)
        .in('memory_type', ['selfcare-reflection', 'impulse-reflection', 'situation-reflection'])
        .eq('summary_requested', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedData = (data || []).map(item => ({
        ...item,
        structured_summary: item.structured_summary as unknown as StructuredSummary | null,
        image_url: item.image_url || null,
        content: item.content || ''
      }));
      
      setSummaries(typedData);
    } catch (error) {
      console.error('Error loading summaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Handle image upload
  const handleImageUpload = async (summaryId: string, file: File) => {
    if (!user) return;
    
    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error(t('vault.imageTypeError'));
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('vault.imageSizeError'));
      return;
    }

    setUploadingImage(true);
    setUploadingSummaryId(summaryId);

    try {
      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${summaryId}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('reflection-images')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Create signed URL for private bucket (valid for 1 year)
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('reflection-images')
        .createSignedUrl(fileName, 60 * 60 * 24 * 365); // 1 year

      if (signedUrlError || !signedUrlData?.signedUrl) {
        throw new Error('Failed to create signed URL');
      }

      const imageUrl = signedUrlData.signedUrl;

      // Update memory record
      const { error: updateError } = await supabase
        .from('memories')
        .update({ image_url: imageUrl })
        .eq('id', summaryId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Update local state
      setSummaries(prev => prev.map(s => 
        s.id === summaryId ? { ...s, image_url: imageUrl } : s
      ));

      toast.success(t('vault.imageAdded'));
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(t('vault.errorUpload'));
    } finally {
      setUploadingImage(false);
      setUploadingSummaryId(null);
    }
  };

  // Remove image from summary
  const removeImage = async (summaryId: string, imageUrl: string) => {
    if (!user) return;

    try {
      // Extract file path from URL
      const urlParts = imageUrl.split('/reflection-images/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        await supabase.storage.from('reflection-images').remove([filePath]);
      }

      // Update memory record
      const { error } = await supabase
        .from('memories')
        .update({ image_url: null })
        .eq('id', summaryId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setSummaries(prev => prev.map(s => 
        s.id === summaryId ? { ...s, image_url: null } : s
      ));

      toast.success(t('vault.imageRemoved'));
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error(t('vault.errorRemovingImage'));
    }
  };

  // Generate AI image for summary
  const generateAiImage = async (summary: SummaryMemory) => {
    if (!user) return;
    
    setGeneratingImageId(summary.id);

    try {
      const response = await supabase.functions.invoke('generate-reflection-image', {
        body: {
          summaryId: summary.id,
          title: summary.title,
          summaryText: summary.structured_summary?.summary_text || '',
          mood: summary.structured_summary?.needs?.[0] || null,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || t('vault.errorImageGen'));
      }

      const { imageUrl } = response.data;

      if (imageUrl) {
        // Update local state
        setSummaries(prev => prev.map(s => 
          s.id === summary.id ? { ...s, image_url: imageUrl } : s
        ));
        toast.success(t('vault.aiImageCreated'));
      }
    } catch (error: any) {
      console.error('Error generating AI image:', error);
      toast.error(error.message || t('vault.errorImageGen'));
    } finally {
      setGeneratingImageId(null);
    }
  };

  // Export to PDF
  const exportToPdf = async (summary: SummaryMemory) => {
    setExportingSummaryId(summary.id);

    try {
      let coverImageData: string | null = null;

      // If summary has an image, load it as base64
      if (summary.image_url) {
        try {
          const response = await fetch(summary.image_url);
          const blob = await response.blob();
          coverImageData = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
        } catch (error) {
          console.error('Error loading cover image:', error);
        }
      }

      await generatePdf({
        title: summary.title,
        created_at: summary.created_at,
        location: summary.location,
        memory_type: summary.memory_type,
        structured_summary: summary.structured_summary,
        image_url: summary.image_url,
        content: summary.content,
      }, coverImageData);

      toast.success(t('vault.pdfCreated'));
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error(t('vault.errorPdfExport'));
    } finally {
      setExportingSummaryId(null);
    }
  };

  // Export full conversation to PDF (A4 format)
  const exportConversationToPdf = async (summary: SummaryMemory) => {
    setExportingSummaryId(summary.id);

    try {
      await generateConversationPdf({
        title: summary.title,
        created_at: summary.created_at,
        location: summary.location,
        memory_type: summary.memory_type,
        structured_summary: summary.structured_summary,
        image_url: summary.image_url,
        content: summary.content,
      });

      toast.success(t('vault.conversationPdfCreated'));
    } catch (error) {
      console.error('Error generating conversation PDF:', error);
      toast.error(t('vault.errorPdfExport'));
    } finally {
      setExportingSummaryId(null);
    }
  };

  const startBarometer = (ctx: string) => {
    setBarometerContext(ctx);
    setShowBarometer(true);
  };

  const deleteSummary = async (id: string) => {
    if (!user) return;
    setDeleting(true);

    try {
      const { error } = await supabase
        .from('memories')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setSummaries(prev => prev.filter(s => s.id !== id));
      setDeleteConfirmId(null);
      toast.success(t('vault.deleted'));
    } catch (error) {
      console.error('Error deleting summary:', error);
      toast.error(t('vault.errorDeleting'));
    } finally {
      setDeleting(false);
    }
  };

  // Save edited title
  const saveTitle = async (id: string) => {
    if (!user || !editingTitleValue.trim()) return;
    setSavingEdit(true);
    try {
      const { error } = await supabase
        .from('memories')
        .update({ title: editingTitleValue.trim() })
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) throw error;
      setSummaries(prev => prev.map(s => s.id === id ? { ...s, title: editingTitleValue.trim() } : s));
      setEditingTitleId(null);
      toast.success(language === 'de' ? 'Titel gespeichert' : 'Title saved');
    } catch (error) {
      console.error('Error saving title:', error);
      toast.error(language === 'de' ? 'Fehler beim Speichern' : 'Error saving');
    } finally {
      setSavingEdit(false);
    }
  };

  // Save edited summary text
  const saveSummaryText = async (id: string) => {
    if (!user || !editingSummaryValue.trim()) return;
    setSavingEdit(true);
    try {
      const summary = summaries.find(s => s.id === id);
      if (!summary?.structured_summary) return;
      const updatedSummary = { ...summary.structured_summary, summary_text: editingSummaryValue.trim() };
      const { error } = await supabase
        .from('memories')
        .update({ structured_summary: updatedSummary as any })
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) throw error;
      setSummaries(prev => prev.map(s => s.id === id ? { ...s, structured_summary: updatedSummary } : s));
      setEditingSummaryId(null);
      toast.success(language === 'de' ? 'Zusammenfassung gespeichert' : 'Summary saved');
    } catch (error) {
      console.error('Error saving summary:', error);
      toast.error(language === 'de' ? 'Fehler beim Speichern' : 'Error saving');
    } finally {
      setSavingEdit(false);
    }
  };

  // Save edited conversation content
  const saveConversation = async (id: string) => {
    if (!user || !editingConversationValue.trim()) return;
    setSavingEdit(true);
    try {
      const { error } = await supabase
        .from('memories')
        .update({ content: editingConversationValue.trim() })
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) throw error;
      setSummaries(prev => prev.map(s => s.id === id ? { ...s, content: editingConversationValue.trim() } : s));
      setEditingConversationId(null);
      toast.success(language === 'de' ? 'Gespräch gespeichert' : 'Conversation saved');
    } catch (error) {
      console.error('Error saving conversation:', error);
      toast.error(language === 'de' ? 'Fehler beim Speichern' : 'Error saving');
    } finally {
      setSavingEdit(false);
    }
  };

  if (authLoading || checkingPassword) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 pt-[max(env(safe-area-inset-top),20px)] pb-[max(env(safe-area-inset-bottom),24px)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 pt-[max(env(safe-area-inset-top),20px)] pb-[max(env(safe-area-inset-bottom),24px)]">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">{t('vault.pleaseSignIn')}</p>
          <Button onClick={() => navigate('/auth')}>{t('vault.signIn')}</Button>
        </div>
      </div>
    );
  }




  if (hasPassword && !isUnlocked) {
    return (
      <div className="min-h-screen ios-page ios-font relative overflow-hidden">
        {/* Warm Gradient Background */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(180deg, hsl(150 30% 85%) 0%, hsl(35 60% 75%) 50%, hsl(25 50% 80%) 100%)'
          }}
        />
        
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm"
          >
            <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-xl font-semibold text-foreground">{t('vault.unlock')}</h1>
                <p className="text-sm text-muted-foreground mt-1 text-center">{t('vault.enterPassword')}</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('vault.password')}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && unlockVault()}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <Button onClick={unlockVault} className="w-full" disabled={!passwordInput}>
                  <Lock className="w-4 h-4 mr-2" />
                  {t('vault.unlockBtn')}
                </Button>

                <Button variant="ghost" onClick={() => navigate('/selfcare')} className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('nav.back')}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ios-page ios-font relative overflow-hidden">
      {/* Warm Gradient Background - consistent with SelfcareReflection */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(180deg, hsl(150 30% 85%) 0%, hsl(35 60% 75%) 50%, hsl(25 50% 80%) 100%)'
        }}
      />
      
      {/* Header */}
      <AppHeader />

      {/* Hero Section */}
      <section className="pb-6 sm:pb-10 relative z-10">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-6">

          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex items-center gap-2 sm:gap-4"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <h1 className="ios-title-1 sm:ios-large-title text-foreground">
                {t('vault.title')}
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="ios-subhead text-muted-foreground max-w-xl mt-3"
            >
              {summaries.length} {summaries.length === 1 ? t('vault.reflectionSingular') : t('vault.reflectionPlural')} {t('vault.reflectionsStored')}
              {hasPassword && <span className="ml-2">🔒</span>}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="relative z-10 max-w-3xl mx-auto px-2 sm:px-6 mb-4 sm:mb-6">
        <div className="flex gap-1 sm:gap-1.5 bg-white/30 backdrop-blur-sm rounded-xl p-1 sm:p-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('reflections')}
            className={`flex-1 min-w-0 flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 px-1.5 sm:px-3 py-2 sm:py-2.5 rounded-lg text-[10px] sm:text-sm font-medium transition-all ${
              activeTab === 'reflections'
                ? 'bg-white/80 text-foreground shadow-sm'
                : 'text-foreground/60 hover:text-foreground/80'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span className="truncate">{t('vault.tabs.reflections')}</span>
          </button>
          <button
            onClick={() => setActiveTab('parts')}
            className={`flex-1 min-w-0 flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 px-1.5 sm:px-3 py-2 sm:py-2.5 rounded-lg text-[10px] sm:text-sm font-medium transition-all ${
              activeTab === 'parts'
                ? 'bg-white/80 text-foreground shadow-sm'
                : 'text-foreground/60 hover:text-foreground/80'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span className="truncate">{t('vault.tabs.parts')}</span>
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`flex-1 min-w-0 flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 px-1.5 sm:px-3 py-2 sm:py-2.5 rounded-lg text-[10px] sm:text-sm font-medium transition-all ${
              activeTab === 'tests'
                ? 'bg-white/80 text-foreground shadow-sm'
                : 'text-foreground/60 hover:text-foreground/80'
            }`}
          >
            <ClipboardList className="w-4 h-4 shrink-0" />
            <span className="truncate">{t('vault.tabs.selftest')}</span>
          </button>
          <button
            onClick={() => setActiveTab('memories')}
            className={`flex-1 min-w-0 flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 px-1.5 sm:px-3 py-2 sm:py-2.5 rounded-lg text-[10px] sm:text-sm font-medium transition-all ${
              activeTab === 'memories'
                ? 'bg-white/80 text-foreground shadow-sm'
                : 'text-foreground/60 hover:text-foreground/80'
            }`}
          >
            <Heart className="w-4 h-4 shrink-0" />
            <span className="truncate">{language === 'de' ? 'Erinnerungen' : 'Memories'}</span>
          </button>
        </div>
      </section>

      {/* Content based on active tab */}
      <section className="relative z-10 max-w-3xl mx-auto px-2 sm:px-6 pb-[max(calc(env(safe-area-inset-bottom)+24px),48px)]">
        {activeTab === 'memories' ? (
          <MemoriesSection onStartBarometer={startBarometer} />
        ) : activeTab === 'parts' ? (
          <IfsPartsSection onStartBarometer={startBarometer} />
        ) : activeTab === 'tests' ? (
          <TriggerTestHistory />
        ) : loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : summaries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Sparkles className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">
              {t('vault.emptyVault')}
            </p>
            <p className="text-sm text-muted-foreground/70 mt-2">
              {t('vault.emptyVaultHint')}
            </p>
            <Button 
              className="mt-6"
              onClick={() => navigate('/selfcare')}
            >
              {t('vault.startReflection')}
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {summaries.map((summary, index) => (
              <motion.div
                key={summary.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-xl overflow-hidden group"
              >
                {/* Preview Header */}
                <div className="relative">
                    <button
                      onClick={() => toggleExpand(summary.id)}
                      className="w-full p-3 sm:p-5 text-left hover:bg-muted/30 active:bg-muted/40 transition-colors"
                    >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {editingTitleId === summary.id ? (
                          <div className="flex items-center gap-2 pr-8" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              value={editingTitleValue}
                              onChange={(e) => setEditingTitleValue(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') saveTitle(summary.id); if (e.key === 'Escape') setEditingTitleId(null); }}
                              className="flex-1 font-medium text-foreground bg-transparent border-b-2 border-primary outline-none"
                              autoFocus
                            />
                            <button
                              onClick={() => saveTitle(summary.id)}
                              disabled={savingEdit}
                              className="shrink-0 w-7 h-7 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center"
                            >
                              <Check className="w-4 h-4 text-primary" />
                            </button>
                            <button
                              onClick={() => setEditingTitleId(null)}
                              className="shrink-0 w-7 h-7 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center"
                            >
                              <X className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 pr-8 group/title">
                            <h3 className="font-medium text-foreground truncate">
                              {summary.title}
                            </h3>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingTitleId(summary.id);
                                setEditingTitleValue(summary.title);
                              }}
                              className="shrink-0 w-6 h-6 rounded-full hover:bg-muted flex items-center justify-center sm:opacity-0 sm:group-hover/title:opacity-100 transition-opacity"
                            >
                              <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                            </button>
                          </div>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {/* Reflection Type Badge */}
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            summary.memory_type === 'impulse-reflection' 
                              ? 'bg-amber-500/20 text-amber-700' 
                              : summary.memory_type === 'situation-reflection'
                                ? 'bg-blue-500/20 text-blue-700'
                                : 'bg-purple-500/20 text-purple-700'
                          }`}>
                            {summary.memory_type === 'impulse-reflection' ? (
                              <><Sparkles className="w-3 h-3" /> {t('vault.impulse')}</>
                            ) : summary.memory_type === 'situation-reflection' ? (
                              <><Brain className="w-3 h-3" /> {t('vault.situation')}</>
                            ) : (
                              <><Heart className="w-3 h-3" /> {t('vault.reflection')}</>
                            )}
                          </span>
                          
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(summary.created_at), 'dd. MMMM yyyy', { locale: dateLocale })}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {format(new Date(summary.created_at), 'HH:mm', { locale: dateLocale })} {t('vault.oclock')}
                          </span>
                          {summary.location && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              {summary.location}
                            </span>
                          )}
                        </div>

                        {/* Preview Text */}
                        {summary.structured_summary?.summary_text && expandedId !== summary.id && (
                          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                            {summary.structured_summary.summary_text}
                          </p>
                        )}
                      </div>
                      
                      <div className="shrink-0">
                        {expandedId === summary.id ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Delete button */}
                   <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirmId(summary.id);
                    }}
                    className="absolute top-4 right-12 w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                    title={t('common.delete')}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {expandedId === summary.id && summary.structured_summary && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 sm:px-5 pb-4 sm:pb-5 space-y-4 sm:space-y-5 border-t border-border pt-4 sm:pt-5">
                        {/* View Mode Toggle */}
                        <div className="flex gap-2 p-1 bg-muted/50 rounded-lg">
                          <button
                            onClick={() => setViewModes(prev => ({ ...prev, [summary.id]: 'summary' }))}
                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                              getViewMode(summary.id) === 'summary' 
                                ? 'bg-background text-foreground shadow-sm' 
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <FileText className="w-4 h-4" />
                            {t('vault.summary')}
                          </button>
                          <button
                            onClick={() => setViewModes(prev => ({ ...prev, [summary.id]: 'conversation' }))}
                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                              getViewMode(summary.id) === 'conversation' 
                                ? 'bg-background text-foreground shadow-sm' 
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <MessageSquare className="w-4 h-4" />
                            {t('vault.originalConversation')}
                          </button>
                        </div>

                        {/* Cover Image Section */}
                        <div className="space-y-3">
                          {summary.image_url ? (
                            <div className="relative group/image">
                              <img 
                                src={summary.image_url} 
                                alt={t('vault.reflectionImage')}
                                className="w-full max-h-64 object-contain rounded-lg bg-muted/20"
                              />
                              <button
                                onClick={() => removeImage(summary.id, summary.image_url!)}
                                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity"
                                title={t('vault.removeImage')}
                              >
                                <X className="w-4 h-4 text-white" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              {/* Upload image button */}
                              <button
                                onClick={() => {
                                  setUploadingSummaryId(summary.id);
                                  fileInputRef.current?.click();
                                }}
                                disabled={uploadingImage || generatingImageId === summary.id}
                                className="flex-1 h-24 border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-muted/30 transition-colors"
                              >
                                {uploadingImage && uploadingSummaryId === summary.id ? (
                                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                                ) : (
                                  <>
                                    <Camera className="w-5 h-5 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">{t('vault.uploadImage')}</span>
                                  </>
                                )}
                              </button>
                              
                              {/* Generate AI image button */}
                              <button
                                onClick={() => generateAiImage(summary)}
                                disabled={uploadingImage || generatingImageId === summary.id}
                                className="flex-1 h-24 border-2 border-dashed border-primary/30 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-colors"
                              >
                                {generatingImageId === summary.id ? (
                                  <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                                    <span className="text-xs text-primary">{t('vault.generating')}</span>
                                  </>
                                ) : (
                                  <>
                                    <Wand2 className="w-5 h-5 text-primary" />
                                    <span className="text-xs text-primary font-medium">{t('vault.createAiImage')}</span>
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Content based on view mode */}
                        {getViewMode(summary.id) === 'conversation' ? (
                          /* Original Conversation View */
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
                                <MessageSquare className="w-4 h-4 text-primary" />
                                {t('vault.originalConversation')}
                              </h4>
                              {editingConversationId === summary.id ? (
                                <div className="flex gap-2">
                                  <button onClick={() => setEditingConversationId(null)} className="px-3 py-1 text-xs rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground">
                                    {language === 'de' ? 'Abbrechen' : 'Cancel'}
                                  </button>
                                  <button onClick={() => saveConversation(summary.id)} disabled={savingEdit} className="px-3 py-1 text-xs rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium">
                                    {language === 'de' ? 'Speichern' : 'Save'}
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setEditingConversationId(summary.id);
                                    setEditingConversationValue(summary.content);
                                  }}
                                  className="w-7 h-7 rounded-full hover:bg-muted flex items-center justify-center"
                                >
                                  <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                                </button>
                              )}
                            </div>
                            {editingConversationId === summary.id ? (
                              <textarea
                                value={editingConversationValue}
                                onChange={(e) => setEditingConversationValue(e.target.value)}
                                className="w-full text-sm text-foreground bg-transparent border border-primary/30 rounded-lg p-3 outline-none focus:border-primary resize-none min-h-[300px] font-mono"
                                autoFocus
                              />
                            ) : (
                            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                              {summary.content.split(/\n\n+/).map((block, index) => {
                                const trimmedBlock = block.trim();
                                if (!trimmedBlock) return null;
                                
                                const isOria = trimmedBlock.startsWith('Oria:');
                                const isUser = trimmedBlock.startsWith('Du:');
                                
                                if (isOria) {
                                  const message = trimmedBlock.replace(/^Oria:\s*/, '');
                                  return (
                                    <div key={index} className="flex gap-3">
                                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <Sparkles className="w-4 h-4 text-primary" />
                                      </div>
                                      <div className="flex-1 bg-muted/30 rounded-2xl rounded-tl-sm px-4 py-3">
                                        <p className="text-sm text-foreground whitespace-pre-wrap">{message}</p>
                                      </div>
                                    </div>
                                  );
                                } else if (isUser) {
                                  const message = trimmedBlock.replace(/^Du:\s*/, '');
                                  return (
                                    <div key={index} className="flex gap-3 justify-end">
                                      <div className="flex-1 max-w-[85%] bg-primary/10 rounded-2xl rounded-tr-sm px-4 py-3">
                                        <p className="text-sm text-foreground whitespace-pre-wrap">{message}</p>
                                      </div>
                                    </div>
                                  );
                                } else {
                                  return (
                                    <div key={index} className="text-sm text-muted-foreground text-center py-2">
                                      {trimmedBlock}
                                    </div>
                                  );
                                }
                              })}
                            </div>
                            )}
                          </div>
                        ) : (
                          /* Summary View */
                          <>
                            {/* Summary Text */}
                            <div className="group/summary">
                              {editingSummaryId === summary.id ? (
                                <div className="space-y-2">
                                  <textarea
                                    value={editingSummaryValue}
                                    onChange={(e) => setEditingSummaryValue(e.target.value)}
                                    className="w-full text-foreground leading-relaxed bg-transparent border border-primary/30 rounded-lg p-3 outline-none focus:border-primary resize-none min-h-[120px]"
                                    autoFocus
                                  />
                                  <div className="flex gap-2 justify-end">
                                    <button onClick={() => setEditingSummaryId(null)} className="px-3 py-1.5 text-sm rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground">
                                      {language === 'de' ? 'Abbrechen' : 'Cancel'}
                                    </button>
                                    <button onClick={() => saveSummaryText(summary.id)} disabled={savingEdit} className="px-3 py-1.5 text-sm rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium">
                                      {language === 'de' ? 'Speichern' : 'Save'}
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="relative">
                                  <p className="text-foreground leading-relaxed pr-8">
                                    {summary.structured_summary.summary_text}
                                  </p>
                                 <button
                              onClick={() => {
                                setEditingSummaryId(summary.id);
                                setEditingSummaryValue(summary.structured_summary?.summary_text || '');
                              }}
                                    className="absolute top-0 right-0 w-7 h-7 rounded-full hover:bg-muted flex items-center justify-center sm:opacity-0 sm:group-hover/summary:opacity-100 transition-opacity"
                                  >
                                    <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Patterns */}
                            {summary.structured_summary.patterns?.length > 0 && (
                              <div>
                                <h4 className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                                  <Target className="w-4 h-4 text-primary" />
                                  {t('vault.recognizedPatterns')}
                                </h4>
                                <ul className="space-y-1">
                                  {summary.structured_summary.patterns.map((pattern, i) => (
                                    <li key={i} className="text-sm text-muted-foreground pl-6 relative before:content-['•'] before:absolute before:left-2 before:text-primary">
                                      {pattern}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Needs */}
                            {summary.structured_summary.needs?.length > 0 && (
                              <div>
                                <h4 className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                                  <Heart className="w-4 h-4 text-pink-500" />
                                  {t('vault.touchedNeeds')}
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {summary.structured_summary.needs.map((need, i) => (
                                    <span 
                                      key={i} 
                                      className="px-2.5 py-1 bg-pink-500/10 text-pink-700 text-xs rounded-full"
                                    >
                                      {need}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Parts */}
                            {summary.structured_summary.parts?.length > 0 && (
                              <div>
                                <h4 className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                                  <Brain className="w-4 h-4 text-violet-500" />
                                  {t('vault.involvedParts')}
                                </h4>
                                <div className="space-y-2">
                                  {summary.structured_summary.parts.map((part, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                      <span className={`px-2 py-0.5 text-xs rounded-full shrink-0 ${partTypeLabels[part.type]?.color || 'bg-gray-500/20 text-gray-700'}`}>
                                        {partTypeLabels[part.type]?.label[language] || part.type}
                                      </span>
                                      <div className="text-sm">
                                        <span className="font-medium text-foreground">{part.name}:</span>{' '}
                                        <span className="text-muted-foreground">{part.description}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Body Areas */}
                            {summary.structured_summary.body_areas?.length > 0 && (
                              <div>
                                <h4 className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                                  <Activity className="w-4 h-4 text-emerald-500" />
                                  {t('vault.bodyAreas')}
                                </h4>
                                <div className="space-y-2">
                                  {summary.structured_summary.body_areas.map((area, i) => (
                                    <div key={i} className="text-sm">
                                      <span className="font-medium text-foreground">{area.area}:</span>{' '}
                                      <span className="text-muted-foreground">{area.significance}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Insights */}
                            {summary.structured_summary.insights?.length > 0 && (
                              <div>
                                <h4 className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                                  <Sparkles className="w-4 h-4 text-amber-500" />
                                  {t('vault.centralInsights')}
                                </h4>
                                <ul className="space-y-1">
                                  {summary.structured_summary.insights.map((insight, i) => (
                                    <li key={i} className="text-sm text-muted-foreground pl-6 relative before:content-['💡'] before:absolute before:left-0">
                                      {insight}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Recommendations */}
                            {summary.structured_summary.recommendations && (
                              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                                <h4 className="text-sm font-medium text-foreground">{t('vault.recommendations')}</h4>
                                
                                {summary.structured_summary.recommendations.body_exercise && (
                                  <div className="text-sm">
                                    <span className="text-primary font-medium">{t('vault.bodyExercise')}</span>{' '}
                                    <span className="text-muted-foreground">{summary.structured_summary.recommendations.body_exercise}</span>
                                  </div>
                                )}
                                
                                {summary.structured_summary.recommendations.micro_action && (
                                  <div className="text-sm">
                                    <span className="text-primary font-medium">{t('vault.microAction')}</span>{' '}
                                    <span className="text-muted-foreground">{summary.structured_summary.recommendations.micro_action}</span>
                                  </div>
                                )}
                                
                                {summary.structured_summary.recommendations.reflection_question && (
                                  <div className="text-sm">
                                    <span className="text-primary font-medium">{t('vault.forReflection')}</span>{' '}
                                    <span className="text-muted-foreground italic">"{summary.structured_summary.recommendations.reflection_question}"</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        )}

                        {/* Action buttons in expanded view */}
                        <div className="pt-3 border-t border-border">
                          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => exportToPdf(summary)}
                              disabled={exportingSummaryId === summary.id}
                              className="text-primary hover:text-primary text-xs sm:text-sm"
                            >
                              {exportingSummaryId === summary.id ? (
                                <>
                                  <div className="w-4 h-4 mr-1.5 animate-spin rounded-full border-b-2 border-primary"></div>
                                  <span className="truncate">{t('vault.creatingPdf')}</span>
                                </>
                              ) : (
                                <>
                                  <FileText className="w-4 h-4 mr-1.5 shrink-0" />
                                  <span className="truncate">{t('vault.summaryPdf')}</span>
                                </>
                              )}
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => exportConversationToPdf(summary)}
                              disabled={exportingSummaryId === summary.id}
                              className="text-muted-foreground hover:text-foreground text-xs sm:text-sm"
                            >
                              <MessageSquare className="w-4 h-4 mr-1.5 shrink-0" />
                              <span className="truncate">{t('vault.conversationPdf')}</span>
                            </Button>
                            
                            {!summary.image_url && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setUploadingSummaryId(summary.id);
                                  fileInputRef.current?.click();
                                }}
                                disabled={uploadingImage}
                                className="text-muted-foreground text-xs sm:text-sm"
                              >
                                <ImageIcon className="w-4 h-4 mr-1.5 shrink-0" />
                                <span className="truncate">{t('vault.addImage')}</span>
                              </Button>
                            )}
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setActiveTab('memories');
                              }}
                              className="text-muted-foreground text-xs sm:text-sm"
                            >
                              <Heart className="w-4 h-4 mr-1.5 shrink-0" />
                              <span className="truncate">{language === 'de' ? 'Erinnerung' : 'Memory'}</span>
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => startBarometer(summary.title)}
                              className="text-muted-foreground text-xs sm:text-sm"
                            >
                              <Thermometer className="w-4 h-4 mr-1.5 shrink-0" />
                              <span className="truncate">Barometer</span>
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteConfirmId(summary.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs sm:text-sm"
                            >
                              <Trash2 className="w-4 h-4 mr-1.5 shrink-0" />
                              <span className="truncate">{t('vault.delete')}</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Password Settings Dialog */}
      <Dialog open={showSetPasswordDialog} onOpenChange={setShowSetPasswordDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-primary" />
              {t('vault.vaultPassword')}
            </DialogTitle>
            <DialogDescription>
              {hasPassword 
                ? t('vault.changeOrRemovePassword') 
                : t('vault.protectVault')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-foreground">{t('vault.newPassword')}</label>
              <div className="relative mt-1">
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder={t('vault.minChars')}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">{t('vault.confirmPassword')}</label>
              <Input
                type="password"
                placeholder={t('vault.repeatPassword')}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {hasPassword && (
              <Button variant="ghost" onClick={removeVaultPassword} className="text-red-600 hover:text-red-700">
                {t('vault.removePassword')}
              </Button>
            )}
            <div className="flex gap-2 flex-1 justify-end">
              <Button variant="outline" onClick={() => {
                setShowSetPasswordDialog(false);
                setNewPassword('');
                setConfirmPassword('');
              }}>
                {t('vault.cancel')}
              </Button>
              <Button onClick={setVaultPassword} disabled={!newPassword || !confirmPassword}>
                <Lock className="w-4 h-4 mr-2" />
                {t('common.save')}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('vault.deleteReflection')}</AlertDialogTitle>
            <AlertDialogDescription>{t('vault.deleteReflectionDesc')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('vault.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirmId && deleteSummary(deleteConfirmId)}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? t('vault.deleting') : t('vault.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Hidden file input for image upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && uploadingSummaryId) {
            handleImageUpload(uploadingSummaryId, file);
          }
          e.target.value = '';
        }}
      />

      <SelfBarometer
        isOpen={showBarometer}
        onClose={() => setShowBarometer(false)}
        initialContext={barometerContext}
      />

    </div>
  );
};

export default Summaries;

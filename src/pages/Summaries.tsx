import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, Calendar, MapPin, Clock, Heart, Brain, Sparkles, Target, Activity, Lock, Trash2, Eye, EyeOff, Settings, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
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
}

const partTypeLabels: Record<string, { label: string; color: string }> = {
  manager: { label: 'Manager', color: 'bg-blue-500/20 text-blue-700' },
  firefighter: { label: 'Feuerwehr', color: 'bg-orange-500/20 text-orange-700' },
  exile: { label: 'Exilant', color: 'bg-purple-500/20 text-purple-700' },
  self: { label: 'Selbst', color: 'bg-green-500/20 text-green-700' },
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
  const { user } = useAuth();
  const navigate = useNavigate();
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
        toast.success('Tresor entsperrt');
      } else {
        toast.error('Falsches Passwort');
        setPasswordInput('');
      }
    } catch (error) {
      console.error('Error unlocking vault:', error);
      toast.error('Fehler beim Entsperren');
    }
  };

  const setVaultPassword = async () => {
    if (!user) return;
    
    if (newPassword.length < 4) {
      toast.error('Passwort muss mindestens 4 Zeichen haben');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwörter stimmen nicht überein');
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
      toast.success('Tresor-Passwort gesetzt');
    } catch (error) {
      console.error('Error setting vault password:', error);
      toast.error('Fehler beim Setzen des Passworts');
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
      toast.success('Passwortschutz entfernt');
    } catch (error) {
      console.error('Error removing vault password:', error);
      toast.error('Fehler beim Entfernen des Passworts');
    }
  };

  const loadSummaries = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('memories')
        .select('id, title, summary, structured_summary, location, created_at, memory_date, memory_type')
        .eq('user_id', user.id)
        .in('memory_type', ['selfcare-reflection', 'impulse-reflection', 'situation-reflection'])
        .eq('summary_requested', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedData = (data || []).map(item => ({
        ...item,
        structured_summary: item.structured_summary as unknown as StructuredSummary | null
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
      toast.success('Reflexion gelöscht');
    } catch (error) {
      console.error('Error deleting summary:', error);
      toast.error('Fehler beim Löschen');
    } finally {
      setDeleting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Bitte melde dich an, um deinen Tresor zu öffnen.</p>
          <Button onClick={() => navigate('/auth')}>Anmelden</Button>
        </div>
      </div>
    );
  }

  // Password entry screen
  if (checkingPassword) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
                <h1 className="text-xl font-semibold text-foreground">Tresor entsperren</h1>
                <p className="text-sm text-muted-foreground mt-1 text-center">
                  Gib dein Tresor-Passwort ein
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Passwort"
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
                  Entsperren
                </Button>

                <Button variant="ghost" onClick={() => navigate('/selfcare')} className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Zurück
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
      
      {/* iOS-style Hero Section */}
      <section className="pt-[calc(env(safe-area-inset-top,0px)+44px)] pb-6 sm:pt-24 sm:pb-10 relative z-10">

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 flex items-center justify-between"
          >
            <button
              onClick={() => navigate('/selfcare')}
              className="ios-button-text flex items-center gap-0.5 -ml-2"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
              <span className="ios-body">Zurück</span>
            </button>

            {/* Settings button for password */}
            <button
              onClick={() => setShowSetPasswordDialog(true)}
              className="w-9 h-9 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
              title="Tresor-Einstellungen"
            >
              <Settings className="w-4 h-4 text-muted-foreground" />
            </button>
          </motion.div>

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
                Mein Tresor
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="ios-subhead text-muted-foreground max-w-xl mt-3"
            >
              {summaries.length} {summaries.length === 1 ? 'Reflexion' : 'Reflexionen'} sicher aufbewahrt
              {hasPassword && <span className="ml-2">🔒</span>}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Summaries List */}
      <section className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pb-[max(env(safe-area-inset-bottom,20px),20px)]">
        {loading ? (
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
              Dein Tresor ist noch leer.
            </p>
            <p className="text-sm text-muted-foreground/70 mt-2">
              Speichere eine Reflexion, um sie hier zu sehen.
            </p>
            <Button 
              className="mt-6"
              onClick={() => navigate('/selfcare')}
            >
              Reflexion starten
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
                    className="w-full p-4 sm:p-5 text-left hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate pr-8">
                          {summary.title}
                        </h3>
                        
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
                              <><Sparkles className="w-3 h-3" /> Impuls</>
                            ) : summary.memory_type === 'situation-reflection' ? (
                              <><Brain className="w-3 h-3" /> Situation</>
                            ) : (
                              <><Heart className="w-3 h-3" /> Reflexion</>
                            )}
                          </span>
                          
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(summary.created_at), 'dd. MMMM yyyy', { locale: de })}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {format(new Date(summary.created_at), 'HH:mm', { locale: de })} Uhr
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
                    className="absolute top-4 right-12 w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Löschen"
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
                      <div className="px-4 sm:px-5 pb-5 space-y-5 border-t border-border pt-5">
                        {/* Summary Text */}
                        <div>
                          <p className="text-foreground leading-relaxed">
                            {summary.structured_summary.summary_text}
                          </p>
                        </div>

                        {/* Patterns */}
                        {summary.structured_summary.patterns?.length > 0 && (
                          <div>
                            <h4 className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                              <Target className="w-4 h-4 text-primary" />
                              Erkannte Muster
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
                              Berührte Bedürfnisse
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
                              Beteiligte innere Teile
                            </h4>
                            <div className="space-y-2">
                              {summary.structured_summary.parts.map((part, i) => (
                                <div key={i} className="flex items-start gap-2">
                                  <span className={`px-2 py-0.5 text-xs rounded-full shrink-0 ${partTypeLabels[part.type]?.color || 'bg-gray-500/20 text-gray-700'}`}>
                                    {partTypeLabels[part.type]?.label || part.type}
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
                              Körperbereiche
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
                              Zentrale Erkenntnisse
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
                            <h4 className="text-sm font-medium text-foreground">Empfehlungen für dich</h4>
                            
                            {summary.structured_summary.recommendations.body_exercise && (
                              <div className="text-sm">
                                <span className="text-primary font-medium">🧘 Körperübung:</span>{' '}
                                <span className="text-muted-foreground">{summary.structured_summary.recommendations.body_exercise}</span>
                              </div>
                            )}
                            
                            {summary.structured_summary.recommendations.micro_action && (
                              <div className="text-sm">
                                <span className="text-primary font-medium">✨ Mikro-Aktion:</span>{' '}
                                <span className="text-muted-foreground">{summary.structured_summary.recommendations.micro_action}</span>
                              </div>
                            )}
                            
                            {summary.structured_summary.recommendations.reflection_question && (
                              <div className="text-sm">
                                <span className="text-primary font-medium">💭 Zum Nachdenken:</span>{' '}
                                <span className="text-muted-foreground italic">"{summary.structured_summary.recommendations.reflection_question}"</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Action buttons in expanded view */}
                        <div className="pt-2 border-t border-border flex flex-wrap gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteConfirmId(summary.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Löschen
                          </Button>
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
              Tresor-Passwort
            </DialogTitle>
            <DialogDescription>
              {hasPassword 
                ? 'Ändere oder entferne dein Tresor-Passwort' 
                : 'Schütze deinen Tresor mit einem Passwort'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-foreground">Neues Passwort</label>
              <div className="relative mt-1">
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Mindestens 4 Zeichen"
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
              <label className="text-sm font-medium text-foreground">Passwort bestätigen</label>
              <Input
                type="password"
                placeholder="Passwort wiederholen"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {hasPassword && (
              <Button variant="ghost" onClick={removeVaultPassword} className="text-red-600 hover:text-red-700">
                Passwort entfernen
              </Button>
            )}
            <div className="flex gap-2 flex-1 justify-end">
              <Button variant="outline" onClick={() => {
                setShowSetPasswordDialog(false);
                setNewPassword('');
                setConfirmPassword('');
              }}>
                Abbrechen
              </Button>
              <Button onClick={setVaultPassword} disabled={!newPassword || !confirmPassword}>
                <Lock className="w-4 h-4 mr-2" />
                Speichern
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reflexion löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Diese Aktion kann nicht rückgängig gemacht werden. Die Reflexion wird dauerhaft aus deinem Tresor entfernt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirmId && deleteSummary(deleteConfirmId)}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? 'Wird gelöscht...' : 'Löschen'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};

export default Summaries;
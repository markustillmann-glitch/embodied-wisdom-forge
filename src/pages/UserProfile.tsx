import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Loader2, Camera, User, Heart, Brain, Sparkles, MessageSquare, Sun, Clock, Lock, Eye, EyeOff, Check, X, Sliders, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface UserProfileData {
  photo_url: string | null;
  goals_motivation: string | null;
  biggest_challenges: string | null;
  safety_feeling: string | null;
  overwhelm_signals: string | null;
  nervous_system_tempo: string | null;
  core_needs: string[] | null;
  neglected_needs: string[] | null;
  over_fulfilled_needs: string[] | null;
  belonging_through: string[] | null;
  reaction_to_expectations: string | null;
  harder_closeness_or_boundaries: string | null;
  primary_memory_channel: string[] | null;
  memory_effect: string | null;
  trigger_sensitivity: string | null;
  when_feels_light: string | null;
  when_depth_nourishing: string | null;
  when_depth_burdening: string | null;
  lightness_depth_balance: string | null;
  preferred_tone: string[] | null;
  response_preference: string[] | null;
  language_triggers: string[] | null;
  life_phase: string | null;
  energy_level: string | null;
  current_focus: string[] | null;
  // Coach AI Settings
  coach_tonality: string | null;
  interpretation_style: string | null;
  praise_level: string | null;
  // Resource Onboarding
  safe_places: string[] | null;
  power_sources: string[] | null;
  body_anchors: string[] | null;
  self_qualities: string[] | null;
  resource_onboarding_completed: boolean | null;
}

const defaultProfile: UserProfileData = {
  photo_url: null,
  goals_motivation: null,
  biggest_challenges: null,
  safety_feeling: null,
  overwhelm_signals: null,
  nervous_system_tempo: null,
  core_needs: [],
  neglected_needs: [],
  over_fulfilled_needs: [],
  belonging_through: [],
  reaction_to_expectations: null,
  harder_closeness_or_boundaries: null,
  primary_memory_channel: [],
  memory_effect: null,
  trigger_sensitivity: null,
  when_feels_light: null,
  when_depth_nourishing: null,
  when_depth_burdening: null,
  lightness_depth_balance: null,
  preferred_tone: [],
  response_preference: [],
  language_triggers: [],
  life_phase: null,
  energy_level: null,
  current_focus: [],
  // Coach AI Settings
  coach_tonality: 'warm',
  interpretation_style: 'neutral',
  praise_level: 'moderate',
  // Resource Onboarding
  safe_places: [],
  power_sources: [],
  body_anchors: [],
  self_qualities: [],
  resource_onboarding_completed: false,
};

// Extracted components to prevent re-creation on every render
const RadioOption = React.memo(({ 
  value, 
  label, 
  selected, 
  onSelect 
}: { 
  value: string; 
  label: string; 
  selected: boolean; 
  onSelect: () => void;
}) => (
  <button
    type="button"
    onClick={onSelect}
    className={cn(
      "px-3 py-2 sm:px-4 rounded-lg border transition-all text-xs sm:text-sm min-h-[44px] touch-manipulation",
      selected
        ? "bg-primary text-primary-foreground border-primary"
        : "bg-secondary/50 border-border hover:bg-secondary active:bg-secondary"
    )}
  >
    {label}
  </button>
));
RadioOption.displayName = 'RadioOption';

const CheckboxOption = React.memo(({ 
  value, 
  label, 
  checked, 
  onToggle 
}: { 
  value: string; 
  label: string; 
  checked: boolean; 
  onToggle: () => void;
}) => (
  <button
    type="button"
    onClick={onToggle}
    className={cn(
      "px-3 py-2 sm:px-4 rounded-lg border transition-all text-xs sm:text-sm min-h-[44px] touch-manipulation",
      checked
        ? "bg-primary text-primary-foreground border-primary"
        : "bg-secondary/50 border-border hover:bg-secondary active:bg-secondary"
    )}
  >
    {label}
  </button>
));
CheckboxOption.displayName = 'CheckboxOption';

// Specialized input for comma-separated arrays that preserves cursor position
const ArrayInput = React.memo(({ 
  value, 
  onChange, 
  placeholder, 
  className 
}: { 
  value: string[] | null; 
  onChange: (value: string[]) => void; 
  placeholder: string; 
  className?: string;
}) => {
  const [localValue, setLocalValue] = React.useState(() => (value || []).join(', '));
  
  // Sync local value when external value changes (but not during typing)
  React.useEffect(() => {
    const externalValue = (value || []).join(', ');
    // Only update if the parsed values are different (ignoring whitespace)
    const localParsed = localValue.split(',').map(s => s.trim()).filter(Boolean).join(', ');
    if (externalValue !== localParsed) {
      setLocalValue(externalValue);
    }
  }, [value]);
  
  return (
    <Input
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={() => {
        const parsed = localValue.split(',').map(s => s.trim()).filter(Boolean);
        onChange(parsed);
        setLocalValue(parsed.join(', '));
      }}
      placeholder={placeholder}
      className={className}
    />
  );
});
ArrayInput.displayName = 'ArrayInput';

const Section = React.memo(({ 
  icon: Icon, 
  title, 
  description, 
  children 
}: { 
  icon: any; 
  title: string; 
  description: string; 
  children: React.ReactNode;
}) => (
  <div className="bg-card rounded-xl p-4 sm:p-6 border border-border space-y-3 sm:space-y-4">
    <div className="flex items-start gap-2 sm:gap-3">
      <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 shrink-0">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-base sm:text-lg">{title}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
    <div className="space-y-3 sm:space-y-4 pt-1 sm:pt-2">
      {children}
    </div>
  </div>
));
Section.displayName = 'Section';

const UserProfile = () => {
  const { user, loading: authLoading, updatePassword } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<UserProfileData>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  // Vault password state
  const [hasVaultPassword, setHasVaultPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Account password change state
  const [accountNewPassword, setAccountNewPassword] = useState('');
  const [accountConfirmPassword, setAccountConfirmPassword] = useState('');
  const [showAccountPassword, setShowAccountPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Error loading profile:', error);
    }

    if (data) {
      setProfile({
        ...defaultProfile,
        ...data,
      });
      if (data.photo_url) {
        setPhotoPreview(data.photo_url);
      }
      // Check if vault password is set
      setHasVaultPassword(!!data.vault_password_hash);
    }
    setIsLoading(false);
  };

  // Simple hash function for password
  const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async (): Promise<string | null> => {
    if (!photoFile || !user) return profile.photo_url;

    const fileExt = photoFile.name.split('.').pop();
    const fileName = `${user.id}/profile.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('memory-images')
      .upload(fileName, photoFile, { upsert: true });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return profile.photo_url;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('memory-images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSave = async () => {
    if (!user) return;

    // Validate password fields if trying to set a new password
    if (newPassword && newPassword !== confirmPassword) {
      toast({
        title: t('userProfile.vaultPasswordMismatch'),
        variant: 'destructive',
      });
      return;
    }

    if (newPassword && newPassword.length < 4) {
      toast({
        title: t('userProfile.vaultPasswordPlaceholder'),
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    
    const photoUrl = await uploadPhoto();

    // Prepare profile data
    const profileData: any = {
      user_id: user.id,
      ...profile,
      photo_url: photoUrl,
    };

    // Handle password update
    if (newPassword) {
      profileData.vault_password_hash = await hashPassword(newPassword);
    }

    const { error } = await supabase
      .from('user_profiles')
      .upsert(profileData, { onConflict: 'user_id' });

    if (error) {
      console.error('Error saving profile:', error);
      toast({
        title: t('userProfile.saveError'),
        variant: 'destructive',
      });
    } else {
      // Update password state if password was set
      if (newPassword) {
        setHasVaultPassword(true);
        setNewPassword('');
        setConfirmPassword('');
      }
      toast({
        title: t('userProfile.saved'),
        description: t('userProfile.savedDesc'),
      });
    }

    setIsSaving(false);
  };

  const removeVaultPassword = async () => {
    if (!user) return;
    
    setIsSaving(true);
    
    const { error } = await supabase
      .from('user_profiles')
      .update({ vault_password_hash: null })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error removing password:', error);
      toast({
        title: t('userProfile.saveError'),
        variant: 'destructive',
      });
    } else {
      setHasVaultPassword(false);
      toast({
        title: t('userProfile.vaultPasswordRemoved'),
      });
    }

    setIsSaving(false);
  };

  const updateField = useCallback((field: keyof UserProfileData, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  }, []);

  const toggleArrayField = useCallback((field: keyof UserProfileData, value: string) => {
    setProfile(prev => {
      const current = (prev[field] as string[]) || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  }, []);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
          <Link to="/coach" className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground hover:text-foreground transition-colors shrink-0">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">{t('userProfile.backToCoach')}</span>
          </Link>
          <h1 className="font-serif text-sm sm:text-lg truncate">{t('userProfile.title')}</h1>
          <Button onClick={handleSave} disabled={isSaving} size="sm" className="shrink-0">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin sm:mr-2" /> : <Save className="h-4 w-4 sm:mr-2" />}
            <span className="hidden sm:inline">{t('userProfile.save')}</span>
          </Button>
        </div>
      </header>

      <ScrollArea className="h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)]">
        <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-8">
          {/* Photo & Basic Info */}
          <Section icon={User} title={t('userProfile.basicInfo')} description={t('userProfile.basicInfoDesc')}>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-secondary flex items-center justify-center overflow-hidden border-2 border-border">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors touch-manipulation">
                    <Camera className="h-4 w-4" />
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  </label>
                </div>
              </div>
              <div className="flex-1 space-y-3 sm:space-y-4">
                <div>
                  <Label className="text-sm">{t('userProfile.goalsMotivation')}</Label>
                  <Textarea
                    value={profile.goals_motivation || ''}
                    onChange={(e) => updateField('goals_motivation', e.target.value)}
                    placeholder={t('userProfile.goalsPlaceholder')}
                    className="mt-1.5 text-base"
                    rows={2}
                  />
                </div>
                <div>
                  <Label className="text-sm">{t('userProfile.biggestChallenges')}</Label>
                  <Textarea
                    value={profile.biggest_challenges || ''}
                    onChange={(e) => updateField('biggest_challenges', e.target.value)}
                    placeholder={t('userProfile.challengesPlaceholder')}
                    className="mt-1.5 text-base"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* 1. Emotion & Regulation Profile */}
          <Section icon={Heart} title={t('userProfile.emotionProfile')} description={t('userProfile.emotionProfileDesc')}>
            <div>
              <Label className="text-sm">{t('userProfile.safetyFeeling')}</Label>
              <Textarea
                value={profile.safety_feeling || ''}
                onChange={(e) => updateField('safety_feeling', e.target.value)}
                placeholder={t('userProfile.safetyFeelingPlaceholder')}
                className="mt-1.5 text-base"
                rows={2}
              />
            </div>
            <div>
              <Label className="text-sm">{t('userProfile.overwhelmSignals')}</Label>
              <Textarea
                value={profile.overwhelm_signals || ''}
                onChange={(e) => updateField('overwhelm_signals', e.target.value)}
                placeholder={t('userProfile.overwhelmSignalsPlaceholder')}
                className="mt-1.5 text-base"
                rows={2}
              />
            </div>
            <div>
              <Label className="mb-2 block text-sm">{t('userProfile.nervousSystemTempo')}</Label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <RadioOption value="calm" label={t('userProfile.tempo.calm')} selected={profile.nervous_system_tempo === 'calm'} onSelect={() => updateField('nervous_system_tempo', 'calm')} />
                <RadioOption value="varying" label={t('userProfile.tempo.varying')} selected={profile.nervous_system_tempo === 'varying'} onSelect={() => updateField('nervous_system_tempo', 'varying')} />
                <RadioOption value="high_active" label={t('userProfile.tempo.highActive')} selected={profile.nervous_system_tempo === 'high_active'} onSelect={() => updateField('nervous_system_tempo', 'high_active')} />
              </div>
            </div>
          </Section>

          {/* 2. Needs Topology */}
          <Section icon={Sparkles} title={t('userProfile.needsTopology')} description={t('userProfile.needsTopologyDesc')}>
            <div>
              <Label className="text-sm">{t('userProfile.coreNeeds')}</Label>
              <ArrayInput
                value={profile.core_needs}
                onChange={(val) => updateField('core_needs', val)}
                placeholder={t('userProfile.coreNeedsPlaceholder')}
                className="mt-1.5 text-base"
              />
              <p className="text-xs text-muted-foreground mt-1">{t('userProfile.commaSeparated')}</p>
            </div>
            <div>
              <Label className="text-sm">{t('userProfile.neglectedNeeds')}</Label>
              <ArrayInput
                value={profile.neglected_needs}
                onChange={(val) => updateField('neglected_needs', val)}
                placeholder={t('userProfile.neglectedNeedsPlaceholder')}
                className="mt-1.5 text-base"
              />
              <p className="text-xs text-muted-foreground mt-1">{t('userProfile.commaSeparated')}</p>
            </div>
            <div>
              <Label className="text-sm">{t('userProfile.overFulfilledNeeds')}</Label>
              <ArrayInput
                value={profile.over_fulfilled_needs}
                onChange={(val) => updateField('over_fulfilled_needs', val)}
                placeholder={t('userProfile.overFulfilledNeedsPlaceholder')}
                className="mt-1.5 text-base"
              />
              <p className="text-xs text-muted-foreground mt-1">{t('userProfile.commaSeparated')}</p>
            </div>
          </Section>

          {/* 3. Belonging & Difference */}
          <Section icon={User} title={t('userProfile.belongingDifference')} description={t('userProfile.belongingDifferenceDesc')}>
            <div>
              <Label className="mb-2 block text-sm">{t('userProfile.belongingThrough')}</Label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <CheckboxOption value="similarity" label={t('userProfile.belonging.similarity')} checked={(profile.belonging_through || []).includes('similarity')} onToggle={() => toggleArrayField('belonging_through', 'similarity')} />
                <CheckboxOption value="acceptance_of_difference" label={t('userProfile.belonging.acceptanceDifference')} checked={(profile.belonging_through || []).includes('acceptance_of_difference')} onToggle={() => toggleArrayField('belonging_through', 'acceptance_of_difference')} />
                <CheckboxOption value="achievement" label={t('userProfile.belonging.achievement')} checked={(profile.belonging_through || []).includes('achievement')} onToggle={() => toggleArrayField('belonging_through', 'achievement')} />
              </div>
            </div>
            <div>
              <Label className="text-sm">{t('userProfile.reactionToExpectations')}</Label>
              <Textarea
                value={profile.reaction_to_expectations || ''}
                onChange={(e) => updateField('reaction_to_expectations', e.target.value)}
                placeholder={t('userProfile.reactionPlaceholder')}
                className="mt-1.5 text-base"
                rows={2}
              />
            </div>
            <div>
              <Label className="mb-2 block text-sm">{t('userProfile.harderClosenessOrBoundaries')}</Label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <RadioOption value="closeness" label={t('userProfile.closeness')} selected={profile.harder_closeness_or_boundaries === 'closeness'} onSelect={() => updateField('harder_closeness_or_boundaries', 'closeness')} />
                <RadioOption value="boundaries" label={t('userProfile.boundaries')} selected={profile.harder_closeness_or_boundaries === 'boundaries'} onSelect={() => updateField('harder_closeness_or_boundaries', 'boundaries')} />
                <RadioOption value="both" label={t('userProfile.both')} selected={profile.harder_closeness_or_boundaries === 'both'} onSelect={() => updateField('harder_closeness_or_boundaries', 'both')} />
              </div>
            </div>
          </Section>

          {/* 4. Memory Type */}
          <Section icon={Brain} title={t('userProfile.memoryType')} description={t('userProfile.memoryTypeDesc')}>
            <div>
              <Label className="mb-2 block text-sm">{t('userProfile.primaryMemoryChannel')}</Label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <CheckboxOption value="body" label={t('userProfile.channel.body')} checked={(profile.primary_memory_channel || []).includes('body')} onToggle={() => toggleArrayField('primary_memory_channel', 'body')} />
                <CheckboxOption value="music" label={t('userProfile.channel.music')} checked={(profile.primary_memory_channel || []).includes('music')} onToggle={() => toggleArrayField('primary_memory_channel', 'music')} />
                <CheckboxOption value="images" label={t('userProfile.channel.images')} checked={(profile.primary_memory_channel || []).includes('images')} onToggle={() => toggleArrayField('primary_memory_channel', 'images')} />
                <CheckboxOption value="language" label={t('userProfile.channel.language')} checked={(profile.primary_memory_channel || []).includes('language')} onToggle={() => toggleArrayField('primary_memory_channel', 'language')} />
                <CheckboxOption value="places" label={t('userProfile.channel.places')} checked={(profile.primary_memory_channel || []).includes('places')} onToggle={() => toggleArrayField('primary_memory_channel', 'places')} />
              </div>
            </div>
            <div>
              <Label className="mb-2 block text-sm">{t('userProfile.memoryEffect')}</Label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <RadioOption value="regulating" label={t('userProfile.effect.regulating')} selected={profile.memory_effect === 'regulating'} onSelect={() => updateField('memory_effect', 'regulating')} />
                <RadioOption value="intensifying" label={t('userProfile.effect.intensifying')} selected={profile.memory_effect === 'intensifying'} onSelect={() => updateField('memory_effect', 'intensifying')} />
                <RadioOption value="melancholic" label={t('userProfile.effect.melancholic')} selected={profile.memory_effect === 'melancholic'} onSelect={() => updateField('memory_effect', 'melancholic')} />
              </div>
            </div>
            <div>
              <Label className="mb-2 block text-sm">{t('userProfile.triggerSensitivity')}</Label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <RadioOption value="low" label={t('userProfile.sensitivity.low')} selected={profile.trigger_sensitivity === 'low'} onSelect={() => updateField('trigger_sensitivity', 'low')} />
                <RadioOption value="medium" label={t('userProfile.sensitivity.medium')} selected={profile.trigger_sensitivity === 'medium'} onSelect={() => updateField('trigger_sensitivity', 'medium')} />
                <RadioOption value="high" label={t('userProfile.sensitivity.high')} selected={profile.trigger_sensitivity === 'high'} onSelect={() => updateField('trigger_sensitivity', 'high')} />
              </div>
            </div>
          </Section>

          {/* 5. Lightness vs Depth */}
          <Section icon={Sun} title={t('userProfile.lightnessVsDepth')} description={t('userProfile.lightnessVsDepthDesc')}>
            <div>
              <Label className="text-sm">{t('userProfile.whenFeelsLight')}</Label>
              <Textarea
                value={profile.when_feels_light || ''}
                onChange={(e) => updateField('when_feels_light', e.target.value)}
                placeholder={t('userProfile.whenFeelsLightPlaceholder')}
                className="mt-1.5 text-base"
                rows={2}
              />
            </div>
            <div>
              <Label className="text-sm">{t('userProfile.whenDepthNourishing')}</Label>
              <Textarea
                value={profile.when_depth_nourishing || ''}
                onChange={(e) => updateField('when_depth_nourishing', e.target.value)}
                placeholder={t('userProfile.whenDepthNourishingPlaceholder')}
                className="mt-1.5 text-base"
                rows={2}
              />
            </div>
            <div>
              <Label className="text-sm">{t('userProfile.whenDepthBurdening')}</Label>
              <Textarea
                value={profile.when_depth_burdening || ''}
                onChange={(e) => updateField('when_depth_burdening', e.target.value)}
                placeholder={t('userProfile.whenDepthBurdeningPlaceholder')}
                className="mt-1.5 text-base"
                rows={2}
              />
            </div>
            <div>
              <Label className="mb-2 block text-sm">{t('userProfile.lightnessDepthBalance')}</Label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <RadioOption value="more_lightness" label={t('userProfile.balance.moreLightness')} selected={profile.lightness_depth_balance === 'more_lightness'} onSelect={() => updateField('lightness_depth_balance', 'more_lightness')} />
                <RadioOption value="more_depth" label={t('userProfile.balance.moreDepth')} selected={profile.lightness_depth_balance === 'more_depth'} onSelect={() => updateField('lightness_depth_balance', 'more_depth')} />
                <RadioOption value="balanced" label={t('userProfile.balance.balanced')} selected={profile.lightness_depth_balance === 'balanced'} onSelect={() => updateField('lightness_depth_balance', 'balanced')} />
              </div>
            </div>
          </Section>

          {/* 6. Language & Tonality */}
          <Section icon={MessageSquare} title={t('userProfile.languageTonality')} description={t('userProfile.languageTonalityDesc')}>
            <div>
              <Label className="mb-2 block text-sm">{t('userProfile.preferredTone')}</Label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <CheckboxOption value="calm" label={t('userProfile.tone.calm')} checked={(profile.preferred_tone || []).includes('calm')} onToggle={() => toggleArrayField('preferred_tone', 'calm')} />
                <CheckboxOption value="poetic" label={t('userProfile.tone.poetic')} checked={(profile.preferred_tone || []).includes('poetic')} onToggle={() => toggleArrayField('preferred_tone', 'poetic')} />
                <CheckboxOption value="clear" label={t('userProfile.tone.clear')} checked={(profile.preferred_tone || []).includes('clear')} onToggle={() => toggleArrayField('preferred_tone', 'clear')} />
                <CheckboxOption value="analytical" label={t('userProfile.tone.analytical')} checked={(profile.preferred_tone || []).includes('analytical')} onToggle={() => toggleArrayField('preferred_tone', 'analytical')} />
                <CheckboxOption value="questioning" label={t('userProfile.tone.questioning')} checked={(profile.preferred_tone || []).includes('questioning')} onToggle={() => toggleArrayField('preferred_tone', 'questioning')} />
              </div>
            </div>
            <div>
              <Label className="mb-2 block text-sm">{t('userProfile.responsePreference')}</Label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <CheckboxOption value="direct_recommendations" label={t('userProfile.response.directRecommendations')} checked={(profile.response_preference || []).includes('direct_recommendations')} onToggle={() => toggleArrayField('response_preference', 'direct_recommendations')} />
                <CheckboxOption value="open_questions" label={t('userProfile.response.openQuestions')} checked={(profile.response_preference || []).includes('open_questions')} onToggle={() => toggleArrayField('response_preference', 'open_questions')} />
                <CheckboxOption value="mirroring" label={t('userProfile.response.mirroring')} checked={(profile.response_preference || []).includes('mirroring')} onToggle={() => toggleArrayField('response_preference', 'mirroring')} />
              </div>
            </div>
            <div>
              <Label className="text-sm">{t('userProfile.languageTriggers')}</Label>
              <Input
                value={(profile.language_triggers || []).join(', ')}
                onChange={(e) => updateField('language_triggers', e.target.value.split(','))}
                onBlur={(e) => updateField('language_triggers', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                placeholder={t('userProfile.languageTriggersPlaceholder')}
                className="mt-1.5 text-base"
              />
              <p className="text-xs text-muted-foreground mt-1">{t('userProfile.commaSeparated')}</p>
            </div>
          </Section>

          {/* 7. Current Life Phase */}
          <Section icon={Clock} title={t('userProfile.lifePhase')} description={t('userProfile.lifePhaseDesc')}>
            <div>
              <Label className="mb-2 block text-sm">{t('userProfile.phase')}</Label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <RadioOption value="stabilization" label={t('userProfile.phases.stabilization')} selected={profile.life_phase === 'stabilization'} onSelect={() => updateField('life_phase', 'stabilization')} />
                <RadioOption value="integration" label={t('userProfile.phases.integration')} selected={profile.life_phase === 'integration'} onSelect={() => updateField('life_phase', 'integration')} />
                <RadioOption value="opening" label={t('userProfile.phases.opening')} selected={profile.life_phase === 'opening'} onSelect={() => updateField('life_phase', 'opening')} />
                <RadioOption value="transition" label={t('userProfile.phases.transition')} selected={profile.life_phase === 'transition'} onSelect={() => updateField('life_phase', 'transition')} />
              </div>
            </div>
            <div>
              <Label className="mb-2 block text-sm">{t('userProfile.energyLevel')}</Label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <RadioOption value="low" label={t('userProfile.energy.low')} selected={profile.energy_level === 'low'} onSelect={() => updateField('energy_level', 'low')} />
                <RadioOption value="medium" label={t('userProfile.energy.medium')} selected={profile.energy_level === 'medium'} onSelect={() => updateField('energy_level', 'medium')} />
                <RadioOption value="high" label={t('userProfile.energy.high')} selected={profile.energy_level === 'high'} onSelect={() => updateField('energy_level', 'high')} />
              </div>
            </div>
            <div>
              <Label className="mb-2 block text-sm">{t('userProfile.currentFocus')}</Label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <CheckboxOption value="self" label={t('userProfile.focus.self')} checked={(profile.current_focus || []).includes('self')} onToggle={() => toggleArrayField('current_focus', 'self')} />
                <CheckboxOption value="relationship" label={t('userProfile.focus.relationship')} checked={(profile.current_focus || []).includes('relationship')} onToggle={() => toggleArrayField('current_focus', 'relationship')} />
                <CheckboxOption value="meaning" label={t('userProfile.focus.meaning')} checked={(profile.current_focus || []).includes('meaning')} onToggle={() => toggleArrayField('current_focus', 'meaning')} />
              </div>
            </div>
          </Section>

          {/* 8. Resources & Safety Anchors */}
          <Section icon={Shield} title={t('userProfile.resources')} description={t('userProfile.resourcesDesc')}>
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{t('userProfile.resourcesWhy')}</span>
              </div>
              <p className="text-xs text-muted-foreground">{t('userProfile.resourcesWhyDesc')}</p>
            </div>
            <div>
              <Label className="text-sm">{t('userProfile.safePlaces')}</Label>
              <Input
                value={(profile.safe_places || []).join(', ')}
                onChange={(e) => updateField('safe_places', e.target.value.split(','))}
                onBlur={(e) => updateField('safe_places', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                placeholder={t('userProfile.safePlacesPlaceholder')}
                className="mt-1.5 text-base"
              />
              <p className="text-xs text-muted-foreground mt-1">{t('userProfile.commaSeparated')}</p>
            </div>
            <div>
              <Label className="text-sm">{t('userProfile.powerSources')}</Label>
              <Input
                value={(profile.power_sources || []).join(', ')}
                onChange={(e) => updateField('power_sources', e.target.value.split(','))}
                onBlur={(e) => updateField('power_sources', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                placeholder={t('userProfile.powerSourcesPlaceholder')}
                className="mt-1.5 text-base"
              />
              <p className="text-xs text-muted-foreground mt-1">{t('userProfile.commaSeparated')}</p>
            </div>
            <div>
              <Label className="text-sm">{t('userProfile.bodyAnchors')}</Label>
              <Input
                value={(profile.body_anchors || []).join(', ')}
                onChange={(e) => updateField('body_anchors', e.target.value.split(','))}
                onBlur={(e) => updateField('body_anchors', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                placeholder={t('userProfile.bodyAnchorsPlaceholder')}
                className="mt-1.5 text-base"
              />
              <p className="text-xs text-muted-foreground mt-1">{t('userProfile.commaSeparated')}</p>
            </div>
            <div>
              <Label className="mb-2 block text-sm">{t('userProfile.selfQualities')}</Label>
              <p className="text-xs text-muted-foreground mb-2">{t('userProfile.selfQualitiesDesc')}</p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <CheckboxOption value="calm" label={t('userProfile.qualities.calm')} checked={(profile.self_qualities || []).includes('calm')} onToggle={() => toggleArrayField('self_qualities', 'calm')} />
                <CheckboxOption value="curiosity" label={t('userProfile.qualities.curiosity')} checked={(profile.self_qualities || []).includes('curiosity')} onToggle={() => toggleArrayField('self_qualities', 'curiosity')} />
                <CheckboxOption value="clarity" label={t('userProfile.qualities.clarity')} checked={(profile.self_qualities || []).includes('clarity')} onToggle={() => toggleArrayField('self_qualities', 'clarity')} />
                <CheckboxOption value="compassion" label={t('userProfile.qualities.compassion')} checked={(profile.self_qualities || []).includes('compassion')} onToggle={() => toggleArrayField('self_qualities', 'compassion')} />
                <CheckboxOption value="confidence" label={t('userProfile.qualities.confidence')} checked={(profile.self_qualities || []).includes('confidence')} onToggle={() => toggleArrayField('self_qualities', 'confidence')} />
                <CheckboxOption value="courage" label={t('userProfile.qualities.courage')} checked={(profile.self_qualities || []).includes('courage')} onToggle={() => toggleArrayField('self_qualities', 'courage')} />
                <CheckboxOption value="creativity" label={t('userProfile.qualities.creativity')} checked={(profile.self_qualities || []).includes('creativity')} onToggle={() => toggleArrayField('self_qualities', 'creativity')} />
                <CheckboxOption value="connectedness" label={t('userProfile.qualities.connectedness')} checked={(profile.self_qualities || []).includes('connectedness')} onToggle={() => toggleArrayField('self_qualities', 'connectedness')} />
              </div>
            </div>
            <div className="pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => updateField('resource_onboarding_completed', !profile.resource_onboarding_completed)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-lg border transition-all w-full justify-center min-h-[44px] touch-manipulation",
                  profile.resource_onboarding_completed
                    ? "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400"
                    : "bg-secondary/50 border-border hover:bg-secondary"
                )}
              >
                {profile.resource_onboarding_completed ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span className="text-sm">{t('userProfile.resourcesCompleted')}</span>
                  </>
                ) : (
                  <span className="text-sm">{t('userProfile.resourcesMarkComplete')}</span>
                )}
              </button>
            </div>
          </Section>

          {/* 9. Coach AI Settings */}
          <Section icon={Sliders} title={t('userProfile.coachSettings')} description={t('userProfile.coachSettingsDesc')}>
            <div>
              <Label className="mb-2 block text-sm">{t('userProfile.coachTonality')}</Label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <RadioOption value="formal" label={t('userProfile.tonality.formal')} selected={profile.coach_tonality === 'formal'} onSelect={() => updateField('coach_tonality', 'formal')} />
                <RadioOption value="warm" label={t('userProfile.tonality.warm')} selected={profile.coach_tonality === 'warm'} onSelect={() => updateField('coach_tonality', 'warm')} />
                <RadioOption value="casual" label={t('userProfile.tonality.casual')} selected={profile.coach_tonality === 'casual'} onSelect={() => updateField('coach_tonality', 'casual')} />
                <RadioOption value="poetic" label={t('userProfile.tonality.poetic')} selected={profile.coach_tonality === 'poetic'} onSelect={() => updateField('coach_tonality', 'poetic')} />
              </div>
            </div>
            <div>
              <Label className="mb-2 block text-sm">{t('userProfile.interpretationStyle')}</Label>
              <p className="text-xs text-muted-foreground mb-2">{t('userProfile.interpretationStyleDesc')}</p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <RadioOption value="optimistic" label={t('userProfile.interpretation.optimistic')} selected={profile.interpretation_style === 'optimistic'} onSelect={() => updateField('interpretation_style', 'optimistic')} />
                <RadioOption value="neutral" label={t('userProfile.interpretation.neutral')} selected={profile.interpretation_style === 'neutral'} onSelect={() => updateField('interpretation_style', 'neutral')} />
                <RadioOption value="reserved" label={t('userProfile.interpretation.reserved')} selected={profile.interpretation_style === 'reserved'} onSelect={() => updateField('interpretation_style', 'reserved')} />
              </div>
            </div>
            <div>
              <Label className="mb-2 block text-sm">{t('userProfile.praiseLevel')}</Label>
              <p className="text-xs text-muted-foreground mb-2">{t('userProfile.praiseLevelDesc')}</p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <RadioOption value="minimal" label={t('userProfile.praise.minimal')} selected={profile.praise_level === 'minimal'} onSelect={() => updateField('praise_level', 'minimal')} />
                <RadioOption value="moderate" label={t('userProfile.praise.moderate')} selected={profile.praise_level === 'moderate'} onSelect={() => updateField('praise_level', 'moderate')} />
                <RadioOption value="generous" label={t('userProfile.praise.generous')} selected={profile.praise_level === 'generous'} onSelect={() => updateField('praise_level', 'generous')} />
              </div>
            </div>
          </Section>

          {/* Vault Password Protection */}
          <Section icon={Lock} title={t('userProfile.vaultPassword')} description={t('userProfile.vaultPasswordDesc')}>
            <div className="space-y-4">
              {hasVaultPassword ? (
                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-700 dark:text-green-400">{t('userProfile.vaultPasswordSet')}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={removeVaultPassword}
                    disabled={isSaving}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4 mr-1" />
                    {t('userProfile.vaultPasswordRemove')}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{t('userProfile.vaultPasswordNotSet')}</span>
                </div>
              )}
              
              <div>
                <Label className="text-sm">{t('userProfile.vaultPasswordNew')}</Label>
                <div className="relative mt-1.5">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={t('userProfile.vaultPasswordPlaceholder')}
                    className="text-base pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <Label className="text-sm">{t('userProfile.vaultPasswordConfirm')}</Label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t('userProfile.vaultPasswordPlaceholder')}
                  className="mt-1.5 text-base"
                />
                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-destructive mt-1">{t('userProfile.vaultPasswordMismatch')}</p>
                )}
              </div>
            </div>
          </Section>

          {/* Account Password Change Section */}
          <Section
            icon={Shield}
            title={t('auth.changePassword')}
            description={t('userProfile.changePasswordDesc') || 'Ändere dein Anmelde-Passwort für Oria'}
          >
            <div className="space-y-3">
              <div>
                <Label className="text-sm">{t('auth.newPassword')}</Label>
                <div className="relative mt-1.5">
                  <Input
                    type={showAccountPassword ? 'text' : 'password'}
                    value={accountNewPassword}
                    onChange={(e) => setAccountNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="text-base pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAccountPassword(!showAccountPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showAccountPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <Label className="text-sm">{t('auth.confirmPassword')}</Label>
                <Input
                  type={showAccountPassword ? 'text' : 'password'}
                  value={accountConfirmPassword}
                  onChange={(e) => setAccountConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1.5 text-base"
                />
                {accountNewPassword && accountConfirmPassword && accountNewPassword !== accountConfirmPassword && (
                  <p className="text-xs text-destructive mt-1">{t('auth.passwordsDoNotMatch')}</p>
                )}
              </div>
              
              <Button
                onClick={async () => {
                  if (accountNewPassword.length < 6) {
                    toast({
                      title: t('auth.validationError'),
                      description: t('auth.passwordTooShort'),
                      variant: 'destructive',
                    });
                    return;
                  }
                  if (accountNewPassword !== accountConfirmPassword) {
                    toast({
                      title: t('auth.validationError'),
                      description: t('auth.passwordsDoNotMatch'),
                      variant: 'destructive',
                    });
                    return;
                  }
                  setIsChangingPassword(true);
                  const { error } = await updatePassword(accountNewPassword);
                  setIsChangingPassword(false);
                  if (error) {
                    toast({
                      title: t('auth.passwordChangeFailed'),
                      description: error.message,
                      variant: 'destructive',
                    });
                  } else {
                    toast({
                      title: t('auth.passwordChanged'),
                      description: t('auth.passwordChangedDesc'),
                    });
                    setAccountNewPassword('');
                    setAccountConfirmPassword('');
                  }
                }}
                disabled={isChangingPassword || !accountNewPassword || accountNewPassword !== accountConfirmPassword}
                className="w-full sm:w-auto"
              >
                {isChangingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('auth.changePassword')}
              </Button>
            </div>
          </Section>

          <div className="pb-8" />
        </main>
      </ScrollArea>
    </div>
  );
};

export default UserProfile;

import React, { useState, useEffect } from 'react';
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
import { ArrowLeft, Save, Loader2, Camera, User, Heart, Brain, Sparkles, MessageSquare, Sun, Clock } from 'lucide-react';
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
};

const UserProfile = () => {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<UserProfileData>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

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
    }
    setIsLoading(false);
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

    setIsSaving(true);
    
    const photoUrl = await uploadPhoto();

    const profileData = {
      user_id: user.id,
      ...profile,
      photo_url: photoUrl,
    };

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
      toast({
        title: t('userProfile.saved'),
        description: t('userProfile.savedDesc'),
      });
    }

    setIsSaving(false);
  };

  const updateField = (field: keyof UserProfileData, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayField = (field: keyof UserProfileData, value: string) => {
    const current = (profile[field] as string[]) || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateField(field, updated);
  };

  const RadioOption = ({ field, value, label }: { field: keyof UserProfileData; value: string; label: string }) => (
    <button
      type="button"
      onClick={() => updateField(field, value)}
      className={cn(
        "px-4 py-2 rounded-lg border transition-all text-sm",
        profile[field] === value
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-secondary/50 border-border hover:bg-secondary"
      )}
    >
      {label}
    </button>
  );

  const CheckboxOption = ({ field, value, label }: { field: keyof UserProfileData; value: string; label: string }) => (
    <button
      type="button"
      onClick={() => toggleArrayField(field, value)}
      className={cn(
        "px-4 py-2 rounded-lg border transition-all text-sm",
        ((profile[field] as string[]) || []).includes(value)
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-secondary/50 border-border hover:bg-secondary"
      )}
    >
      {label}
    </button>
  );

  const Section = ({ icon: Icon, title, description, children }: { icon: any; title: string; description: string; children: React.ReactNode }) => (
    <div className="bg-card rounded-xl p-6 border border-border space-y-4">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="space-y-4 pt-2">
        {children}
      </div>
    </div>
  );

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
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/coach" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">{t('userProfile.backToCoach')}</span>
          </Link>
          <h1 className="font-serif text-lg">{t('userProfile.title')}</h1>
          <Button onClick={handleSave} disabled={isSaving} size="sm">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            {t('userProfile.save')}
          </Button>
        </div>
      </header>

      <ScrollArea className="h-[calc(100vh-4rem)]">
        <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
          {/* Photo & Basic Info */}
          <Section icon={User} title={t('userProfile.basicInfo')} description={t('userProfile.basicInfoDesc')}>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-secondary flex items-center justify-center overflow-hidden border-2 border-border">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                    <Camera className="h-4 w-4" />
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  </label>
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <Label>{t('userProfile.goalsMotivation')}</Label>
                  <Textarea
                    value={profile.goals_motivation || ''}
                    onChange={(e) => updateField('goals_motivation', e.target.value)}
                    placeholder={t('userProfile.goalsPlaceholder')}
                    className="mt-1.5"
                    rows={3}
                  />
                </div>
                <div>
                  <Label>{t('userProfile.biggestChallenges')}</Label>
                  <Textarea
                    value={profile.biggest_challenges || ''}
                    onChange={(e) => updateField('biggest_challenges', e.target.value)}
                    placeholder={t('userProfile.challengesPlaceholder')}
                    className="mt-1.5"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* 1. Emotion & Regulation Profile */}
          <Section icon={Heart} title={t('userProfile.emotionProfile')} description={t('userProfile.emotionProfileDesc')}>
            <div>
              <Label>{t('userProfile.safetyFeeling')}</Label>
              <Textarea
                value={profile.safety_feeling || ''}
                onChange={(e) => updateField('safety_feeling', e.target.value)}
                placeholder={t('userProfile.safetyFeelingPlaceholder')}
                className="mt-1.5"
                rows={2}
              />
            </div>
            <div>
              <Label>{t('userProfile.overwhelmSignals')}</Label>
              <Textarea
                value={profile.overwhelm_signals || ''}
                onChange={(e) => updateField('overwhelm_signals', e.target.value)}
                placeholder={t('userProfile.overwhelmSignalsPlaceholder')}
                className="mt-1.5"
                rows={2}
              />
            </div>
            <div>
              <Label className="mb-2 block">{t('userProfile.nervousSystemTempo')}</Label>
              <div className="flex flex-wrap gap-2">
                <RadioOption field="nervous_system_tempo" value="calm" label={t('userProfile.tempo.calm')} />
                <RadioOption field="nervous_system_tempo" value="varying" label={t('userProfile.tempo.varying')} />
                <RadioOption field="nervous_system_tempo" value="high_active" label={t('userProfile.tempo.highActive')} />
              </div>
            </div>
          </Section>

          {/* 2. Needs Topology */}
          <Section icon={Sparkles} title={t('userProfile.needsTopology')} description={t('userProfile.needsTopologyDesc')}>
            <div>
              <Label>{t('userProfile.coreNeeds')}</Label>
              <Input
                value={(profile.core_needs || []).join(', ')}
                onChange={(e) => updateField('core_needs', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                placeholder={t('userProfile.coreNeedsPlaceholder')}
                className="mt-1.5"
              />
              <p className="text-xs text-muted-foreground mt-1">{t('userProfile.commaSeparated')}</p>
            </div>
            <div>
              <Label>{t('userProfile.neglectedNeeds')}</Label>
              <Input
                value={(profile.neglected_needs || []).join(', ')}
                onChange={(e) => updateField('neglected_needs', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                placeholder={t('userProfile.neglectedNeedsPlaceholder')}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>{t('userProfile.overFulfilledNeeds')}</Label>
              <Input
                value={(profile.over_fulfilled_needs || []).join(', ')}
                onChange={(e) => updateField('over_fulfilled_needs', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                placeholder={t('userProfile.overFulfilledNeedsPlaceholder')}
                className="mt-1.5"
              />
            </div>
          </Section>

          {/* 3. Belonging & Difference */}
          <Section icon={User} title={t('userProfile.belongingDifference')} description={t('userProfile.belongingDifferenceDesc')}>
            <div>
              <Label className="mb-2 block">{t('userProfile.belongingThrough')}</Label>
              <div className="flex flex-wrap gap-2">
                <CheckboxOption field="belonging_through" value="similarity" label={t('userProfile.belonging.similarity')} />
                <CheckboxOption field="belonging_through" value="acceptance_of_difference" label={t('userProfile.belonging.acceptanceDifference')} />
                <CheckboxOption field="belonging_through" value="achievement" label={t('userProfile.belonging.achievement')} />
              </div>
            </div>
            <div>
              <Label>{t('userProfile.reactionToExpectations')}</Label>
              <Textarea
                value={profile.reaction_to_expectations || ''}
                onChange={(e) => updateField('reaction_to_expectations', e.target.value)}
                placeholder={t('userProfile.reactionPlaceholder')}
                className="mt-1.5"
                rows={2}
              />
            </div>
            <div>
              <Label className="mb-2 block">{t('userProfile.harderClosenessOrBoundaries')}</Label>
              <div className="flex flex-wrap gap-2">
                <RadioOption field="harder_closeness_or_boundaries" value="closeness" label={t('userProfile.closeness')} />
                <RadioOption field="harder_closeness_or_boundaries" value="boundaries" label={t('userProfile.boundaries')} />
                <RadioOption field="harder_closeness_or_boundaries" value="both" label={t('userProfile.both')} />
              </div>
            </div>
          </Section>

          {/* 4. Memory Type */}
          <Section icon={Brain} title={t('userProfile.memoryType')} description={t('userProfile.memoryTypeDesc')}>
            <div>
              <Label className="mb-2 block">{t('userProfile.primaryMemoryChannel')}</Label>
              <div className="flex flex-wrap gap-2">
                <CheckboxOption field="primary_memory_channel" value="body" label={t('userProfile.channel.body')} />
                <CheckboxOption field="primary_memory_channel" value="music" label={t('userProfile.channel.music')} />
                <CheckboxOption field="primary_memory_channel" value="images" label={t('userProfile.channel.images')} />
                <CheckboxOption field="primary_memory_channel" value="language" label={t('userProfile.channel.language')} />
                <CheckboxOption field="primary_memory_channel" value="places" label={t('userProfile.channel.places')} />
              </div>
            </div>
            <div>
              <Label className="mb-2 block">{t('userProfile.memoryEffect')}</Label>
              <div className="flex flex-wrap gap-2">
                <RadioOption field="memory_effect" value="regulating" label={t('userProfile.effect.regulating')} />
                <RadioOption field="memory_effect" value="intensifying" label={t('userProfile.effect.intensifying')} />
                <RadioOption field="memory_effect" value="melancholic" label={t('userProfile.effect.melancholic')} />
              </div>
            </div>
            <div>
              <Label className="mb-2 block">{t('userProfile.triggerSensitivity')}</Label>
              <div className="flex flex-wrap gap-2">
                <RadioOption field="trigger_sensitivity" value="low" label={t('userProfile.sensitivity.low')} />
                <RadioOption field="trigger_sensitivity" value="medium" label={t('userProfile.sensitivity.medium')} />
                <RadioOption field="trigger_sensitivity" value="high" label={t('userProfile.sensitivity.high')} />
              </div>
            </div>
          </Section>

          {/* 5. Lightness vs Depth */}
          <Section icon={Sun} title={t('userProfile.lightnessDepth')} description={t('userProfile.lightnessDepthDesc')}>
            <div>
              <Label>{t('userProfile.whenFeelsLight')}</Label>
              <Textarea
                value={profile.when_feels_light || ''}
                onChange={(e) => updateField('when_feels_light', e.target.value)}
                placeholder={t('userProfile.whenFeelsLightPlaceholder')}
                className="mt-1.5"
                rows={2}
              />
            </div>
            <div>
              <Label>{t('userProfile.whenDepthNourishing')}</Label>
              <Textarea
                value={profile.when_depth_nourishing || ''}
                onChange={(e) => updateField('when_depth_nourishing', e.target.value)}
                placeholder={t('userProfile.whenDepthNourishingPlaceholder')}
                className="mt-1.5"
                rows={2}
              />
            </div>
            <div>
              <Label>{t('userProfile.whenDepthBurdening')}</Label>
              <Textarea
                value={profile.when_depth_burdening || ''}
                onChange={(e) => updateField('when_depth_burdening', e.target.value)}
                placeholder={t('userProfile.whenDepthBurdeningPlaceholder')}
                className="mt-1.5"
                rows={2}
              />
            </div>
            <div>
              <Label className="mb-2 block">{t('userProfile.lightnessDepthBalance')}</Label>
              <div className="flex flex-wrap gap-2">
                <RadioOption field="lightness_depth_balance" value="more_lightness" label={t('userProfile.balance.moreLightness')} />
                <RadioOption field="lightness_depth_balance" value="more_depth" label={t('userProfile.balance.moreDepth')} />
                <RadioOption field="lightness_depth_balance" value="balanced" label={t('userProfile.balance.balanced')} />
              </div>
            </div>
          </Section>

          {/* 6. Language & Tonality */}
          <Section icon={MessageSquare} title={t('userProfile.languageTonality')} description={t('userProfile.languageTonalityDesc')}>
            <div>
              <Label className="mb-2 block">{t('userProfile.preferredTone')}</Label>
              <div className="flex flex-wrap gap-2">
                <CheckboxOption field="preferred_tone" value="calm" label={t('userProfile.tone.calm')} />
                <CheckboxOption field="preferred_tone" value="poetic" label={t('userProfile.tone.poetic')} />
                <CheckboxOption field="preferred_tone" value="clear" label={t('userProfile.tone.clear')} />
                <CheckboxOption field="preferred_tone" value="analytical" label={t('userProfile.tone.analytical')} />
                <CheckboxOption field="preferred_tone" value="questioning" label={t('userProfile.tone.questioning')} />
              </div>
            </div>
            <div>
              <Label className="mb-2 block">{t('userProfile.responsePreference')}</Label>
              <div className="flex flex-wrap gap-2">
                <CheckboxOption field="response_preference" value="direct_recommendations" label={t('userProfile.response.directRecommendations')} />
                <CheckboxOption field="response_preference" value="open_questions" label={t('userProfile.response.openQuestions')} />
                <CheckboxOption field="response_preference" value="reflections" label={t('userProfile.response.reflections')} />
              </div>
            </div>
            <div>
              <Label>{t('userProfile.languageTriggers')}</Label>
              <Input
                value={(profile.language_triggers || []).join(', ')}
                onChange={(e) => updateField('language_triggers', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                placeholder={t('userProfile.languageTriggersPlaceholder')}
                className="mt-1.5"
              />
              <p className="text-xs text-muted-foreground mt-1">{t('userProfile.commaSeparated')}</p>
            </div>
          </Section>

          {/* 7. Current Life Phase */}
          <Section icon={Clock} title={t('userProfile.lifePhase')} description={t('userProfile.lifePhaseDesc')}>
            <div>
              <Label className="mb-2 block">{t('userProfile.currentPhase')}</Label>
              <div className="flex flex-wrap gap-2">
                <RadioOption field="life_phase" value="stabilization" label={t('userProfile.phase.stabilization')} />
                <RadioOption field="life_phase" value="integration" label={t('userProfile.phase.integration')} />
                <RadioOption field="life_phase" value="opening" label={t('userProfile.phase.opening')} />
                <RadioOption field="life_phase" value="transition" label={t('userProfile.phase.transition')} />
              </div>
            </div>
            <div>
              <Label className="mb-2 block">{t('userProfile.energyLevel')}</Label>
              <div className="flex flex-wrap gap-2">
                <RadioOption field="energy_level" value="low" label={t('userProfile.energy.low')} />
                <RadioOption field="energy_level" value="medium" label={t('userProfile.energy.medium')} />
                <RadioOption field="energy_level" value="high" label={t('userProfile.energy.high')} />
              </div>
            </div>
            <div>
              <Label className="mb-2 block">{t('userProfile.currentFocus')}</Label>
              <div className="flex flex-wrap gap-2">
                <CheckboxOption field="current_focus" value="self" label={t('userProfile.focus.self')} />
                <CheckboxOption field="current_focus" value="relationship" label={t('userProfile.focus.relationship')} />
                <CheckboxOption field="current_focus" value="meaning_direction" label={t('userProfile.focus.meaningDirection')} />
              </div>
            </div>
          </Section>

          {/* Save Button (Mobile) */}
          <div className="pb-8 sm:hidden">
            <Button onClick={handleSave} disabled={isSaving} className="w-full" size="lg">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              {t('userProfile.save')}
            </Button>
          </div>
        </main>
      </ScrollArea>
    </div>
  );
};

export default UserProfile;

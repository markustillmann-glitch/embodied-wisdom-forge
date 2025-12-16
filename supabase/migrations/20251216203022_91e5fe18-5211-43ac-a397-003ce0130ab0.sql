-- Create user_profiles table for comprehensive profile data
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Basic info
  photo_url TEXT,
  goals_motivation TEXT,
  biggest_challenges TEXT,
  
  -- 1. Emotion & Regulation Profile
  safety_feeling TEXT, -- How safety feels in body
  overwhelm_signals TEXT, -- What signals overwhelm
  nervous_system_tempo TEXT CHECK (nervous_system_tempo IN ('calm', 'varying', 'high_active')),
  
  -- 2. Needs Topology (NVC)
  core_needs TEXT[], -- Top 5 core needs
  neglected_needs TEXT[], -- Needs often neglected
  over_fulfilled_needs TEXT[], -- Over-fulfilled needs
  
  -- 3. Belonging & Difference
  belonging_through TEXT[] CHECK (belonging_through <@ ARRAY['similarity', 'acceptance_of_difference', 'achievement']::TEXT[]),
  reaction_to_expectations TEXT,
  harder_closeness_or_boundaries TEXT CHECK (harder_closeness_or_boundaries IN ('closeness', 'boundaries', 'both')),
  
  -- 4. Memory Type
  primary_memory_channel TEXT[] CHECK (primary_memory_channel <@ ARRAY['body', 'music', 'images', 'language', 'places']::TEXT[]),
  memory_effect TEXT CHECK (memory_effect IN ('regulating', 'intensifying', 'melancholic')),
  trigger_sensitivity TEXT CHECK (trigger_sensitivity IN ('low', 'medium', 'high')),
  
  -- 5. Lightness vs Depth
  when_feels_light TEXT,
  when_depth_nourishing TEXT,
  when_depth_burdening TEXT,
  lightness_depth_balance TEXT CHECK (lightness_depth_balance IN ('more_lightness', 'more_depth', 'balanced')),
  
  -- 6. Language & Tonality
  preferred_tone TEXT[] CHECK (preferred_tone <@ ARRAY['calm', 'poetic', 'clear', 'analytical', 'questioning']::TEXT[]),
  response_preference TEXT[] CHECK (response_preference <@ ARRAY['direct_recommendations', 'open_questions', 'reflections']::TEXT[]),
  language_triggers TEXT[],
  
  -- 7. Current Life Phase
  life_phase TEXT CHECK (life_phase IN ('stabilization', 'integration', 'opening', 'transition')),
  energy_level TEXT CHECK (energy_level IN ('low', 'medium', 'high')),
  current_focus TEXT[] CHECK (current_focus <@ ARRAY['self', 'relationship', 'meaning_direction']::TEXT[])
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own profile" ON public.user_profiles FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
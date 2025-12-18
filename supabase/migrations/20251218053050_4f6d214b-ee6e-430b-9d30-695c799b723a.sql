-- Add coach tonality and interpretation settings to user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS coach_tonality text DEFAULT 'warm',
ADD COLUMN IF NOT EXISTS interpretation_style text DEFAULT 'neutral',
ADD COLUMN IF NOT EXISTS praise_level text DEFAULT 'moderate';

-- Add comments for documentation
COMMENT ON COLUMN public.user_profiles.coach_tonality IS 'Coach communication style: formal, warm, casual, poetic';
COMMENT ON COLUMN public.user_profiles.interpretation_style IS 'AI interpretation approach: optimistic, neutral, reserved';
COMMENT ON COLUMN public.user_profiles.praise_level IS 'Level of praise/confirmation: minimal, moderate, generous';
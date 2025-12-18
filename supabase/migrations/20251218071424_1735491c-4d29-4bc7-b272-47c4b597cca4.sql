-- Add resource fields to user_profiles
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS safe_places text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS power_sources text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS body_anchors text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS self_qualities text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS resource_onboarding_completed boolean DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN public.user_profiles.safe_places IS 'Places where user feels safe and grounded';
COMMENT ON COLUMN public.user_profiles.power_sources IS 'People, activities, things that give strength';
COMMENT ON COLUMN public.user_profiles.body_anchors IS 'Body locations where user feels safety/strength';
COMMENT ON COLUMN public.user_profiles.self_qualities IS 'IFS 8 Cs the user has experienced';
COMMENT ON COLUMN public.user_profiles.resource_onboarding_completed IS 'Whether user completed resource mapping';
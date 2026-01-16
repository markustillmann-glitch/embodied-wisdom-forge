-- Create gamification table for user progress tracking
CREATE TABLE public.user_gamification (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  
  -- Level System
  current_level TEXT NOT NULL DEFAULT 'observer',
  total_reflections INTEGER NOT NULL DEFAULT 0,
  reflection_depth_score INTEGER NOT NULL DEFAULT 0,
  
  -- Streak System
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_reflection_date DATE,
  
  -- Garden System (stores plant data as JSON)
  garden_plants JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Needs Collection (array of recognized needs)
  collected_needs JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Milestones earned (array of milestone IDs)
  milestones_earned JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Weekly stats
  weekly_reflection_count INTEGER NOT NULL DEFAULT 0,
  weekly_topics JSONB NOT NULL DEFAULT '[]'::jsonb,
  week_start_date DATE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_gamification ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own gamification data"
ON public.user_gamification
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own gamification data"
ON public.user_gamification
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own gamification data"
ON public.user_gamification
FOR UPDATE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_user_gamification_updated_at
BEFORE UPDATE ON public.user_gamification
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
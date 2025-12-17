-- Create table for coach learning insights (encrypted and secure)
CREATE TABLE public.coach_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  insight_type TEXT NOT NULL, -- 'pattern', 'need', 'trigger', 'communication_style', 'strength', 'vulnerability'
  insight_hash TEXT NOT NULL, -- hashed version for deduplication
  insight_content TEXT NOT NULL, -- the actual insight
  confidence_level TEXT DEFAULT 'emerging', -- 'emerging', 'developing', 'established'
  observation_count INTEGER DEFAULT 1, -- how often this pattern was observed
  last_observed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.coach_insights ENABLE ROW LEVEL SECURITY;

-- Create strict RLS policies - only user can access their own insights
CREATE POLICY "Users can view their own insights"
ON public.coach_insights
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage insights"
ON public.coach_insights
FOR ALL
USING (auth.uid() = user_id);

-- Create index for efficient queries
CREATE INDEX idx_coach_insights_user_id ON public.coach_insights(user_id);
CREATE INDEX idx_coach_insights_type ON public.coach_insights(insight_type);

-- Create trigger for updated_at
CREATE TRIGGER update_coach_insights_updated_at
BEFORE UPDATE ON public.coach_insights
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add comment explaining the security model
COMMENT ON TABLE public.coach_insights IS 'Stores AI-learned insights about users. Highly sensitive - access restricted to user only. Used internally by coach for personalization.';
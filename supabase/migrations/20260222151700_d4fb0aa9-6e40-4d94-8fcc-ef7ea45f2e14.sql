
-- Create table for Self-Barometer results
CREATE TABLE public.barometer_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  qualities JSONB NOT NULL DEFAULT '{}'::jsonb,
  weite_answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  qualities_avg NUMERIC NOT NULL DEFAULT 0,
  weite_score INTEGER NOT NULL DEFAULT 0,
  combined_avg NUMERIC NOT NULL DEFAULT 0,
  zone INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.barometer_results ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own barometer results"
  ON public.barometer_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own barometer results"
  ON public.barometer_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own barometer results"
  ON public.barometer_results FOR DELETE
  USING (auth.uid() = user_id);

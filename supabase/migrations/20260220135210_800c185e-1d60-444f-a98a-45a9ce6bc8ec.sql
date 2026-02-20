
-- Table for trigger test results
CREATE TABLE public.trigger_test_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  results JSONB NOT NULL, -- array of {category, score, maxScore, percent}
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trigger_test_results ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own test results"
  ON public.trigger_test_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own test results"
  ON public.trigger_test_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own test results"
  ON public.trigger_test_results FOR DELETE
  USING (auth.uid() = user_id);

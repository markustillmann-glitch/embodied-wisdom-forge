-- Create token usage tracking table
CREATE TABLE public.token_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  function_name TEXT NOT NULL,
  model TEXT,
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  total_tokens INTEGER NOT NULL DEFAULT 0,
  estimated_cost_usd DECIMAL(10, 6) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.token_usage ENABLE ROW LEVEL SECURITY;

-- Users can view their own usage
CREATE POLICY "Users can view their own token usage"
ON public.token_usage
FOR SELECT
USING (auth.uid() = user_id);

-- Service role can insert (from edge functions)
CREATE POLICY "Service role can insert token usage"
ON public.token_usage
FOR INSERT
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_token_usage_user_id ON public.token_usage(user_id);
CREATE INDEX idx_token_usage_created_at ON public.token_usage(created_at);
CREATE INDEX idx_token_usage_function_name ON public.token_usage(function_name);
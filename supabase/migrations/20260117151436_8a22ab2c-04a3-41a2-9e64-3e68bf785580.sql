-- Create table for user impulse tracking
CREATE TABLE public.user_impulses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  impulse_text TEXT NOT NULL,
  pack_id TEXT NOT NULL DEFAULT 'basis',
  used_at TIMESTAMP WITH TIME ZONE,
  is_used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for user subscription status
CREATE TABLE public.user_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  tier TEXT NOT NULL DEFAULT 'free', -- 'free', 'basic', 'premium'
  active_packs TEXT[] NOT NULL DEFAULT '{}',
  impulses_used_this_period INTEGER NOT NULL DEFAULT 0,
  period_start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_impulses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_impulses
CREATE POLICY "Users can view their own impulses"
ON public.user_impulses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own impulses"
ON public.user_impulses FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own impulses"
ON public.user_impulses FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own impulses"
ON public.user_impulses FOR DELETE
USING (auth.uid() = user_id);

-- RLS policies for user_subscriptions
CREATE POLICY "Users can view their own subscription"
ON public.user_subscriptions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subscription"
ON public.user_subscriptions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
ON public.user_subscriptions FOR UPDATE
USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_user_impulses_user_id ON public.user_impulses(user_id);
CREATE INDEX idx_user_impulses_used ON public.user_impulses(user_id, is_used);
CREATE INDEX idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
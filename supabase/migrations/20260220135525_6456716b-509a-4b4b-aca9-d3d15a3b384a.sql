
-- Table for user's saved/bookmarked trigger cards
CREATE TABLE public.saved_trigger_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  card_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, card_id)
);

ALTER TABLE public.saved_trigger_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own saved cards"
  ON public.saved_trigger_cards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save cards"
  ON public.saved_trigger_cards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove saved cards"
  ON public.saved_trigger_cards FOR DELETE
  USING (auth.uid() = user_id);

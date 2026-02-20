
-- Table for user-created custom trigger cards
CREATE TABLE public.custom_trigger_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  icon TEXT NOT NULL DEFAULT '🔮',
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'eigene',
  typischer_anteil TEXT NOT NULL DEFAULT '',
  manager_reaktion TEXT NOT NULL DEFAULT '',
  beduerfnis TEXT NOT NULL DEFAULT '',
  was_passiert TEXT NOT NULL DEFAULT '',
  koerpersignale TEXT NOT NULL DEFAULT '',
  innere_trigger_geschichte TEXT NOT NULL DEFAULT '',
  self_check JSONB NOT NULL DEFAULT '[]'::jsonb,
  regulation TEXT NOT NULL DEFAULT '',
  reframing TEXT NOT NULL DEFAULT '',
  integrationsfrage TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.custom_trigger_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own custom cards"
  ON public.custom_trigger_cards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own custom cards"
  ON public.custom_trigger_cards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own custom cards"
  ON public.custom_trigger_cards FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own custom cards"
  ON public.custom_trigger_cards FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_custom_trigger_cards_updated_at
  BEFORE UPDATE ON public.custom_trigger_cards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

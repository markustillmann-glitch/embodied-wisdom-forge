
-- Create IFS parts table for storing inner parts/Anteile
CREATE TABLE public.ifs_parts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  image_url TEXT,
  role TEXT NOT NULL DEFAULT '',
  age TEXT DEFAULT '',
  body_location TEXT DEFAULT '',
  core_emotion TEXT DEFAULT '',
  trigger TEXT DEFAULT '',
  belief TEXT DEFAULT '',
  need TEXT DEFAULT '',
  protection_strategy TEXT DEFAULT '',
  counterpart TEXT DEFAULT '',
  self_trust_level INTEGER DEFAULT 5 CHECK (self_trust_level >= 0 AND self_trust_level <= 10),
  integration_status TEXT DEFAULT '',
  image_prompt TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ifs_parts ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own parts" ON public.ifs_parts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own parts" ON public.ifs_parts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own parts" ON public.ifs_parts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own parts" ON public.ifs_parts FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_ifs_parts_updated_at
  BEFORE UPDATE ON public.ifs_parts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

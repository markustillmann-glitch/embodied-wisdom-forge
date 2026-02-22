
-- Create user_memories table for the Erinnerungen feature
CREATE TABLE public.user_memories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  memory_date DATE,
  location TEXT,
  emotion TEXT,
  tags TEXT[] DEFAULT '{}',
  media JSONB DEFAULT '[]'::jsonb, -- Array of { type: 'image'|'video', url: string, caption?: string }
  linked_reflection_id UUID REFERENCES public.memories(id) ON DELETE SET NULL,
  linked_part_id UUID REFERENCES public.ifs_parts(id) ON DELETE SET NULL,
  chat_content TEXT, -- Full chatbot conversation used to create this memory
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_memories ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own memories"
  ON public.user_memories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own memories"
  ON public.user_memories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memories"
  ON public.user_memories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memories"
  ON public.user_memories FOR DELETE
  USING (auth.uid() = user_id);

-- Timestamp trigger
CREATE TRIGGER update_user_memories_updated_at
  BEFORE UPDATE ON public.user_memories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for memory media
INSERT INTO storage.buckets (id, name, public) VALUES ('memory-uploads', 'memory-uploads', false);

-- Storage policies
CREATE POLICY "Users can upload their own memory media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'memory-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own memory media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'memory-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own memory media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'memory-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

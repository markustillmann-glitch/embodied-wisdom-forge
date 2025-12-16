-- Create memories table for the Memory Vault
CREATE TABLE public.memories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  memory_type TEXT NOT NULL DEFAULT 'general',
  emotion TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  memory_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL
);

-- Enable Row Level Security
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own memories" 
ON public.memories 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own memories" 
ON public.memories 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memories" 
ON public.memories 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memories" 
ON public.memories 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_memories_user_id ON public.memories(user_id);
CREATE INDEX idx_memories_memory_date ON public.memories(memory_date DESC);
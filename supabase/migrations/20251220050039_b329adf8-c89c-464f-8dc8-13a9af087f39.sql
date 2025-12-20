-- Create a new table for quick ideas/notes to deepen later
CREATE TABLE public.deepen_ideas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  note TEXT,
  source TEXT DEFAULT 'manual', -- 'manual' or 'coach'
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.deepen_ideas ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own ideas" 
ON public.deepen_ideas 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own ideas" 
ON public.deepen_ideas 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ideas" 
ON public.deepen_ideas 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ideas" 
ON public.deepen_ideas 
FOR DELETE 
USING (auth.uid() = user_id);

-- Allow service role to insert (for coach edge function)
CREATE POLICY "Service role can insert ideas" 
ON public.deepen_ideas 
FOR INSERT 
WITH CHECK (true);
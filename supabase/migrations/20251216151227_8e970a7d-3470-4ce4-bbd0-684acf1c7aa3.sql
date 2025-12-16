-- Add new columns to memories table for enhanced features
ALTER TABLE public.memories 
ADD COLUMN IF NOT EXISTS additional_thoughts TEXT,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS feeling_after TEXT,
ADD COLUMN IF NOT EXISTS needs_after TEXT[],
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create trigger for automatic timestamp updates on memories
CREATE TRIGGER update_memories_updated_at
BEFORE UPDATE ON public.memories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
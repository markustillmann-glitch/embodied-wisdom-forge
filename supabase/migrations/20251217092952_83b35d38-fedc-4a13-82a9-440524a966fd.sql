-- Add column to store memory book data as JSON
ALTER TABLE public.memories 
ADD COLUMN IF NOT EXISTS memory_book_data jsonb;
-- Add memory_book_data column to store generated book pages
ALTER TABLE public.memories 
ADD COLUMN IF NOT EXISTS memory_book_data JSONB DEFAULT NULL;
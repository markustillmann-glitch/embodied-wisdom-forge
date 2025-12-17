-- Add pdf_url column to memories table for storing exported PDF links
ALTER TABLE public.memories 
ADD COLUMN IF NOT EXISTS pdf_url text;

-- Create storage bucket for memory PDFs if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('memory-pdfs', 'memory-pdfs', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to memory-pdfs bucket
CREATE POLICY "Users can upload their own memory PDFs"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'memory-pdfs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public read access to memory PDFs
CREATE POLICY "Memory PDFs are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'memory-pdfs');

-- Allow users to update their own PDFs
CREATE POLICY "Users can update their own memory PDFs"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'memory-pdfs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own PDFs
CREATE POLICY "Users can delete their own memory PDFs"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'memory-pdfs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
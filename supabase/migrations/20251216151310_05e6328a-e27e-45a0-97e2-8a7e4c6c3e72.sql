-- Create storage bucket for memory images
INSERT INTO storage.buckets (id, name, public)
VALUES ('memory-images', 'memory-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own images
CREATE POLICY "Users can upload memory images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'memory-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to view their own images
CREATE POLICY "Users can view their memory images"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'memory-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to update their own images
CREATE POLICY "Users can update their memory images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'memory-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own images
CREATE POLICY "Users can delete their memory images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'memory-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Also allow public read access for displaying images
CREATE POLICY "Public can view memory images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'memory-images');
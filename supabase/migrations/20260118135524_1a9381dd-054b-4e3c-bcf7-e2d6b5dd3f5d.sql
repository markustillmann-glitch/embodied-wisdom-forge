-- Fix 1: Add SELECT policy for seminar_inquiries table (only admins can read)
CREATE POLICY "Only admins can view inquiries"
ON public.seminar_inquiries
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Fix 2: Make reflection-images bucket private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'reflection-images';

-- Fix 3: Drop the public SELECT policy for reflection-images
DROP POLICY IF EXISTS "Anyone can view reflection images" ON storage.objects;

-- Fix 4: Add authenticated-only SELECT policy for reflection-images
CREATE POLICY "Users can view their own reflection images"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'reflection-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
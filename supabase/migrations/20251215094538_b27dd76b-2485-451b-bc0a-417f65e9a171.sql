-- Create table for seminar contact inquiries
CREATE TABLE public.seminar_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  interest TEXT NOT NULL, -- 'schnupperabend', 'einfuehrung', 'jahresprogramm'
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.seminar_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert inquiries (public form)
CREATE POLICY "Anyone can submit an inquiry"
ON public.seminar_inquiries
FOR INSERT
WITH CHECK (true);

-- Only allow reading inquiries for admin purposes (can be restricted later)
CREATE POLICY "Allow reading inquiries"
ON public.seminar_inquiries
FOR SELECT
USING (true);
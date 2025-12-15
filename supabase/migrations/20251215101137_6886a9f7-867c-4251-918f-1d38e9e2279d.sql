-- Remove the public read policy that exposes customer contact data
-- Keep INSERT policy so public users can still submit inquiries
-- Only service_role will be able to read inquiries (via backend/admin tools)

DROP POLICY IF EXISTS "Allow reading inquiries" ON public.seminar_inquiries;
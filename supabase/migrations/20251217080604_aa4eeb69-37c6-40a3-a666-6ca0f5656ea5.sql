-- Drop the admin policy that allows viewing all conversations
DROP POLICY IF EXISTS "Admins can view all conversations" ON public.conversations;

-- Admins should only see their own conversations in the Coach (same as regular users)
-- The admin analytics dashboard uses service role for aggregate data anyway
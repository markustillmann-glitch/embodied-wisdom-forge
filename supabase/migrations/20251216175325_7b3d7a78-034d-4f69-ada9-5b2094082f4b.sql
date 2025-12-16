-- =====================================================
-- SECURITY HARDENING MIGRATION
-- =====================================================

-- 1. Remove any existing SELECT policies on seminar_inquiries (prevent data leak)
-- Note: There shouldn't be any, but let's be safe
DROP POLICY IF EXISTS "Anyone can view inquiries" ON public.seminar_inquiries;
DROP POLICY IF EXISTS "Public can view inquiries" ON public.seminar_inquiries;

-- 2. Add DELETE policy for messages (allow users to delete their own messages)
CREATE POLICY "Users can delete messages in their conversations" 
ON public.messages 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM conversations 
    WHERE conversations.id = messages.conversation_id 
    AND conversations.user_id = auth.uid()
  )
);

-- 3. Add DELETE policy for profiles (GDPR compliance - right to deletion)
CREATE POLICY "Users can delete their own profile" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = user_id);

-- 4. Create secure audit log table for tracking data access
CREATE TABLE IF NOT EXISTS public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  table_name text NOT NULL,
  record_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  ip_address text,
  user_agent text
);

-- Enable RLS on audit_log - only service role can access
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- No public policies - only service role can read/write audit logs
-- This ensures audit logs cannot be tampered with by users

-- 5. Create function to log sensitive data access (for edge functions to use)
CREATE OR REPLACE FUNCTION public.log_data_access(
  p_user_id uuid,
  p_action text,
  p_table_name text,
  p_record_id uuid DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.audit_log (user_id, action, table_name, record_id)
  VALUES (p_user_id, p_action, p_table_name, p_record_id);
END;
$$;

-- 6. Add index for faster audit log queries
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON public.audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_log_table_name ON public.audit_log(table_name);

-- 7. Create secure function to hash sensitive data for comparison (without exposing raw data)
CREATE OR REPLACE FUNCTION public.hash_sensitive_data(input_text text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT encode(sha256(input_text::bytea), 'hex')
$$;
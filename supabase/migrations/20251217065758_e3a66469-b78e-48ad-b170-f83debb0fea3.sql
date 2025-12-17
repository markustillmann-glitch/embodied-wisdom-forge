-- Add admin RLS policies to allow admins to view all user data

-- Admins can view all memories
CREATE POLICY "Admins can view all memories" 
ON public.memories 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can view all conversations
CREATE POLICY "Admins can view all conversations" 
ON public.conversations 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can view all messages
CREATE POLICY "Admins can view all messages" 
ON public.messages 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can view all token usage
CREATE POLICY "Admins can view all token usage" 
ON public.token_usage 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can view all coach insights
CREATE POLICY "Admins can view all coach insights" 
ON public.coach_insights 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));
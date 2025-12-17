-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policy: Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- RLS policy: Only admins can manage roles
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create anonymized analytics views for admin dashboard

-- Aggregated memory statistics (no user identifiers)
CREATE OR REPLACE VIEW public.analytics_memory_stats AS
SELECT 
    memory_type,
    emotion,
    COUNT(*) as count,
    DATE_TRUNC('day', created_at) as date
FROM public.memories
GROUP BY memory_type, emotion, DATE_TRUNC('day', created_at);

-- Aggregated conversation statistics
CREATE OR REPLACE VIEW public.analytics_conversation_stats AS
SELECT 
    DATE_TRUNC('day', created_at) as date,
    COUNT(*) as conversation_count
FROM public.conversations
GROUP BY DATE_TRUNC('day', created_at);

-- Aggregated message statistics
CREATE OR REPLACE VIEW public.analytics_message_stats AS
SELECT 
    role,
    DATE_TRUNC('day', created_at) as date,
    COUNT(*) as message_count,
    AVG(LENGTH(content)) as avg_message_length
FROM public.messages
GROUP BY role, DATE_TRUNC('day', created_at);

-- Aggregated token usage statistics
CREATE OR REPLACE VIEW public.analytics_token_stats AS
SELECT 
    function_name,
    model,
    DATE_TRUNC('day', created_at) as date,
    SUM(input_tokens) as total_input_tokens,
    SUM(output_tokens) as total_output_tokens,
    SUM(total_tokens) as total_tokens,
    SUM(estimated_cost_usd) as total_cost,
    COUNT(*) as call_count
FROM public.token_usage
GROUP BY function_name, model, DATE_TRUNC('day', created_at);

-- User engagement segments (anonymized)
CREATE OR REPLACE VIEW public.analytics_user_segments AS
SELECT 
    CASE 
        WHEN memory_count >= 20 THEN 'power_user'
        WHEN memory_count >= 5 THEN 'active_user'
        WHEN memory_count >= 1 THEN 'starter'
        ELSE 'inactive'
    END as segment,
    COUNT(*) as user_count
FROM (
    SELECT user_id, COUNT(*) as memory_count
    FROM public.memories
    GROUP BY user_id
) user_memories
GROUP BY segment;

-- Coach insights aggregation (anonymized patterns)
CREATE OR REPLACE VIEW public.analytics_insight_patterns AS
SELECT 
    insight_type,
    confidence_level,
    COUNT(*) as count
FROM public.coach_insights
GROUP BY insight_type, confidence_level;

-- Grant access to views only for authenticated users (will be filtered by admin check in app)
GRANT SELECT ON public.analytics_memory_stats TO authenticated;
GRANT SELECT ON public.analytics_conversation_stats TO authenticated;
GRANT SELECT ON public.analytics_message_stats TO authenticated;
GRANT SELECT ON public.analytics_token_stats TO authenticated;
GRANT SELECT ON public.analytics_user_segments TO authenticated;
GRANT SELECT ON public.analytics_insight_patterns TO authenticated;
-- Revoke public SELECT access from analytics views (restrict to admins only)
REVOKE SELECT ON public.analytics_memory_stats FROM authenticated;
REVOKE SELECT ON public.analytics_conversation_stats FROM authenticated;
REVOKE SELECT ON public.analytics_message_stats FROM authenticated;
REVOKE SELECT ON public.analytics_token_stats FROM authenticated;
REVOKE SELECT ON public.analytics_user_segments FROM authenticated;
REVOKE SELECT ON public.analytics_insight_patterns FROM authenticated;

-- Grant access only to admins via a security definer function
-- The has_role function already exists, so we use it in RLS-like access control

-- Note: Views in PostgreSQL don't support RLS directly in older versions
-- Instead, we create wrapper functions that check admin status

-- Create secure function to get analytics data (admin only)
CREATE OR REPLACE FUNCTION public.get_analytics_memory_stats()
RETURNS TABLE(
  memory_type text,
  date timestamptz,
  count bigint,
  emotion text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;
  
  RETURN QUERY SELECT * FROM analytics_memory_stats;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_analytics_conversation_stats()
RETURNS TABLE(
  conversation_count bigint,
  date timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;
  
  RETURN QUERY SELECT * FROM analytics_conversation_stats;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_analytics_message_stats()
RETURNS TABLE(
  avg_message_length numeric,
  date timestamptz,
  role text,
  message_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;
  
  RETURN QUERY SELECT * FROM analytics_message_stats;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_analytics_token_stats()
RETURNS TABLE(
  call_count bigint,
  total_cost numeric,
  total_tokens bigint,
  total_output_tokens bigint,
  model text,
  function_name text,
  date timestamptz,
  total_input_tokens bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;
  
  RETURN QUERY SELECT * FROM analytics_token_stats;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_analytics_user_segments()
RETURNS TABLE(
  user_count bigint,
  segment text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;
  
  RETURN QUERY SELECT * FROM analytics_user_segments;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_analytics_insight_patterns()
RETURNS TABLE(
  confidence_level text,
  insight_type text,
  count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;
  
  RETURN QUERY SELECT * FROM analytics_insight_patterns;
END;
$$;
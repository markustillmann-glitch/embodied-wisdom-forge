-- Drop all existing analytics functions first
DROP FUNCTION IF EXISTS public.get_analytics_memory_stats();
DROP FUNCTION IF EXISTS public.get_analytics_conversation_stats();
DROP FUNCTION IF EXISTS public.get_analytics_message_stats();
DROP FUNCTION IF EXISTS public.get_analytics_token_stats();
DROP FUNCTION IF EXISTS public.get_analytics_user_segments();
DROP FUNCTION IF EXISTS public.get_analytics_insight_patterns();

-- Recreate get_analytics_memory_stats with correct column order matching the view
CREATE FUNCTION public.get_analytics_memory_stats()
RETURNS TABLE(
  count bigint,
  date timestamp with time zone,
  emotion text,
  memory_type text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;
  
  RETURN QUERY 
  SELECT 
    v.count,
    v.date,
    v.emotion,
    v.memory_type
  FROM analytics_memory_stats v;
END;
$$;

-- Recreate get_analytics_conversation_stats
CREATE FUNCTION public.get_analytics_conversation_stats()
RETURNS TABLE(
  conversation_count bigint,
  date timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;
  
  RETURN QUERY 
  SELECT 
    v.conversation_count,
    v.date
  FROM analytics_conversation_stats v;
END;
$$;

-- Recreate get_analytics_message_stats
CREATE FUNCTION public.get_analytics_message_stats()
RETURNS TABLE(
  avg_message_length numeric,
  date timestamp with time zone,
  message_count bigint,
  role text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;
  
  RETURN QUERY 
  SELECT 
    v.avg_message_length,
    v.date,
    v.message_count,
    v.role
  FROM analytics_message_stats v;
END;
$$;

-- Recreate get_analytics_token_stats
CREATE FUNCTION public.get_analytics_token_stats()
RETURNS TABLE(
  call_count bigint,
  date timestamp with time zone,
  function_name text,
  model text,
  total_cost numeric,
  total_input_tokens bigint,
  total_output_tokens bigint,
  total_tokens bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;
  
  RETURN QUERY 
  SELECT 
    v.call_count,
    v.date,
    v.function_name,
    v.model,
    v.total_cost,
    v.total_input_tokens,
    v.total_output_tokens,
    v.total_tokens
  FROM analytics_token_stats v;
END;
$$;

-- Recreate get_analytics_user_segments
CREATE FUNCTION public.get_analytics_user_segments()
RETURNS TABLE(
  segment text,
  user_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;
  
  RETURN QUERY 
  SELECT 
    v.segment,
    v.user_count
  FROM analytics_user_segments v;
END;
$$;

-- Recreate get_analytics_insight_patterns
CREATE FUNCTION public.get_analytics_insight_patterns()
RETURNS TABLE(
  confidence_level text,
  count bigint,
  insight_type text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;
  
  RETURN QUERY 
  SELECT 
    v.confidence_level,
    v.count,
    v.insight_type
  FROM analytics_insight_patterns v;
END;
$$;
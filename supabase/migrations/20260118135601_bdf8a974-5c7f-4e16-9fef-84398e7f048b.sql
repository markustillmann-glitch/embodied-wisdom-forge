-- Fix Security Definer View issues by recreating views with SECURITY INVOKER

-- Drop and recreate analytics_conversation_stats with security_invoker
DROP VIEW IF EXISTS public.analytics_conversation_stats;
CREATE VIEW public.analytics_conversation_stats 
WITH (security_invoker=on) AS
SELECT 
  date_trunc('day'::text, created_at) AS date,
  count(*) AS conversation_count
FROM conversations
GROUP BY (date_trunc('day'::text, created_at));

-- Drop and recreate analytics_insight_patterns with security_invoker
DROP VIEW IF EXISTS public.analytics_insight_patterns;
CREATE VIEW public.analytics_insight_patterns 
WITH (security_invoker=on) AS
SELECT 
  insight_type,
  confidence_level,
  count(*) AS count
FROM coach_insights
GROUP BY insight_type, confidence_level;

-- Drop and recreate analytics_memory_stats with security_invoker
DROP VIEW IF EXISTS public.analytics_memory_stats;
CREATE VIEW public.analytics_memory_stats 
WITH (security_invoker=on) AS
SELECT 
  memory_type,
  emotion,
  count(*) AS count,
  date_trunc('day'::text, created_at) AS date
FROM memories
GROUP BY memory_type, emotion, (date_trunc('day'::text, created_at));

-- Drop and recreate analytics_message_stats with security_invoker
DROP VIEW IF EXISTS public.analytics_message_stats;
CREATE VIEW public.analytics_message_stats 
WITH (security_invoker=on) AS
SELECT 
  role,
  date_trunc('day'::text, created_at) AS date,
  count(*) AS message_count,
  avg(length(content)) AS avg_message_length
FROM messages
GROUP BY role, (date_trunc('day'::text, created_at));

-- Drop and recreate analytics_token_stats with security_invoker
DROP VIEW IF EXISTS public.analytics_token_stats;
CREATE VIEW public.analytics_token_stats 
WITH (security_invoker=on) AS
SELECT 
  function_name,
  model,
  date_trunc('day'::text, created_at) AS date,
  sum(input_tokens) AS total_input_tokens,
  sum(output_tokens) AS total_output_tokens,
  sum(total_tokens) AS total_tokens,
  sum(estimated_cost_usd) AS total_cost,
  count(*) AS call_count
FROM token_usage
GROUP BY function_name, model, (date_trunc('day'::text, created_at));

-- Drop and recreate analytics_user_segments with security_invoker
DROP VIEW IF EXISTS public.analytics_user_segments;
CREATE VIEW public.analytics_user_segments 
WITH (security_invoker=on) AS
SELECT
  CASE
    WHEN (memory_count >= 20) THEN 'power_user'::text
    WHEN (memory_count >= 5) THEN 'active_user'::text
    WHEN (memory_count >= 1) THEN 'starter'::text
    ELSE 'inactive'::text
  END AS segment,
  count(*) AS user_count
FROM (
  SELECT 
    memories.user_id,
    count(*) AS memory_count
  FROM memories
  GROUP BY memories.user_id
) user_memories
GROUP BY
  CASE
    WHEN (memory_count >= 20) THEN 'power_user'::text
    WHEN (memory_count >= 5) THEN 'active_user'::text
    WHEN (memory_count >= 1) THEN 'starter'::text
    ELSE 'inactive'::text
  END;
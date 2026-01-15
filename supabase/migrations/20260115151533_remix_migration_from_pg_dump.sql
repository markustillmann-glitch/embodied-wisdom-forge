CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
BEGIN;

--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'admin',
    'moderator',
    'user'
);


--
-- Name: get_analytics_conversation_stats(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_analytics_conversation_stats() RETURNS TABLE(conversation_count bigint, date timestamp with time zone)
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- Name: get_analytics_insight_patterns(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_analytics_insight_patterns() RETURNS TABLE(confidence_level text, count bigint, insight_type text)
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- Name: get_analytics_memory_stats(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_analytics_memory_stats() RETURNS TABLE(count bigint, date timestamp with time zone, emotion text, memory_type text)
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- Name: get_analytics_message_stats(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_analytics_message_stats() RETURNS TABLE(avg_message_length numeric, date timestamp with time zone, message_count bigint, role text)
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- Name: get_analytics_token_stats(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_analytics_token_stats() RETURNS TABLE(call_count bigint, date timestamp with time zone, function_name text, model text, total_cost numeric, total_input_tokens bigint, total_output_tokens bigint, total_tokens bigint)
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- Name: get_analytics_user_segments(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_analytics_user_segments() RETURNS TABLE(segment text, user_count bigint)
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'display_name');
  RETURN new;
END;
$$;


--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;


--
-- Name: hash_sensitive_data(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.hash_sensitive_data(input_text text) RETURNS text
    LANGUAGE sql IMMUTABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT encode(sha256(input_text::bytea), 'hex')
$$;


--
-- Name: log_data_access(uuid, text, text, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.log_data_access(p_user_id uuid, p_action text, p_table_name text, p_record_id uuid DEFAULT NULL::uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.audit_log (user_id, action, table_name, record_id)
  VALUES (p_user_id, p_action, p_table_name, p_record_id);
END;
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: conversations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conversations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    title text DEFAULT 'Neue Unterhaltung'::text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: analytics_conversation_stats; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.analytics_conversation_stats AS
 SELECT date_trunc('day'::text, created_at) AS date,
    count(*) AS conversation_count
   FROM public.conversations
  GROUP BY (date_trunc('day'::text, created_at));


--
-- Name: coach_insights; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coach_insights (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    insight_type text NOT NULL,
    insight_hash text NOT NULL,
    insight_content text NOT NULL,
    confidence_level text DEFAULT 'emerging'::text,
    observation_count integer DEFAULT 1,
    last_observed_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: analytics_insight_patterns; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.analytics_insight_patterns AS
 SELECT insight_type,
    confidence_level,
    count(*) AS count
   FROM public.coach_insights
  GROUP BY insight_type, confidence_level;


--
-- Name: memories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.memories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    title text NOT NULL,
    summary text,
    content text NOT NULL,
    memory_type text DEFAULT 'general'::text NOT NULL,
    emotion text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    memory_date timestamp with time zone DEFAULT now(),
    conversation_id uuid,
    additional_thoughts text,
    image_url text,
    feeling_after text[],
    needs_after text[],
    updated_at timestamp with time zone DEFAULT now(),
    memory_book_data jsonb,
    pdf_url text
);


--
-- Name: analytics_memory_stats; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.analytics_memory_stats AS
 SELECT memory_type,
    emotion,
    count(*) AS count,
    date_trunc('day'::text, created_at) AS date
   FROM public.memories
  GROUP BY memory_type, emotion, (date_trunc('day'::text, created_at));


--
-- Name: messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    conversation_id uuid NOT NULL,
    role text NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT messages_role_check CHECK ((role = ANY (ARRAY['user'::text, 'assistant'::text])))
);


--
-- Name: analytics_message_stats; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.analytics_message_stats AS
 SELECT role,
    date_trunc('day'::text, created_at) AS date,
    count(*) AS message_count,
    avg(length(content)) AS avg_message_length
   FROM public.messages
  GROUP BY role, (date_trunc('day'::text, created_at));


--
-- Name: token_usage; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.token_usage (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    function_name text NOT NULL,
    model text,
    input_tokens integer DEFAULT 0 NOT NULL,
    output_tokens integer DEFAULT 0 NOT NULL,
    total_tokens integer DEFAULT 0 NOT NULL,
    estimated_cost_usd numeric(10,6) DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: analytics_token_stats; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.analytics_token_stats AS
 SELECT function_name,
    model,
    date_trunc('day'::text, created_at) AS date,
    sum(input_tokens) AS total_input_tokens,
    sum(output_tokens) AS total_output_tokens,
    sum(total_tokens) AS total_tokens,
    sum(estimated_cost_usd) AS total_cost,
    count(*) AS call_count
   FROM public.token_usage
  GROUP BY function_name, model, (date_trunc('day'::text, created_at));


--
-- Name: analytics_user_segments; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.analytics_user_segments AS
 SELECT
        CASE
            WHEN (memory_count >= 20) THEN 'power_user'::text
            WHEN (memory_count >= 5) THEN 'active_user'::text
            WHEN (memory_count >= 1) THEN 'starter'::text
            ELSE 'inactive'::text
        END AS segment,
    count(*) AS user_count
   FROM ( SELECT memories.user_id,
            count(*) AS memory_count
           FROM public.memories
          GROUP BY memories.user_id) user_memories
  GROUP BY
        CASE
            WHEN (memory_count >= 20) THEN 'power_user'::text
            WHEN (memory_count >= 5) THEN 'active_user'::text
            WHEN (memory_count >= 1) THEN 'starter'::text
            ELSE 'inactive'::text
        END;


--
-- Name: audit_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    action text NOT NULL,
    table_name text NOT NULL,
    record_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    ip_address text,
    user_agent text
);


--
-- Name: deepen_ideas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.deepen_ideas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    title text NOT NULL,
    note text,
    source text DEFAULT 'manual'::text,
    conversation_id uuid,
    is_completed boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    completed_at timestamp with time zone
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    display_name text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: seminar_inquiries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.seminar_inquiries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    interest text NOT NULL,
    message text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: statement_reflections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.statement_reflections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    statement text NOT NULL,
    category text NOT NULL,
    conversation_content text,
    emotional_response text,
    difficulty_level integer,
    insights text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT statement_reflections_category_check CHECK ((category = ANY (ARRAY['selfcare'::text, 'gfk'::text, 'ifs'::text]))),
    CONSTRAINT statement_reflections_difficulty_level_check CHECK (((difficulty_level >= 1) AND (difficulty_level <= 5)))
);


--
-- Name: user_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    photo_url text,
    goals_motivation text,
    biggest_challenges text,
    safety_feeling text,
    overwhelm_signals text,
    nervous_system_tempo text,
    core_needs text[],
    neglected_needs text[],
    over_fulfilled_needs text[],
    belonging_through text[],
    reaction_to_expectations text,
    harder_closeness_or_boundaries text,
    primary_memory_channel text[],
    memory_effect text,
    trigger_sensitivity text,
    when_feels_light text,
    when_depth_nourishing text,
    when_depth_burdening text,
    lightness_depth_balance text,
    preferred_tone text[],
    response_preference text[],
    language_triggers text[],
    life_phase text,
    energy_level text,
    current_focus text[],
    vault_password_hash text,
    coach_tonality text DEFAULT 'warm'::text,
    interpretation_style text DEFAULT 'neutral'::text,
    praise_level text DEFAULT 'moderate'::text,
    safe_places text[] DEFAULT '{}'::text[],
    power_sources text[] DEFAULT '{}'::text[],
    body_anchors text[] DEFAULT '{}'::text[],
    self_qualities text[] DEFAULT '{}'::text[],
    resource_onboarding_completed boolean DEFAULT false,
    CONSTRAINT user_profiles_belonging_through_check CHECK ((belonging_through <@ ARRAY['similarity'::text, 'acceptance_of_difference'::text, 'achievement'::text])),
    CONSTRAINT user_profiles_current_focus_check CHECK ((current_focus <@ ARRAY['self'::text, 'relationship'::text, 'meaning_direction'::text])),
    CONSTRAINT user_profiles_energy_level_check CHECK ((energy_level = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text]))),
    CONSTRAINT user_profiles_harder_closeness_or_boundaries_check CHECK ((harder_closeness_or_boundaries = ANY (ARRAY['closeness'::text, 'boundaries'::text, 'both'::text]))),
    CONSTRAINT user_profiles_life_phase_check CHECK ((life_phase = ANY (ARRAY['stabilization'::text, 'integration'::text, 'opening'::text, 'transition'::text]))),
    CONSTRAINT user_profiles_lightness_depth_balance_check CHECK ((lightness_depth_balance = ANY (ARRAY['more_lightness'::text, 'more_depth'::text, 'balanced'::text]))),
    CONSTRAINT user_profiles_memory_effect_check CHECK ((memory_effect = ANY (ARRAY['regulating'::text, 'intensifying'::text, 'melancholic'::text]))),
    CONSTRAINT user_profiles_nervous_system_tempo_check CHECK ((nervous_system_tempo = ANY (ARRAY['calm'::text, 'varying'::text, 'high_active'::text]))),
    CONSTRAINT user_profiles_preferred_tone_check CHECK ((preferred_tone <@ ARRAY['calm'::text, 'poetic'::text, 'clear'::text, 'analytical'::text, 'questioning'::text])),
    CONSTRAINT user_profiles_primary_memory_channel_check CHECK ((primary_memory_channel <@ ARRAY['body'::text, 'music'::text, 'images'::text, 'language'::text, 'places'::text])),
    CONSTRAINT user_profiles_response_preference_check CHECK ((response_preference <@ ARRAY['direct_recommendations'::text, 'open_questions'::text, 'reflections'::text])),
    CONSTRAINT user_profiles_trigger_sensitivity_check CHECK ((trigger_sensitivity = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text])))
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: audit_log audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_pkey PRIMARY KEY (id);


--
-- Name: coach_insights coach_insights_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coach_insights
    ADD CONSTRAINT coach_insights_pkey PRIMARY KEY (id);


--
-- Name: conversations conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (id);


--
-- Name: deepen_ideas deepen_ideas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deepen_ideas
    ADD CONSTRAINT deepen_ideas_pkey PRIMARY KEY (id);


--
-- Name: memories memories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.memories
    ADD CONSTRAINT memories_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);


--
-- Name: seminar_inquiries seminar_inquiries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seminar_inquiries
    ADD CONSTRAINT seminar_inquiries_pkey PRIMARY KEY (id);


--
-- Name: statement_reflections statement_reflections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.statement_reflections
    ADD CONSTRAINT statement_reflections_pkey PRIMARY KEY (id);


--
-- Name: token_usage token_usage_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token_usage
    ADD CONSTRAINT token_usage_pkey PRIMARY KEY (id);


--
-- Name: user_profiles user_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (id);


--
-- Name: user_profiles user_profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_user_id_key UNIQUE (user_id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: idx_audit_log_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_log_created_at ON public.audit_log USING btree (created_at);


--
-- Name: idx_audit_log_table_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_log_table_name ON public.audit_log USING btree (table_name);


--
-- Name: idx_audit_log_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_log_user_id ON public.audit_log USING btree (user_id);


--
-- Name: idx_coach_insights_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_coach_insights_type ON public.coach_insights USING btree (insight_type);


--
-- Name: idx_coach_insights_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_coach_insights_user_id ON public.coach_insights USING btree (user_id);


--
-- Name: idx_memories_memory_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_memories_memory_date ON public.memories USING btree (memory_date DESC);


--
-- Name: idx_memories_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_memories_user_id ON public.memories USING btree (user_id);


--
-- Name: idx_statement_reflections_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_statement_reflections_category ON public.statement_reflections USING btree (category);


--
-- Name: idx_statement_reflections_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_statement_reflections_user_id ON public.statement_reflections USING btree (user_id);


--
-- Name: idx_token_usage_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_token_usage_created_at ON public.token_usage USING btree (created_at);


--
-- Name: idx_token_usage_function_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_token_usage_function_name ON public.token_usage USING btree (function_name);


--
-- Name: idx_token_usage_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_token_usage_user_id ON public.token_usage USING btree (user_id);


--
-- Name: coach_insights update_coach_insights_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_coach_insights_updated_at BEFORE UPDATE ON public.coach_insights FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: conversations update_conversations_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: memories update_memories_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_memories_updated_at BEFORE UPDATE ON public.memories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: user_profiles update_user_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: audit_log audit_log_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: conversations conversations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: deepen_ideas deepen_ideas_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deepen_ideas
    ADD CONSTRAINT deepen_ideas_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE SET NULL;


--
-- Name: memories memories_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.memories
    ADD CONSTRAINT memories_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE SET NULL;


--
-- Name: messages messages_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: token_usage token_usage_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token_usage
    ADD CONSTRAINT token_usage_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_roles Admins can manage all roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all roles" ON public.user_roles USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: coach_insights Admins can view all coach insights; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all coach insights" ON public.coach_insights FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: memories Admins can view all memories; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all memories" ON public.memories FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: messages Admins can view all messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all messages" ON public.messages FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: token_usage Admins can view all token usage; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all token usage" ON public.token_usage FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: seminar_inquiries Anyone can submit an inquiry; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can submit an inquiry" ON public.seminar_inquiries FOR INSERT WITH CHECK (true);


--
-- Name: deepen_ideas Service role can insert ideas; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role can insert ideas" ON public.deepen_ideas FOR INSERT WITH CHECK (true);


--
-- Name: token_usage Service role can insert token usage; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role can insert token usage" ON public.token_usage FOR INSERT WITH CHECK (true);


--
-- Name: messages Users can create messages in their conversations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create messages in their conversations" ON public.messages FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.conversations
  WHERE ((conversations.id = messages.conversation_id) AND (conversations.user_id = auth.uid())))));


--
-- Name: conversations Users can create their own conversations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own conversations" ON public.conversations FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: deepen_ideas Users can create their own ideas; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own ideas" ON public.deepen_ideas FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: coach_insights Users can create their own insights; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own insights" ON public.coach_insights FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: memories Users can create their own memories; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own memories" ON public.memories FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_profiles Users can create their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own profile" ON public.user_profiles FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: statement_reflections Users can create their own reflections; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own reflections" ON public.statement_reflections FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: messages Users can delete messages in their conversations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete messages in their conversations" ON public.messages FOR DELETE USING ((EXISTS ( SELECT 1
   FROM public.conversations
  WHERE ((conversations.id = messages.conversation_id) AND (conversations.user_id = auth.uid())))));


--
-- Name: conversations Users can delete their own conversations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own conversations" ON public.conversations FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: deepen_ideas Users can delete their own ideas; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own ideas" ON public.deepen_ideas FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: coach_insights Users can delete their own insights; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own insights" ON public.coach_insights FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: memories Users can delete their own memories; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own memories" ON public.memories FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can delete their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own profile" ON public.profiles FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: user_profiles Users can delete their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own profile" ON public.user_profiles FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: statement_reflections Users can delete their own reflections; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own reflections" ON public.statement_reflections FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can insert their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: conversations Users can update their own conversations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own conversations" ON public.conversations FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: deepen_ideas Users can update their own ideas; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own ideas" ON public.deepen_ideas FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: coach_insights Users can update their own insights; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own insights" ON public.coach_insights FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: memories Users can update their own memories; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own memories" ON public.memories FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: user_profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own profile" ON public.user_profiles FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: statement_reflections Users can update their own reflections; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own reflections" ON public.statement_reflections FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: messages Users can view messages in their conversations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view messages in their conversations" ON public.messages FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.conversations
  WHERE ((conversations.id = messages.conversation_id) AND (conversations.user_id = auth.uid())))));


--
-- Name: conversations Users can view their own conversations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own conversations" ON public.conversations FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: deepen_ideas Users can view their own ideas; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own ideas" ON public.deepen_ideas FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: coach_insights Users can view their own insights; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own insights" ON public.coach_insights FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: memories Users can view their own memories; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own memories" ON public.memories FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: profiles Users can view their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_profiles Users can view their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own profile" ON public.user_profiles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: statement_reflections Users can view their own reflections; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own reflections" ON public.statement_reflections FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_roles Users can view their own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: token_usage Users can view their own token usage; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own token usage" ON public.token_usage FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: audit_log; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

--
-- Name: coach_insights; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.coach_insights ENABLE ROW LEVEL SECURITY;

--
-- Name: conversations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

--
-- Name: deepen_ideas; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.deepen_ideas ENABLE ROW LEVEL SECURITY;

--
-- Name: memories; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: seminar_inquiries; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.seminar_inquiries ENABLE ROW LEVEL SECURITY;

--
-- Name: statement_reflections; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.statement_reflections ENABLE ROW LEVEL SECURITY;

--
-- Name: token_usage; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.token_usage ENABLE ROW LEVEL SECURITY;

--
-- Name: user_profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--




COMMIT;
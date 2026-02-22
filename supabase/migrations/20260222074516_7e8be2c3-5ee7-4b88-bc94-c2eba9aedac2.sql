
-- Add column to store AI analysis results for IFS parts
ALTER TABLE public.ifs_parts
ADD COLUMN ai_analysis jsonb DEFAULT NULL;

COMMENT ON COLUMN public.ifs_parts.ai_analysis IS 'Stores AI-generated analysis including classification, inconsistencies, questions, and strategies';

-- Add structured summary fields to memories table for Oria-based summaries
ALTER TABLE public.memories 
ADD COLUMN IF NOT EXISTS structured_summary JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS location TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS summary_requested BOOLEAN DEFAULT FALSE;

-- Add comment explaining the structured_summary field
COMMENT ON COLUMN public.memories.structured_summary IS 'Contains Oria-model based analysis: patterns, needs, body_areas, parts, insights, recommendations';
COMMENT ON COLUMN public.memories.location IS 'User provided location where reflection took place';
COMMENT ON COLUMN public.memories.summary_requested IS 'Whether user requested a detailed summary';
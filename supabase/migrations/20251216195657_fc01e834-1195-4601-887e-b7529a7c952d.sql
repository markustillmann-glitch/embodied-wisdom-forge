-- Change feeling_after from single text to array of texts
ALTER TABLE public.memories 
ALTER COLUMN feeling_after TYPE text[] 
USING CASE 
  WHEN feeling_after IS NOT NULL THEN ARRAY[feeling_after]
  ELSE NULL
END;
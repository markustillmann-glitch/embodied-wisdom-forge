-- Add missing INSERT policy for coach_insights
CREATE POLICY "Users can create their own insights"
ON public.coach_insights
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Add UPDATE policy
CREATE POLICY "Users can update their own insights"
ON public.coach_insights
FOR UPDATE
USING (auth.uid() = user_id);

-- Add DELETE policy  
CREATE POLICY "Users can delete their own insights"
ON public.coach_insights
FOR DELETE
USING (auth.uid() = user_id);

-- Drop the overly broad "Service role" policy as it's redundant
DROP POLICY IF EXISTS "Service role can manage insights" ON public.coach_insights;
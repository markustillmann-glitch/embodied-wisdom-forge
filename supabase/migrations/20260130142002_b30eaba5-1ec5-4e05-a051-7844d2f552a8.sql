-- Update trigger function to give all new users permanent premium (no trial end)
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Create a permanent premium subscription for new users
  INSERT INTO public.user_subscriptions (
    user_id, 
    tier, 
    active_packs, 
    period_start_date, 
    impulses_used_this_period,
    trial_ends_at
  )
  VALUES (
    NEW.id,
    'premium',
    ARRAY['basis', 'musik', 'reisen', 'natur', 'beziehungen', 'kreativitaet'],
    CURRENT_DATE,
    0,
    NULL  -- No trial end = permanent premium
  );
  
  RETURN NEW;
END;
$function$;

-- Update all existing users to permanent premium
UPDATE public.user_subscriptions 
SET tier = 'premium',
    trial_ends_at = NULL,
    active_packs = ARRAY['basis', 'musik', 'reisen', 'natur', 'beziehungen', 'kreativitaet'];
-- Add trial_ends_at column to track premium trial expiration
ALTER TABLE public.user_subscriptions 
ADD COLUMN trial_ends_at timestamp with time zone;

-- Create function to handle new user signup with premium trial
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create a premium subscription with 7-day trial for new users
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
    NOW() + INTERVAL '7 days'
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users for new signups
CREATE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_subscription();
-- Add vault_password_hash column to user_profiles for secure password storage
ALTER TABLE public.user_profiles 
ADD COLUMN vault_password_hash text;
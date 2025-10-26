/*
  # Auto-create Profile on User Signup

  This migration creates a trigger that automatically creates a profile
  whenever a new user signs up through auth.

  ## Changes
  1. Create function to handle new user signup
  2. Create trigger on auth.users insert
  3. This ensures every new user gets a profile automatically

  ## Important
  This fixes the issue where users couldn't login after signup
  because their profile wasn't created.
*/

-- Function to create profile for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, plan, status, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    'starter',
    'active',
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to auto-create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Add comment
COMMENT ON FUNCTION public.handle_new_user IS 'Automatically creates a profile when a user signs up';

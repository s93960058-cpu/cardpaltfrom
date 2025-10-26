/*
  # Fix Admin Policies with is_admin column

  1. Changes
    - Add is_admin column to profiles table
    - Update the admin user (shay053713@gmail.com) to be admin
    - Fix RLS policies to use is_admin instead of querying auth.users

  2. Security
    - Only users with is_admin = true can access all profiles
    - Regular users can still only access their own profile
*/

-- Add is_admin column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_admin boolean DEFAULT false NOT NULL;
  END IF;
END $$;

-- Set shay053713@gmail.com as admin
UPDATE profiles
SET is_admin = true
WHERE email = 'shay053713@gmail.com';

-- Drop old policies
DROP POLICY IF EXISTS "Users can view own profile or admin can view all" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile or admin can update any" ON profiles;

-- Create new policies using is_admin column
CREATE POLICY "Users can view own profile or admin can view all"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id
    OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Users can update own profile or admin can update any"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id
    OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  )
  WITH CHECK (
    auth.uid() = id
    OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

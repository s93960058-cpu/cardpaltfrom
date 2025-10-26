/*
  # Add Admin Policies for User Management

  1. New Policies
    - Allow admin users to view all profiles
    - Allow admin users to update any profile (for plan/status changes)

  2. Security
    - Only users with email 'shay053713@gmail.com' can access all profiles
    - Regular users can still only access their own profile
*/

-- Drop existing restrictive policies if needed and recreate with admin access
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Allow users to view own profile OR admin to view all
CREATE POLICY "Users can view own profile or admin can view all"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id
    OR
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'shay053713@gmail.com'
  );

-- Allow users to update own profile OR admin to update any
CREATE POLICY "Users can update own profile or admin can update any"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id
    OR
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'shay053713@gmail.com'
  )
  WITH CHECK (
    auth.uid() = id
    OR
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'shay053713@gmail.com'
  );

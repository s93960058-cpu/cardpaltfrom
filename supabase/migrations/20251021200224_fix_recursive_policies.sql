/*
  # Fix Recursive RLS Policies

  1. Problem
    - RLS policies were causing infinite recursion by checking `profiles.is_admin` 
      within the profiles table's own policies
    - This creates a circular dependency that breaks database queries

  2. Solution
    - Remove admin checks from RLS policies that cause recursion
    - Use simple, direct policies based only on auth.uid()
    - Keep policies secure but avoid circular dependencies

  3. Changes
    - Drop all existing policies on profiles, business_profiles, and cards
    - Recreate simple, non-recursive policies
    - Maintain security while eliminating infinite recursion
*/

-- Drop all existing policies that cause recursion
DROP POLICY IF EXISTS "select_own_profile" ON profiles;
DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
DROP POLICY IF EXISTS "update_own_profile" ON profiles;

DROP POLICY IF EXISTS "select_own_business" ON business_profiles;
DROP POLICY IF EXISTS "insert_own_business" ON business_profiles;
DROP POLICY IF EXISTS "update_own_business" ON business_profiles;
DROP POLICY IF EXISTS "delete_own_business" ON business_profiles;

DROP POLICY IF EXISTS "select_published_cards" ON cards;
DROP POLICY IF EXISTS "insert_own_card" ON cards;
DROP POLICY IF EXISTS "update_own_card" ON cards;
DROP POLICY IF EXISTS "delete_own_card" ON cards;

-- Create simple, non-recursive policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create simple policies for business_profiles
CREATE POLICY "Users can view own business"
  ON business_profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own business"
  ON business_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own business"
  ON business_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own business"
  ON business_profiles FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create simple policies for cards
CREATE POLICY "Anyone can view published cards"
  ON cards FOR SELECT
  TO public
  USING (is_published = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert own cards"
  ON cards FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own cards"
  ON cards FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own cards"
  ON cards FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

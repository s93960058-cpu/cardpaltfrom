/*
  # Add Admin Policies for All Tables

  1. Changes
    - Add admin policies to all tables so admins can view all data
    - Keep existing user policies intact

  2. Security
    - Only users with is_admin = true can access all data
    - Regular users maintain their existing access patterns
*/

-- Cards policies
DROP POLICY IF EXISTS "Admin can view all cards" ON cards;
CREATE POLICY "Admin can view all cards"
  ON cards FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Orders policies
DROP POLICY IF EXISTS "Admin can view all orders" ON orders;
CREATE POLICY "Admin can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Reviews policies
DROP POLICY IF EXISTS "Admin can view all reviews" ON reviews;
CREATE POLICY "Admin can view all reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Products policies
DROP POLICY IF EXISTS "Admin can view all products" ON products;
CREATE POLICY "Admin can view all products"
  ON products FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Gallery items policies
DROP POLICY IF EXISTS "Admin can view all gallery items" ON gallery_items;
CREATE POLICY "Admin can view all gallery items"
  ON gallery_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Business profiles policies
DROP POLICY IF EXISTS "Admin can view all business profiles" ON business_profiles;
CREATE POLICY "Admin can view all business profiles"
  ON business_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Coupons policies
DROP POLICY IF EXISTS "Admin can view all coupons" ON coupons;
CREATE POLICY "Admin can view all coupons"
  ON coupons FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Events analytics policies
DROP POLICY IF EXISTS "Admin can view all events" ON events_analytics;
CREATE POLICY "Admin can view all events"
  ON events_analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

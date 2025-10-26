/*
  # Add Full Admin Access to All Tables

  1. Problem
    - Admin users cannot see all data even with is_admin = true
    - Current policies only allow users to see their own data

  2. Solution
    - Add admin bypass to all SELECT policies
    - Check is_admin flag in profiles table

  3. Security
    - Only users with is_admin = true can view all data
    - Regular users still restricted to their own data
*/

-- PROFILES: Admin can see all
DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id 
    OR 
    (SELECT is_admin FROM profiles WHERE id = auth.uid() LIMIT 1) = true
  );

-- BUSINESS PROFILES: Admin can see all
DROP POLICY IF EXISTS "select_own_business" ON business_profiles;
CREATE POLICY "select_own_business"
  ON business_profiles FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR
    (SELECT is_admin FROM profiles WHERE id = auth.uid() LIMIT 1) = true
  );

-- CARDS: Admin can see all
DROP POLICY IF EXISTS "select_published_cards" ON cards;
CREATE POLICY "select_published_cards"
  ON cards FOR SELECT
  USING (
    is_published = true 
    OR 
    auth.uid() = user_id
    OR
    (SELECT is_admin FROM profiles WHERE id = auth.uid() LIMIT 1) = true
  );

-- ORDERS: Admin can see all
DROP POLICY IF EXISTS "select_own_orders" ON orders;
CREATE POLICY "select_own_orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR
    (SELECT is_admin FROM profiles WHERE id = auth.uid() LIMIT 1) = true
  );

-- COUPONS: Admin can see all
DROP POLICY IF EXISTS "select_active_coupons" ON coupons;
CREATE POLICY "select_active_coupons"
  ON coupons FOR SELECT
  TO authenticated
  USING (
    (is_active = true AND ends_at > now())
    OR
    (SELECT is_admin FROM profiles WHERE id = auth.uid() LIMIT 1) = true
  );

-- REVIEWS: Admin can see all
DROP POLICY IF EXISTS "select_approved_reviews" ON reviews;
CREATE POLICY "select_approved_reviews"
  ON reviews FOR SELECT
  USING (
    is_approved = true
    OR
    (SELECT is_admin FROM profiles WHERE id = auth.uid() LIMIT 1) = true
  );

-- PRODUCTS: Admin can see all
DROP POLICY IF EXISTS "select_available_products" ON products;
CREATE POLICY "select_available_products"
  ON products FOR SELECT
  USING (
    is_available = true
    OR
    (SELECT is_admin FROM profiles WHERE id = auth.uid() LIMIT 1) = true
  );

-- GALLERY ITEMS: Admin can see all
DROP POLICY IF EXISTS "select_gallery" ON gallery_items;
CREATE POLICY "select_gallery"
  ON gallery_items FOR SELECT
  USING (
    true
  );

-- EVENTS ANALYTICS: Admin can see all
DROP POLICY IF EXISTS "select_own_analytics" ON events_analytics;
CREATE POLICY "select_own_analytics"
  ON events_analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM cards WHERE cards.id = events_analytics.card_id AND cards.user_id = auth.uid())
    OR
    (SELECT is_admin FROM profiles WHERE id = auth.uid() LIMIT 1) = true
  );

-- CONTACT MESSAGES: Admin can see all
DROP POLICY IF EXISTS "select_own_messages" ON contact_messages;
CREATE POLICY "select_own_messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() 
    OR 
    user_id IS NULL
    OR
    (SELECT is_admin FROM profiles WHERE id = auth.uid() LIMIT 1) = true
  );

-- COUPON REDEMPTIONS: Admin can see all
DROP POLICY IF EXISTS "select_own_redemptions" ON coupon_redemptions;
CREATE POLICY "select_own_redemptions"
  ON coupon_redemptions FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR
    (SELECT is_admin FROM profiles WHERE id = auth.uid() LIMIT 1) = true
  );

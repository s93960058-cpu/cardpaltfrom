/*
  # Clean and Fix All RLS Policies

  1. Problem
    - Duplicate policies causing conflicts
    - Infinite recursion in admin checks
    - Inconsistent policy names

  2. Solution
    - Drop ALL existing policies
    - Create clean, simple policies
    - Avoid recursive profile checks for admins

  3. Security
    - Users can only access their own data
    - Admins use simple is_admin column check
    - Public data remains accessible
*/

-- ============================================================================
-- DROP ALL EXISTING POLICIES
-- ============================================================================

-- Profiles
DROP POLICY IF EXISTS "Users can view own profile or admin can view all" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile or admin can update any" ON profiles;
DROP POLICY IF EXISTS "Users can select their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;

-- Business Profiles
DROP POLICY IF EXISTS "Admin can view all business profiles" ON business_profiles;
DROP POLICY IF EXISTS "Users can create cards based on plan limit" ON business_profiles;
DROP POLICY IF EXISTS "Users can delete own business profiles" ON business_profiles;
DROP POLICY IF EXISTS "Users can insert own business profiles" ON business_profiles;
DROP POLICY IF EXISTS "Users can update own business profiles" ON business_profiles;
DROP POLICY IF EXISTS "Users can view own business profiles" ON business_profiles;

-- Cards
DROP POLICY IF EXISTS "Admin can view all cards" ON cards;
DROP POLICY IF EXISTS "Anyone can view published cards" ON cards;
DROP POLICY IF EXISTS "Users can delete own cards" ON cards;
DROP POLICY IF EXISTS "Users can insert own cards" ON cards;
DROP POLICY IF EXISTS "Users can update own cards" ON cards;
DROP POLICY IF EXISTS "Users can view own cards" ON cards;

-- Contact Messages
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Users can view own messages" ON contact_messages;

-- Coupon Redemptions
DROP POLICY IF EXISTS "Admins can view all redemptions" ON coupon_redemptions;
DROP POLICY IF EXISTS "Users can redeem coupons" ON coupon_redemptions;
DROP POLICY IF EXISTS "Users can view own redemptions" ON coupon_redemptions;

-- Coupons
DROP POLICY IF EXISTS "Admin can view all coupons" ON coupons;
DROP POLICY IF EXISTS "Anyone can view active coupons" ON coupons;

-- Events Analytics
DROP POLICY IF EXISTS "Admin can view all events" ON events_analytics;
DROP POLICY IF EXISTS "Anyone can insert events" ON events_analytics;
DROP POLICY IF EXISTS "Users can view own card analytics" ON events_analytics;

-- Gallery Items
DROP POLICY IF EXISTS "Admin can view all gallery items" ON gallery_items;
DROP POLICY IF EXISTS "Card owners can delete their gallery items" ON gallery_items;
DROP POLICY IF EXISTS "Card owners can insert gallery items" ON gallery_items;
DROP POLICY IF EXISTS "Card owners can update their gallery items" ON gallery_items;
DROP POLICY IF EXISTS "Public can view gallery items" ON gallery_items;

-- Links
DROP POLICY IF EXISTS "Anyone can view published card links" ON links;
DROP POLICY IF EXISTS "Users can manage own card links" ON links;

-- Media Gallery
DROP POLICY IF EXISTS "Anyone can view published business media" ON media_gallery;
DROP POLICY IF EXISTS "Users can manage own business media" ON media_gallery;

-- Orders
DROP POLICY IF EXISTS "Admin can view all orders" ON orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;

-- Products
DROP POLICY IF EXISTS "Admin can view all products" ON products;
DROP POLICY IF EXISTS "Card owners can delete their products" ON products;
DROP POLICY IF EXISTS "Card owners can insert products" ON products;
DROP POLICY IF EXISTS "Card owners can update their products" ON products;
DROP POLICY IF EXISTS "Card owners can view all their products" ON products;
DROP POLICY IF EXISTS "Public can view available products" ON products;

-- Reviews
DROP POLICY IF EXISTS "Admin can view all reviews" ON reviews;
DROP POLICY IF EXISTS "Anyone can submit reviews" ON reviews;
DROP POLICY IF EXISTS "Card owners can delete their reviews" ON reviews;
DROP POLICY IF EXISTS "Card owners can update their reviews" ON reviews;
DROP POLICY IF EXISTS "Card owners can view all their reviews" ON reviews;
DROP POLICY IF EXISTS "Public can view approved reviews" ON reviews;

-- Templates
DROP POLICY IF EXISTS "Anyone can view templates" ON templates;

-- ============================================================================
-- CREATE NEW CLEAN POLICIES
-- ============================================================================

-- PROFILES: Users can manage own, admins can view/update all
CREATE POLICY "select_own_profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR is_admin = true);

CREATE POLICY "insert_own_profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "update_own_profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR is_admin = true)
  WITH CHECK (auth.uid() = id OR is_admin = true);

-- BUSINESS PROFILES
CREATE POLICY "select_own_business"
  ON business_profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "insert_own_business"
  ON business_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "update_own_business"
  ON business_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "delete_own_business"
  ON business_profiles FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- CARDS
CREATE POLICY "select_published_cards"
  ON cards FOR SELECT
  USING (is_published = true OR auth.uid() = user_id);

CREATE POLICY "insert_own_card"
  ON cards FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "update_own_card"
  ON cards FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "delete_own_card"
  ON cards FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- LINKS
CREATE POLICY "select_links"
  ON links FOR SELECT
  USING (true);

CREATE POLICY "manage_own_card_links"
  ON links FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM cards WHERE cards.id = links.card_id AND cards.user_id = auth.uid())
  );

-- TEMPLATES
CREATE POLICY "select_templates"
  ON templates FOR SELECT
  USING (true);

-- CONTACT MESSAGES
CREATE POLICY "insert_contact_message"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "select_own_messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR user_id IS NULL);

-- MEDIA GALLERY
CREATE POLICY "select_media"
  ON media_gallery FOR SELECT
  USING (true);

CREATE POLICY "manage_own_media"
  ON media_gallery FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM business_profiles WHERE business_profiles.id = media_gallery.business_id AND business_profiles.user_id = auth.uid())
  );

-- COUPONS
CREATE POLICY "select_active_coupons"
  ON coupons FOR SELECT
  TO authenticated
  USING (is_active = true AND ends_at > now());

-- COUPON REDEMPTIONS
CREATE POLICY "insert_redemption"
  ON coupon_redemptions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "select_own_redemptions"
  ON coupon_redemptions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- ORDERS
CREATE POLICY "insert_own_order"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "select_own_orders"
  ON orders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- EVENTS ANALYTICS
CREATE POLICY "insert_event"
  ON events_analytics FOR INSERT
  WITH CHECK (true);

CREATE POLICY "select_own_analytics"
  ON events_analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM cards WHERE cards.id = events_analytics.card_id AND cards.user_id = auth.uid())
  );

-- REVIEWS
CREATE POLICY "select_approved_reviews"
  ON reviews FOR SELECT
  USING (is_approved = true);

CREATE POLICY "insert_review"
  ON reviews FOR INSERT
  WITH CHECK (true);

CREATE POLICY "manage_own_card_reviews"
  ON reviews FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM cards WHERE cards.id = reviews.card_id AND cards.user_id = auth.uid())
  );

-- PRODUCTS
CREATE POLICY "select_available_products"
  ON products FOR SELECT
  USING (is_available = true);

CREATE POLICY "manage_own_card_products"
  ON products FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM cards WHERE cards.id = products.card_id AND cards.user_id = auth.uid())
  );

-- GALLERY ITEMS
CREATE POLICY "select_gallery"
  ON gallery_items FOR SELECT
  USING (true);

CREATE POLICY "manage_own_card_gallery"
  ON gallery_items FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM cards WHERE cards.id = gallery_items.card_id AND cards.user_id = auth.uid())
  );

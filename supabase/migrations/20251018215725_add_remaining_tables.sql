/*
  # Add Remaining Tables

  ## Tables Created
  1. business_profiles - Business information
  2. cards - Digital business cards
  3. links - Social/contact links
  4. media_gallery - Business images
  5. coupons - Discount codes
  6. orders - Payment transactions
  7. events_analytics - Analytics tracking

  ## Security
  - All tables have RLS enabled
  - Users can only access their own data
*/

-- ============================================
-- 1. BUSINESS PROFILES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS business_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  tagline text,
  description text,
  phone text,
  whatsapp text,
  email text,
  site_url text,
  address text,
  lat numeric,
  lng numeric,
  hours_json jsonb DEFAULT '{}'::jsonb,
  logo_url text,
  cover_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own business profiles"
  ON business_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own business profiles"
  ON business_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own business profiles"
  ON business_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own business profiles"
  ON business_profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- 2. CARDS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_id uuid NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
  slug text NOT NULL UNIQUE,
  template_id uuid REFERENCES templates(id) ON DELETE SET NULL,
  theme_preset jsonb DEFAULT '{}'::jsonb,
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  og_image_url text,
  views_count integer NOT NULL DEFAULT 0,
  qr_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cards"
  ON cards FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view published cards"
  ON cards FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Users can insert own cards"
  ON cards FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cards"
  ON cards FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cards"
  ON cards FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- 3. LINKS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id uuid NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('phone', 'whatsapp', 'map', 'instagram', 'facebook', 'linkedin', 'tiktok', 'website', 'custom')),
  label text NOT NULL,
  url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own card links"
  ON links FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cards
      WHERE cards.id = links.card_id
      AND cards.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view published card links"
  ON links FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM cards
      WHERE cards.id = links.card_id
      AND cards.is_published = true
    )
  );

-- ============================================
-- 4. MEDIA GALLERY TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS media_gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
  file_url text NOT NULL,
  alt text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE media_gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own business media"
  ON media_gallery FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE business_profiles.id = media_gallery.business_id
      AND business_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view published business media"
  ON media_gallery FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM business_profiles bp
      JOIN cards c ON c.business_id = bp.id
      WHERE bp.id = media_gallery.business_id
      AND c.is_published = true
    )
  );

-- ============================================
-- 5. COUPONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  type text NOT NULL CHECK (type IN ('percent', 'fixed')),
  value numeric NOT NULL CHECK (value > 0),
  starts_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz,
  max_uses integer,
  used_count integer NOT NULL DEFAULT 0,
  min_amount numeric,
  allowed_plans text[] DEFAULT ARRAY['starter', 'pro', 'enterprise'],
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active coupons"
  ON coupons FOR SELECT
  TO public
  USING (is_active = true AND (ends_at IS NULL OR ends_at > now()));

-- ============================================
-- 6. ORDERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan text NOT NULL CHECK (plan IN ('starter', 'pro', 'enterprise')),
  amount numeric NOT NULL CHECK (amount >= 0),
  currency text NOT NULL DEFAULT 'ILS',
  coupon_id uuid REFERENCES coupons(id) ON DELETE SET NULL,
  discount_amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  gateway text CHECK (gateway IN ('cardcom', 'stripe')),
  transaction_ref text,
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 7. EVENTS ANALYTICS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS events_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id uuid NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  user_agent text,
  ip_hash text,
  referrer text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE events_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert events"
  ON events_analytics FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view own card analytics"
  ON events_analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cards
      WHERE cards.id = events_analytics.card_id
      AND cards.user_id = auth.uid()
    )
  );

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to increment card views
CREATE OR REPLACE FUNCTION increment_card_views(card_slug text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE cards
  SET views_count = views_count + 1
  WHERE slug = card_slug;
END;
$$;

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_profiles_updated_at
  BEFORE UPDATE ON business_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cards_updated_at
  BEFORE UPDATE ON cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_messages_updated_at
  BEFORE UPDATE ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

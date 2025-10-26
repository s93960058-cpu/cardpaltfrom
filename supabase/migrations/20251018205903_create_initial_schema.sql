/*
  # Initial Schema for Digital Business Card Platform
  
  ## Overview
  This migration creates the complete database schema for a digital business card platform
  with full RTL support, multi-tenancy, analytics, and coupon system.
  
  ## New Tables
  
  ### 1. `profiles`
  User profiles extending Supabase auth.users
  - `id` (uuid, FK to auth.users)
  - `email` (text)
  - `full_name` (text)
  - `plan` (text) - starter/pro/enterprise
  - `status` (text) - active/suspended/cancelled
  - `stripe_customer_id` (text, nullable)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 2. `business_profiles`
  Business information for each user
  - `id` (uuid, PK)
  - `user_id` (uuid, FK)
  - `business_name` (text)
  - `tagline` (text, nullable)
  - `description` (text, nullable)
  - `phone` (text, nullable)
  - `whatsapp` (text, nullable)
  - `email` (text, nullable)
  - `site_url` (text, nullable)
  - `address` (text, nullable)
  - `lat` (numeric, nullable)
  - `lng` (numeric, nullable)
  - `hours_json` (jsonb, nullable) - business hours
  - `logo_url` (text, nullable)
  - `cover_url` (text, nullable)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 3. `templates`
  Card design templates
  - `id` (uuid, PK)
  - `name` (text)
  - `category` (text) - business/creative/professional/minimal
  - `preview_url` (text, nullable)
  - `blocks_json` (jsonb) - template structure
  - `is_premium` (boolean)
  - `sort_order` (integer)
  - `created_at` (timestamptz)
  
  ### 4. `cards`
  Digital business cards
  - `id` (uuid, PK)
  - `user_id` (uuid, FK)
  - `business_id` (uuid, FK)
  - `slug` (text, unique)
  - `template_id` (uuid, FK, nullable)
  - `theme_preset` (jsonb, nullable) - colors, fonts
  - `is_published` (boolean)
  - `published_at` (timestamptz, nullable)
  - `og_image_url` (text, nullable)
  - `views_count` (integer)
  - `qr_url` (text, nullable)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 5. `media_gallery`
  Images for business profiles
  - `id` (uuid, PK)
  - `business_id` (uuid, FK)
  - `file_url` (text)
  - `alt` (text, nullable)
  - `sort_order` (integer)
  - `created_at` (timestamptz)
  
  ### 6. `links`
  Social and contact links
  - `id` (uuid, PK)
  - `card_id` (uuid, FK)
  - `type` (text) - phone/whatsapp/map/instagram/facebook/linkedin/tiktok/custom
  - `label` (text)
  - `url` (text)
  - `sort_order` (integer)
  - `created_at` (timestamptz)
  
  ### 7. `coupons`
  Discount coupons
  - `id` (uuid, PK)
  - `code` (text, unique)
  - `type` (text) - percent/fixed
  - `value` (numeric)
  - `starts_at` (timestamptz)
  - `ends_at` (timestamptz, nullable)
  - `max_uses` (integer, nullable)
  - `used_count` (integer)
  - `min_amount` (numeric, nullable)
  - `allowed_plans` (text[], nullable)
  - `is_active` (boolean)
  - `created_at` (timestamptz)
  
  ### 8. `orders`
  Payment orders
  - `id` (uuid, PK)
  - `user_id` (uuid, FK)
  - `plan` (text)
  - `amount` (numeric)
  - `currency` (text)
  - `coupon_id` (uuid, FK, nullable)
  - `discount_amount` (numeric)
  - `status` (text) - pending/paid/failed/refunded
  - `gateway` (text, nullable) - cardcom/stripe
  - `transaction_ref` (text, nullable)
  - `period_start` (timestamptz)
  - `period_end` (timestamptz)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 9. `events_analytics`
  Analytics events tracking
  - `id` (uuid, PK)
  - `card_id` (uuid, FK)
  - `event_type` (text) - view/click_phone/click_whatsapp/click_map/etc
  - `user_agent` (text, nullable)
  - `ip_hash` (text, nullable)
  - `referrer` (text, nullable)
  - `created_at` (timestamptz)
  
  ## Security
  - RLS enabled on all tables
  - Policies for authenticated users to manage their own data
  - Public read access for published cards
  - Admin-only access for templates and coupons management
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  plan text DEFAULT 'starter' NOT NULL CHECK (plan IN ('starter', 'pro', 'enterprise')),
  status text DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'suspended', 'cancelled')),
  stripe_customer_id text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Business profiles table
CREATE TABLE IF NOT EXISTS business_profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  hours_json jsonb DEFAULT '{}',
  logo_url text,
  cover_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
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

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('business', 'creative', 'professional', 'minimal')),
  preview_url text,
  blocks_json jsonb DEFAULT '[]' NOT NULL,
  is_premium boolean DEFAULT false NOT NULL,
  sort_order integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view templates"
  ON templates FOR SELECT
  TO authenticated
  USING (true);

-- Cards table
CREATE TABLE IF NOT EXISTS cards (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_id uuid NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
  slug text NOT NULL UNIQUE,
  template_id uuid REFERENCES templates(id) ON DELETE SET NULL,
  theme_preset jsonb DEFAULT '{}',
  is_published boolean DEFAULT false NOT NULL,
  published_at timestamptz,
  og_image_url text,
  views_count integer DEFAULT 0 NOT NULL,
  qr_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cards"
  ON cards FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view published cards"
  ON cards FOR SELECT
  TO anon
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

-- Create index for slug lookups
CREATE INDEX IF NOT EXISTS idx_cards_slug ON cards(slug);
CREATE INDEX IF NOT EXISTS idx_cards_published ON cards(is_published, published_at);

-- Media gallery table
CREATE TABLE IF NOT EXISTS media_gallery (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id uuid NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
  file_url text NOT NULL,
  alt text,
  sort_order integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE media_gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own media"
  ON media_gallery FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE business_profiles.id = media_gallery.business_id
      AND business_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own media"
  ON media_gallery FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE business_profiles.id = media_gallery.business_id
      AND business_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own media"
  ON media_gallery FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE business_profiles.id = media_gallery.business_id
      AND business_profiles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE business_profiles.id = media_gallery.business_id
      AND business_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own media"
  ON media_gallery FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE business_profiles.id = media_gallery.business_id
      AND business_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view media for published cards"
  ON media_gallery FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM cards
      WHERE cards.business_id = media_gallery.business_id
      AND cards.is_published = true
    )
  );

-- Links table
CREATE TABLE IF NOT EXISTS links (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_id uuid NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('phone', 'whatsapp', 'map', 'instagram', 'facebook', 'linkedin', 'tiktok', 'website', 'custom')),
  label text NOT NULL,
  url text NOT NULL,
  sort_order integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
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
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cards
      WHERE cards.id = links.card_id
      AND cards.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view links for published cards"
  ON links FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM cards
      WHERE cards.id = links.card_id
      AND cards.is_published = true
    )
  );

-- Coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  code text NOT NULL UNIQUE,
  type text NOT NULL CHECK (type IN ('percent', 'fixed')),
  value numeric NOT NULL CHECK (value > 0),
  starts_at timestamptz DEFAULT now() NOT NULL,
  ends_at timestamptz,
  max_uses integer,
  used_count integer DEFAULT 0 NOT NULL,
  min_amount numeric,
  allowed_plans text[] DEFAULT ARRAY['starter', 'pro', 'enterprise'],
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active coupons for validation"
  ON coupons FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Create index for code lookups
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan text NOT NULL CHECK (plan IN ('starter', 'pro', 'enterprise')),
  amount numeric NOT NULL CHECK (amount >= 0),
  currency text DEFAULT 'ILS' NOT NULL,
  coupon_id uuid REFERENCES coupons(id) ON DELETE SET NULL,
  discount_amount numeric DEFAULT 0 NOT NULL,
  status text DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  gateway text CHECK (gateway IN ('cardcom', 'stripe')),
  transaction_ref text,
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
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

-- Events analytics table
CREATE TABLE IF NOT EXISTS events_analytics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_id uuid NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  user_agent text,
  ip_hash text,
  referrer text,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE events_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view analytics for own cards"
  ON events_analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cards
      WHERE cards.id = events_analytics.card_id
      AND cards.user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert analytics events"
  ON events_analytics FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Create indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_analytics_card_id ON events_analytics(card_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON events_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON events_analytics(event_type);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
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

-- Insert default templates
INSERT INTO templates (name, category, blocks_json, is_premium, sort_order) VALUES
  ('קלאסי מינימלי', 'minimal', '{"layout": "centered", "sections": ["header", "contact", "description", "links", "gallery"]}', false, 1),
  ('עסקי מקצועי', 'professional', '{"layout": "split", "sections": ["header", "about", "services", "contact", "social"]}', false, 2),
  ('יצירתי צבעוני', 'creative', '{"layout": "asymmetric", "sections": ["hero", "portfolio", "contact", "testimonials"]}', false, 3),
  ('כרטיס מודרני', 'business', '{"layout": "card", "sections": ["profile", "info", "actions", "map"]}', false, 4),
  ('פרימיום זהב', 'professional', '{"layout": "luxury", "sections": ["hero", "services", "gallery", "booking", "contact"]}', true, 5)
ON CONFLICT DO NOTHING;

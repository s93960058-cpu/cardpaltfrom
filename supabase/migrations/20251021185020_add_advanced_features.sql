/*
  # Add Advanced Features to MyCards

  1. New Tables
    - `reviews` - Customer reviews and testimonials
      - `id` (uuid, primary key)
      - `card_id` (uuid, foreign key to cards)
      - `customer_name` (text)
      - `rating` (integer, 1-5 stars)
      - `comment` (text)
      - `is_approved` (boolean, default false)
      - `created_at` (timestamptz)
    
    - `products` - Product catalog items
      - `id` (uuid, primary key)
      - `card_id` (uuid, foreign key to cards)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `currency` (text, default 'ILS')
      - `image_url` (text)
      - `is_available` (boolean, default true)
      - `sort_order` (integer, default 0)
      - `created_at` (timestamptz)
    
    - `gallery_items` - Gallery/portfolio images
      - `id` (uuid, primary key)
      - `card_id` (uuid, foreign key to cards)
      - `image_url` (text)
      - `title` (text)
      - `description` (text)
      - `sort_order` (integer, default 0)
      - `created_at` (timestamptz)

  2. Table Modifications
    - Add `social_media_json` to business_profiles for social links
    - Add `profile_image_url` to business_profiles

  3. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users to manage their own content
    - Add policies for public viewing of approved content
*/

-- Add new columns to business_profiles
ALTER TABLE business_profiles 
ADD COLUMN IF NOT EXISTS social_media_json jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS profile_image_url text;

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id uuid NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id uuid NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  currency text DEFAULT 'ILS',
  image_url text,
  is_available boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create gallery_items table
CREATE TABLE IF NOT EXISTS gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id uuid NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  title text,
  description text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

-- Reviews policies
CREATE POLICY "Public can view approved reviews"
  ON reviews FOR SELECT
  TO public
  USING (is_approved = true);

CREATE POLICY "Card owners can view all their reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cards
      WHERE cards.id = reviews.card_id
      AND cards.user_id = auth.uid()
    )
  );

CREATE POLICY "Card owners can update their reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cards
      WHERE cards.id = reviews.card_id
      AND cards.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cards
      WHERE cards.id = reviews.card_id
      AND cards.user_id = auth.uid()
    )
  );

CREATE POLICY "Card owners can delete their reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cards
      WHERE cards.id = reviews.card_id
      AND cards.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can submit reviews"
  ON reviews FOR INSERT
  TO public
  WITH CHECK (true);

-- Products policies
CREATE POLICY "Public can view available products"
  ON products FOR SELECT
  TO public
  USING (is_available = true);

CREATE POLICY "Card owners can view all their products"
  ON products FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cards
      WHERE cards.id = products.card_id
      AND cards.user_id = auth.uid()
    )
  );

CREATE POLICY "Card owners can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cards
      WHERE cards.id = products.card_id
      AND cards.user_id = auth.uid()
    )
  );

CREATE POLICY "Card owners can update their products"
  ON products FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cards
      WHERE cards.id = products.card_id
      AND cards.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cards
      WHERE cards.id = products.card_id
      AND cards.user_id = auth.uid()
    )
  );

CREATE POLICY "Card owners can delete their products"
  ON products FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cards
      WHERE cards.id = products.card_id
      AND cards.user_id = auth.uid()
    )
  );

-- Gallery items policies
CREATE POLICY "Public can view gallery items"
  ON gallery_items FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Card owners can insert gallery items"
  ON gallery_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cards
      WHERE cards.id = gallery_items.card_id
      AND cards.user_id = auth.uid()
    )
  );

CREATE POLICY "Card owners can update their gallery items"
  ON gallery_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cards
      WHERE cards.id = gallery_items.card_id
      AND cards.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cards
      WHERE cards.id = gallery_items.card_id
      AND cards.user_id = auth.uid()
    )
  );

CREATE POLICY "Card owners can delete their gallery items"
  ON gallery_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cards
      WHERE cards.id = gallery_items.card_id
      AND cards.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_card_id ON reviews(card_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_products_card_id ON products(card_id);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(is_available);
CREATE INDEX IF NOT EXISTS idx_gallery_card_id ON gallery_items(card_id);

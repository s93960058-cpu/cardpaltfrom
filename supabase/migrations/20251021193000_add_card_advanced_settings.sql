/*
  # Add Advanced Card Settings

  1. New Columns
    - `custom_background` (text) - Custom background image URL or gradient
    - `custom_url` (text) - Custom short URL/vanity URL
    - `hide_branding` (boolean) - Option to hide MyCards branding
    - `custom_css` (text) - Custom CSS for advanced styling
    - `seo_title` (text) - Custom SEO title
    - `seo_description` (text) - Custom SEO description
    - `favicon_url` (text) - Custom favicon URL

  2. Changes
    - Add new columns to cards table
    - Update existing cards to have default values
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cards' AND column_name = 'custom_background'
  ) THEN
    ALTER TABLE cards ADD COLUMN custom_background text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cards' AND column_name = 'custom_url'
  ) THEN
    ALTER TABLE cards ADD COLUMN custom_url text UNIQUE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cards' AND column_name = 'hide_branding'
  ) THEN
    ALTER TABLE cards ADD COLUMN hide_branding boolean DEFAULT false NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cards' AND column_name = 'custom_css'
  ) THEN
    ALTER TABLE cards ADD COLUMN custom_css text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cards' AND column_name = 'seo_title'
  ) THEN
    ALTER TABLE cards ADD COLUMN seo_title text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cards' AND column_name = 'seo_description'
  ) THEN
    ALTER TABLE cards ADD COLUMN seo_description text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cards' AND column_name = 'favicon_url'
  ) THEN
    ALTER TABLE cards ADD COLUMN favicon_url text;
  END IF;
END $$;

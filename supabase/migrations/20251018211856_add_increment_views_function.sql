/*
  # Add increment_views function
  
  This migration adds a PostgreSQL function to safely increment the views counter
  on cards without race conditions.
  
  ## Changes
  - Create increment_views function that atomically increments views_count
*/

CREATE OR REPLACE FUNCTION increment_views(card_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE cards
  SET views_count = views_count + 1
  WHERE id = card_id;
END;
$$;

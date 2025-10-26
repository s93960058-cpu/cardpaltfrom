/*
  # Add More Card Templates

  This migration adds 15 additional professional templates for various business types
  and professions, bringing the total to 20 templates.

  ## New Templates

  ### Free Templates (9):
  - טק מודרני - Modern tech business card
  - רפואי נקי - Clean medical professional card
  - משפטי רציני - Serious legal professional card
  - כושר ואימונים - Dynamic fitness trainer card
  - מוסך ותיקונים - Industrial garage card
  - יופי וקוסמטיקה - Elegant beauty card
  - חינוך והוראה - Friendly education card
  - טכנאי ושירותים - Simple technician card
  - יועץ עסקי - Corporate consultant card

  ### Premium Templates (6):
  - מסעדה אלגנטית - Elegant restaurant card
  - אמנות יצירתית - Artistic creative card
  - נדל״ן יוקרתי - Luxury real estate card
  - אופנה וסטייל - Stylish fashion card
  - צילום מקצועי - Professional photography showcase
  - אירועים וקייטרינג - Vibrant events card
*/

-- Add more diverse templates (Free)
INSERT INTO templates (name, category, blocks_json, is_premium, sort_order) VALUES
  ('טק מודרני', 'business', '{"layout": "modern-tech", "sections": ["header", "services", "tech-stack", "contact"], "colors": {"primary": "#667EEA", "secondary": "#764BA2"}}', false, 6),
  ('רפואי נקי', 'professional', '{"layout": "medical-clean", "sections": ["profile", "credentials", "services", "appointments", "contact"], "colors": {"primary": "#38B2AC", "secondary": "#4FD1C5"}}', false, 7),
  ('משפטי רציני', 'professional', '{"layout": "legal-serious", "sections": ["profile", "expertise", "credentials", "contact"], "colors": {"primary": "#2D3748", "secondary": "#4A5568"}}', false, 9),
  ('כושר ואימונים', 'business', '{"layout": "fitness-dynamic", "sections": ["hero-video", "programs", "trainer-bio", "schedule", "pricing"], "colors": {"primary": "#F56565", "secondary": "#ED8936"}}', false, 11),
  ('מוסך ותיקונים', 'business', '{"layout": "garage-industrial", "sections": ["services", "pricing", "gallery", "hours", "contact"], "colors": {"primary": "#E53E3E", "secondary": "#2D3748"}}', false, 14),
  ('יופי וקוסמטיקה', 'creative', '{"layout": "beauty-elegant", "sections": ["hero", "services", "gallery", "pricing", "booking"], "colors": {"primary": "#D53F8C", "secondary": "#B83280"}}', false, 15),
  ('חינוך והוראה', 'professional', '{"layout": "education-friendly", "sections": ["about", "courses", "credentials", "testimonials", "contact"], "colors": {"primary": "#4299E1", "secondary": "#3182CE"}}', false, 16),
  ('טכנאי ושירותים', 'business', '{"layout": "technician-simple", "sections": ["services-list", "coverage-area", "pricing", "reviews", "contact"], "colors": {"primary": "#2B6CB0", "secondary": "#2C5282"}}', false, 18),
  ('יועץ עסקי', 'professional', '{"layout": "consultant-corporate", "sections": ["expertise", "clients", "process", "testimonials", "contact"], "colors": {"primary": "#4A5568", "secondary": "#2D3748"}}', false, 19)
ON CONFLICT (name) DO NOTHING;

-- Add premium templates
INSERT INTO templates (name, category, blocks_json, is_premium, sort_order) VALUES
  ('מסעדה אלגנטית', 'business', '{"layout": "restaurant-elegant", "sections": ["hero-image", "menu-highlights", "hours", "location", "reservations"], "colors": {"primary": "#F56565", "secondary": "#ED8936"}}', true, 8),
  ('אמנות יצירתית', 'creative', '{"layout": "artistic-creative", "sections": ["hero", "portfolio-grid", "about", "instagram-feed", "contact"], "colors": {"primary": "#ED64A6", "secondary": "#D53F8C"}}', true, 10),
  ('נדל״ן יוקרתי', 'professional', '{"layout": "real-estate-luxury", "sections": ["hero", "properties-slider", "agent-bio", "testimonials", "contact"], "colors": {"primary": "#805AD5", "secondary": "#6B46C1"}}', true, 12),
  ('אופנה וסטייל', 'creative', '{"layout": "fashion-stylish", "sections": ["hero-full", "collections", "instagram", "about", "contact"], "colors": {"primary": "#000000", "secondary": "#F7FAFC"}}', true, 13),
  ('צילום מקצועי', 'creative', '{"layout": "photography-showcase", "sections": ["hero-fullscreen", "portfolio-masonry", "services", "about", "contact"], "colors": {"primary": "#2D3748", "secondary": "#718096"}}', true, 17),
  ('אירועים וקייטרינג', 'business', '{"layout": "events-vibrant", "sections": ["hero", "services", "gallery", "packages", "contact"], "colors": {"primary": "#F6AD55", "secondary": "#ED8936"}}', true, 20)
ON CONFLICT (name) DO NOTHING;

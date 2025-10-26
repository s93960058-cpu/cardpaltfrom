-- Temporarily allow inserting templates
ALTER TABLE templates DISABLE ROW LEVEL SECURITY;

-- Insert initial 5 templates
INSERT INTO templates (name, category, blocks_json, is_premium, sort_order) VALUES
  ('קלאסי מינימלי', 'minimal', '{"layout": "centered", "sections": ["header", "contact", "description", "links", "gallery"]}', false, 1),
  ('עסקי מקצועי', 'professional', '{"layout": "split", "sections": ["header", "about", "services", "contact", "social"]}', false, 2),
  ('יצירתי צבעוני', 'creative', '{"layout": "asymmetric", "sections": ["hero", "portfolio", "contact", "testimonials"]}', false, 3),
  ('כרטיס מודרני', 'business', '{"layout": "card", "sections": ["profile", "info", "actions", "map"]}', false, 4),
  ('פרימיום זהב', 'professional', '{"layout": "luxury", "sections": ["hero", "services", "gallery", "booking", "contact"]}', true, 5)
ON CONFLICT (name) DO NOTHING;

-- Insert additional 15 templates
INSERT INTO templates (name, category, blocks_json, is_premium, sort_order) VALUES
  ('טק מודרני', 'business', '{"layout": "modern-tech", "sections": ["header", "services", "tech-stack", "contact"], "colors": {"primary": "#667EEA", "secondary": "#764BA2"}}', false, 6),
  ('רפואי נקי', 'professional', '{"layout": "medical-clean", "sections": ["profile", "credentials", "services", "appointments", "contact"], "colors": {"primary": "#38B2AC", "secondary": "#4FD1C5"}}', false, 7),
  ('מסעדה אלגנטית', 'business', '{"layout": "restaurant-elegant", "sections": ["hero-image", "menu-highlights", "hours", "location", "reservations"], "colors": {"primary": "#F56565", "secondary": "#ED8936"}}', true, 8),
  ('משפטי רציני', 'professional', '{"layout": "legal-serious", "sections": ["profile", "expertise", "credentials", "contact"], "colors": {"primary": "#2D3748", "secondary": "#4A5568"}}', false, 9),
  ('אמנות יצירתית', 'creative', '{"layout": "artistic-creative", "sections": ["hero", "portfolio-grid", "about", "instagram-feed", "contact"], "colors": {"primary": "#ED64A6", "secondary": "#D53F8C"}}', true, 10),
  ('כושר ואימונים', 'business', '{"layout": "fitness-dynamic", "sections": ["hero-video", "programs", "trainer-bio", "schedule", "pricing"], "colors": {"primary": "#F56565", "secondary": "#ED8936"}}', false, 11),
  ('נדל״ן יוקרתי', 'professional', '{"layout": "real-estate-luxury", "sections": ["hero", "properties-slider", "agent-bio", "testimonials", "contact"], "colors": {"primary": "#805AD5", "secondary": "#6B46C1"}}', true, 12),
  ('אופנה וסטייל', 'creative', '{"layout": "fashion-stylish", "sections": ["hero-full", "collections", "instagram", "about", "contact"], "colors": {"primary": "#000000", "secondary": "#F7FAFC"}}', true, 13),
  ('מוסך ותיקונים', 'business', '{"layout": "garage-industrial", "sections": ["services", "pricing", "gallery", "hours", "contact"], "colors": {"primary": "#E53E3E", "secondary": "#2D3748"}}', false, 14),
  ('יופי וקוסמטיקה', 'creative', '{"layout": "beauty-elegant", "sections": ["hero", "services", "gallery", "pricing", "booking"], "colors": {"primary": "#D53F8C", "secondary": "#B83280"}}', false, 15),
  ('חינוך והוראה', 'professional', '{"layout": "education-friendly", "sections": ["about", "courses", "credentials", "testimonials", "contact"], "colors": {"primary": "#4299E1", "secondary": "#3182CE"}}', false, 16),
  ('צילום מקצועי', 'creative', '{"layout": "photography-showcase", "sections": ["hero-fullscreen", "portfolio-masonry", "services", "about", "contact"], "colors": {"primary": "#2D3748", "secondary": "#718096"}}', true, 17),
  ('טכנאי ושירותים', 'business', '{"layout": "technician-simple", "sections": ["services-list", "coverage-area", "pricing", "reviews", "contact"], "colors": {"primary": "#2B6CB0", "secondary": "#2C5282"}}', false, 18),
  ('יועץ עסקי', 'professional', '{"layout": "consultant-corporate", "sections": ["expertise", "clients", "process", "testimonials", "contact"], "colors": {"primary": "#4A5568", "secondary": "#2D3748"}}', false, 19),
  ('אירועים וקייטרינג', 'business', '{"layout": "events-vibrant", "sections": ["hero", "services", "gallery", "packages", "contact"], "colors": {"primary": "#F6AD55", "secondary": "#ED8936"}}', true, 20)
ON CONFLICT (name) DO NOTHING;

-- Re-enable RLS
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

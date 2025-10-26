# 🚀 תיקון מהיר - הוסף 20 תבניות עכשיו!

## ✅ 3 שלבים פשוטים (2 דקות)

### שלב 1: פתח את Supabase
```
https://supabase.com/dashboard
```
- התחבר לחשבון שלך
- בחר בפרויקט: **agzeqhesddulsetepgcc**

---

### שלב 2: פתח SQL Editor
1. בתפריט הצד (שמאל), לחץ על **"SQL Editor"**
2. לחץ על הכפתור **"+ New query"** (למעלה מימין)

---

### שלב 3: העתק והדבק ולחץ Run

העתק את כל הקוד הבא (Ctrl+A ואז Ctrl+C):

```sql
-- תיקון מהיר - הוספת 20 תבניות
ALTER TABLE templates DISABLE ROW LEVEL SECURITY;
TRUNCATE TABLE templates CASCADE;

INSERT INTO templates (name, category, blocks_json, is_premium, sort_order) VALUES
  ('קלאסי מינימלי', 'minimal', '{"layout": "centered", "sections": ["header", "contact", "description", "links", "gallery"]}', false, 1),
  ('עסקי מקצועי', 'professional', '{"layout": "split", "sections": ["header", "about", "services", "contact", "social"]}', false, 2),
  ('יצירתי צבעוני', 'creative', '{"layout": "asymmetric", "sections": ["hero", "portfolio", "contact", "testimonials"]}', false, 3),
  ('כרטיס מודרני', 'business', '{"layout": "card", "sections": ["profile", "info", "actions", "map"]}', false, 4),
  ('פרימיום זהב', 'professional', '{"layout": "luxury", "sections": ["hero", "services", "gallery", "booking", "contact"]}', true, 5),
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
  ('אירועים וקייטרינג', 'business', '{"layout": "events-vibrant", "sections": ["hero", "services", "gallery", "packages", "contact"], "colors": {"primary": "#F6AD55", "secondary": "#ED8936"}}', true, 20);

ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
```

**הדבק ב-SQL Editor (Ctrl+V) ולחץ "Run" ▶️**

---

## ✅ זהו! סיימת!

אמור לראות:
```
Success. No rows returned
```

זה אומר שהכל עבד! עכשיו:

1. **חזור לאתר שלך**
2. **לחץ F5** (או Ctrl+Shift+R למחיקת cache)
3. **עבור ל`/wizard`**
4. **תראה 20 תבניות!** 🎉

---

## 📋 מה עכשיו?

✅ יש לך 20 תבניות:
- 14 תבניות חינמיות ✅
- 6 תבניות פרימיום 💎

התבניות יופיעו באשף יצירת כרטיס חדש.

---

## 🆘 לא עובד?

### אם לא רואה תבניות באתר:
1. רענן את העמוד (F5)
2. נקה cache (Ctrl+Shift+R)
3. פתח Console (F12) ובדוק אם יש שגיאות

### לבדוק שהתבניות נשמרו:
הרץ את זה ב-SQL Editor:
```sql
SELECT COUNT(*) FROM templates;
```
אמור להחזיר: **20**

### לראות את כל התבניות:
```sql
SELECT name, category, is_premium FROM templates ORDER BY sort_order;
```

---

**זה הכל! 2 דקות והתבניות יהיו באתר** 🚀

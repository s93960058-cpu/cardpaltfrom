# 🔐 יצירת משתמש אדמין - הוראות מהירות

## דרך 1: דרך הקוד (מומלץ)

### הרץ את הפקודה:
```bash
node create-admin.js
```

זה ייצור משתמש אדמין עם הפרטים:
- **Email:** admin@cardlink.co.il
- **Password:** Admin123!@#
- **Role:** admin
- **Plan:** enterprise

---

## דרך 2: דרך Supabase Dashboard (ידני)

### שלב 1: צור משתמש באימות
1. פתח את Supabase Dashboard
2. עבור ל-**Authentication** → **Users**
3. לחץ **Add user** → **Create new user**
4. הזן:
   - Email: `admin@cardlink.co.il`
   - Password: `Admin123!@#`
   - Auto Confirm: ✅ (סמן!)
5. לחץ **Create user**
6. **העתק את ה-UUID** של המשתמש שנוצר

### שלב 2: צור פרופיל אדמין
1. עבור ל-**SQL Editor**
2. הדבק את הקוד הבא (החלף `USER_ID_HERE` ב-UUID שהעתקת):

```sql
INSERT INTO profiles (id, email, full_name, role, plan, status)
VALUES (
  'USER_ID_HERE',  -- 👈 החלף ב-UUID של המשתמש
  'admin@cardlink.co.il',
  'Admin User',
  'admin',
  'enterprise',
  'active'
);
```

3. לחץ **Run** ▶️

---

## דרך 3: דרך SQL בלבד (הכי מהיר!)

פתח **SQL Editor** ב-Supabase והרץ:

```sql
-- יצירת משתמש אדמין מלא
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- יצירת משתמש באימות (דורש הרשאות מיוחדות)
  -- לכן נשתמש ב-Supabase Dashboard Authentication

  -- אם המשתמש כבר קיים ב-auth, רק תעדכן את ה-role:
  UPDATE profiles
  SET role = 'admin',
      plan = 'enterprise',
      status = 'active'
  WHERE email = 'admin@cardlink.co.il';

  -- אם לא קיים, תצטרך ליצור אותו תחילה דרך Authentication UI
END $$;
```

---

## ✅ אימות שהאדמין נוצר:

```sql
-- בדיקה מהירה
SELECT id, email, role, plan, status
FROM profiles
WHERE email = 'admin@cardlink.co.il';
```

אמור להחזיר:
- **role:** admin ✅
- **plan:** enterprise ✅
- **status:** active ✅

---

## 🎯 התחברות כאדמין:

1. עבור ל-`/login`
2. הזן:
   - Email: `admin@cardlink.co.il`
   - Password: `Admin123!@#`
3. לחץ התחבר

---

## ⚠️ חשוב!

**שנה את הסיסמה מיד אחרי התחברות ראשונה!**

אפשר לשנות דרך:
- Settings בדשבורד
- או דרך הקוד: `supabase.auth.updateUser({ password: 'new-password' })`

---

## 🔧 פתרון בעיות:

### אם הרצת את create-admin.js ויש שגיאה:
```bash
npm install dotenv
node create-admin.js
```

### אם "User already exists":
פשוט עדכן את ה-role:
```sql
UPDATE profiles
SET role = 'admin', plan = 'enterprise', status = 'active'
WHERE email = 'admin@cardlink.co.il';
```

### אם אין גישה ל-Service Role Key:
השתמש בדרך 2 (Dashboard) - היא עובדת תמיד!

---

**זהו! בהצלחה!** 🚀

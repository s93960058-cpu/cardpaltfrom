# 🎉 תכונות חדשות במערכת

## ✅ מה שונה?

### 1. 🚫 אין יותר גרסה חינמית
- **כל התוכניות בתשלום**
- 3 רמות מנוי: Pro (₪99), Business (₪199), Enterprise (₪399)
- תשלום רק בקופונים (בינתיים)

---

### 2. 📧 אימות מייל חובה
אחרי הרשמה:
1. המשתמש מקבל הודעה שנשלח מייל אימות
2. צריך ללחוץ על הקישור במייל
3. רק אחרי אימות אפשר להתחבר

**דף אימות מייל חדש:** `/verify-email?token=xxx`

---

### 3. 🖼️ העלאת קבצים (תמונות)

#### Storage Buckets חדשים:
- **logos** - לוגואים של עסקים
- **covers** - תמונות רקע/כיסוי
- **media** - גלריית תמונות

#### תכונות:
- ✅ גודל מקסימלי: 5MB לקובץ
- ✅ פורמטים: JPG, PNG, WEBP, SVG (ללוגואים)
- ✅ אחסון מאובטח ב-Supabase Storage
- ✅ RLS - כל משתמש יכול להעלות רק לתיקייה שלו
- ✅ קריאה ציבורית - כל אחד יכול לראות את התמונות

---

### 4. 🎫 תמיכה בקופונים

בדף התמחור:
- לחצן "יש לך קוד קופון?"
- הזנת קוד קופון
- הקוד מועבר לדף התשלום

בדף התשלום (Checkout):
- בדיקת תקינות הקוד
- חישוב הנחה (אחוז או סכום קבוע)
- הצגת המחיר לפני ואחרי ההנחה

---

## 📁 קבצים חדשים

### דפים:
1. `/src/pages/VerifyEmail.tsx` - דף אימות מייל
2. `/src/pages/Pricing.tsx` - דף תמחור חדש (רק בתשלום)

### קומפוננטים:
1. `/src/components/FileUpload.tsx` - העלאת קבצים

### Migration:
1. `add_email_verification_and_storage.sql` - אימות מייל + storage

---

## 🔧 שינויים קיימים

### דפים ששונו:
- `/src/pages/Signup.tsx` - הודעה על אימות מייל
- `/src/components/Navbar.tsx` - קישור לדף תמחור
- `/src/lib/router.tsx` - נתיבים חדשים
- `/src/lib/database.types.ts` - טיפוסים מעודכנים

---

## 🚀 איך להשתמש?

### העלאת תמונה:
```tsx
import { FileUpload } from '../components/FileUpload';

<FileUpload
  bucket="logos"
  onUploadComplete={(url) => console.log('Uploaded:', url)}
  label="העלה לוגו"
  maxSizeMB={5}
/>
```

### אימות מייל:
המערכת עושה את זה אוטומטית!
1. משתמש נרשם → מקבל `verification_token`
2. מייל נשלח עם קישור לדוגמה:
   ```
   /verify-email?token=abc123xyz
   ```
3. משתמש לוחץ → `email_verified = true`

---

## 🔐 אבטחה

### Storage RLS:
```sql
-- דוגמה: רק המשתמש יכול להעלות לתיקייה שלו
CREATE POLICY "Users can upload their own logos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'logos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### Email Verification:
- טוקן אקראי לכל משתמש
- בדיקה לפני התחברות
- אפשרות לשלוח מייל חדש

---

## 💡 טיפים למפתחים

### 1. שליחת מייל אימות
צריך להגדיר Edge Function ששולח מיילים:
```typescript
// supabase/functions/send-verification-email/index.ts
const verificationUrl = `${baseUrl}/verify-email?token=${token}`;
// שלח מייל עם הקישור
```

### 2. בדיקת קופון
```typescript
const { data: coupon } = await supabase
  .from('coupons')
  .select('*')
  .eq('code', couponCode)
  .eq('is_active', true)
  .maybeSingle();

if (coupon && coupon.used_count < coupon.max_uses) {
  // קוד תקף!
}
```

### 3. העלאת קובץ
```typescript
const { data, error } = await supabase.storage
  .from('logos')
  .upload(`${userId}/logo.png`, file);

// קבל URL ציבורי
const { data: { publicUrl } } = supabase.storage
  .from('logos')
  .getPublicUrl(data.path);
```

---

## 📊 מסד נתונים

### טבלת profiles - עמודות חדשות:
- `email_verified` - האם המייל אומת
- `email_verified_at` - מתי אומת
- `verification_token` - טוקן אימות
- `verification_sent_at` - מתי נשלח

### Storage Buckets:
- `logos` (5MB, public read)
- `covers` (5MB, public read)
- `media` (5MB, public read)

---

## 🎯 מה הלאה?

### צריך להוסיף:
1. **Edge Function לשליחת מיילים**
   - כשמשתמש נרשם
   - כשמבקש מייל חדש

2. **אינטגרציה לתשלומים**
   - CardCom / Stripe
   - ניהול מנויים

3. **שימוש בקומפוננט FileUpload**
   - בדף Wizard
   - בדף עריכת כרטיס
   - בפרופיל עסק

---

## ✅ מה עובד עכשיו?

- ✅ הרשמה עם הודעה על אימות מייל
- ✅ דף אימות מייל מלא
- ✅ Storage buckets עם RLS
- ✅ קומפוננט העלאת קבצים
- ✅ דף תמחור חדש (רק בתשלום)
- ✅ תמיכה בקופונים (UI)
- ✅ ניתוב מלא

---

## 🔨 צריך לעשות:

1. **שלב שליחת מיילים:**
   - צור Edge Function `send-verification-email`
   - קרא ל-Function אחרי הרשמה

2. **שלב את FileUpload:**
   - הוסף ל-Wizard
   - הוסף לעריכת כרטיס

3. **שלב תשלומים:**
   - הגדר CardCom / Stripe
   - חבר לדף Checkout

---

**הכל מוכן לשימוש!** 🚀

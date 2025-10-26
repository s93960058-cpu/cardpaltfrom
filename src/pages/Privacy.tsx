import { CreditCard, ArrowRight } from 'lucide-react';

export function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center gap-2">
              <CreditCard className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">MyCards</span>
            </a>
            <a href="/" className="btn btn-outline btn-sm">
              <ArrowRight className="w-4 h-4 ml-2" />
              חזור לדף הבית
            </a>
          </div>
        </div>
      </nav>

      <div className="container-custom py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">מדיניות פרטיות</h1>
        <p className="text-gray-600 mb-8">עדכון אחרון: אוקטובר 2025</p>

        <div className="card space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">1. מבוא</h2>
            <p className="text-gray-700 leading-relaxed">
              MyCards מחויבת להגנת פרטיות המשתמשים שלה. מדיניות פרטיות זו מסבירה כיצד אנו
              אוספים, משתמשים ומגנים על המידע האישי שלך בהתאם לתיקון 13 לחוק הגנת
              הפרטיות, התשמ״א-1981.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">2. מידע שאנו אוספים</h2>
            <p className="text-gray-700 leading-relaxed mb-3">אנו אוספים את סוגי המידע הבאים:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
              <li>מידע אישי: שם מלא, כתובת מייל, מספר טלפון</li>
              <li>מידע עסקי: שם עסק, לוגו, תיאור, כתובת</li>
              <li>מידע טכני: כתובת IP, סוג דפדפן, מערכת הפעלה</li>
              <li>נתוני שימוש: צפיות בכרטיסים, קליקים על כפתורים</li>
              <li>מידע תשלום: באמצעות ספקי סליקה מאובטחים (לא שומרים פרטי אשראי)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">3. שימוש במידע</h2>
            <p className="text-gray-700 leading-relaxed mb-3">אנו משתמשים במידע לצרכים הבאים:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
              <li>יצירת וניהול כרטיסי ביקור דיגיטליים</li>
              <li>אספקת שירותי הפלטפורמה</li>
              <li>שיפור חוויית המשתמש</li>
              <li>תקשורת עם לקוחות ומתן תמיכה</li>
              <li>ניתוח וסטטיסטיקות (באופן אנונימי)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">4. שיתוף מידע</h2>
            <p className="text-gray-700 leading-relaxed">
              אנו לא מוכרים או משתפים את המידע האישי שלך עם צדדים שלישיים למטרות שיווק. אנו
              עשויים לשתף מידע רק במקרים הבאים: עם ספקי שירות הכרחיים לתפעול הפלטפורמה,
              בהתאם לדרישות חוק, או בהסכמתך המפורשת.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">5. אבטחת מידע</h2>
            <p className="text-gray-700 leading-relaxed">
              אנו נוקטים באמצעי אבטחה מתקדמים להגנת המידע שלך, כולל הצפנת נתונים, גישה
              מוגבלת, ומערכות ניטור. כל המידע מאוחסן בשרתים מאובטחים עם גיבויים קבועים.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">6. זכויותיך</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              בהתאם לחוק הגנת הפרטיות, יש לך את הזכויות הבאות:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
              <li>עיון במידע האישי שלך</li>
              <li>תיקון מידע לא מדויק</li>
              <li>מחיקת המידע שלך</li>
              <li>ביטול הסכמה לשימוש במידע</li>
              <li>העברת המידע לספק אחר</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              לממש זכויות אלו, ניתן לפנות אלינו דרך{' '}
              <a href="/data-request" className="text-blue-600 hover:underline">
                דף בקשת מידע
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">7. עוגיות (Cookies)</h2>
            <p className="text-gray-700 leading-relaxed">
              אנו משתמשים בעוגיות לשיפור חוויית המשתמש ולניתוח תנועה באתר. ניתן להגדיר את
              הדפדפן שלך לחסום עוגיות, אך זה עשוי להשפיע על הפונקציונליות של הפלטפורמה.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">8. שינויים במדיניות</h2>
            <p className="text-gray-700 leading-relaxed">
              אנו שומרים לעצמנו את הזכות לעדכן מדיניות זו מעת לעת. שינויים משמעותיים יובאו
              לידיעתך באמצעות הודעה באתר או במייל.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">9. יצירת קשר</h2>
            <p className="text-gray-700 leading-relaxed">
              לשאלות או בקשות הנוגעות לפרטיות, ניתן ליצור קשר:
              <br />
              מייל: support@mycards.co
              <br />
              טלפון: 03-1234567
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

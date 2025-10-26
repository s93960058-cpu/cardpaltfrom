import { CreditCard, ArrowRight } from 'lucide-react';

export function Terms() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">תנאי שימוש</h1>
        <p className="text-gray-600 mb-8">עדכון אחרון: אוקטובר 2025</p>

        <div className="card space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">1. הסכמה לתנאים</h2>
            <p className="text-gray-700 leading-relaxed">
              בגישה לפלטפורמת MyCards ובשימוש בה, אתה מסכים לתנאי שימוש אלו. אם אינך מסכים
              לתנאים, אנא הימנע משימוש בשירות.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">2. השירות</h2>
            <p className="text-gray-700 leading-relaxed">
              MyCards מספקת פלטפורמה ליצירת וניהול כרטיסי ביקור דיגיטליים. השירות כולל
              יצירת כרטיסים, שיתוף, סטטיסטיקות וכלים נוספים כמפורט באתר.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">3. רישום וחשבון</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
              <li>עליך להירשם עם מידע מדויק ועדכני</li>
              <li>אתה אחראי לשמירה על סודיות הסיסמה שלך</li>
              <li>אסור להעביר את החשבון שלך לאדם אחר</li>
              <li>עליך להודיע לנו מיד על כל שימוש לא מורשה בחשבונך</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">4. שימוש מותר</h2>
            <p className="text-gray-700 leading-relaxed mb-3">אתה מתחייב:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
              <li>להשתמש בשירות למטרות חוקיות בלבד</li>
              <li>לא להעלות תוכן פוגעני, בלתי חוקי או מפר זכויות יוצרים</li>
              <li>לא לנסות לפרוץ או להזיק למערכת</li>
              <li>לא להעתיק או לשכפל את השירות</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">5. תוכן משתמשים</h2>
            <p className="text-gray-700 leading-relaxed">
              אתה שומר על הבעלות על התוכן שלך. עם זאת, אתה נותן לנו רישיון להשתמש בתוכן
              לצורך אספקת השירות. אנו שומרים לעצמנו את הזכות להסיר תוכן שמפר את התנאים או
              החוק.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">6. תשלומים ומנויים</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
              <li>התשלומים מבוצעים באמצעות ספקי סליקה מאובטחים</li>
              <li>המנוי מתחדש באופן אוטומטי אלא אם בוטל</li>
              <li>ניתן לבטל בכל עת דרך הגדרות החשבון</li>
              <li>החזרים כספיים ניתנים בהתאם למדיניות ההחזרים</li>
              <li>אנו שומרים לעצמנו את הזכות לשנות מחירים עם הודעה מוקדמת</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">7. זמינות השירות</h2>
            <p className="text-gray-700 leading-relaxed">
              אנו עושים כמיטב יכולתנו לספק שירות רציף, אך לא מתחייבים לזמינות של 100%. אנו
              עשויים להשעות את השירות לתחזוקה או שדרוגים.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">8. הגבלת אחריות</h2>
            <p className="text-gray-700 leading-relaxed">
              השירות ניתן &quot;כמות שהוא&quot;. איננו אחראים לנזקים עקיפים או תוצאתיים
              הנובעים משימוש בשירות. אחריותנו מוגבלת לסכום ששילמת עבור השירות.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">9. סיום שירות</h2>
            <p className="text-gray-700 leading-relaxed">
              אנו רשאים להשעות או לסיים את חשבונך במקרה של הפרת תנאים. אתה רשאי לסגור את
              החשבון בכל עת דרך הגדרות החשבון.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">10. שינויים בתנאים</h2>
            <p className="text-gray-700 leading-relaxed">
              אנו רשאים לעדכן תנאים אלו. שינויים משמעותיים יובאו לידיעתך באמצעות הודעה
              באתר או במייל. המשך שימוש לאחר שינוי מהווה הסכמה לתנאים המעודכנים.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">11. דין וסמכות שיפוט</h2>
            <p className="text-gray-700 leading-relaxed">
              תנאים אלו כפופים לדיני מדינת ישראל. סמכות השיפוט הבלעדית היא לבתי המשפט
              בישראל.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">12. יצירת קשר</h2>
            <p className="text-gray-700 leading-relaxed">
              לשאלות או בקשות הנוגעות לתנאי השימוש:
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

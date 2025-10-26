import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: 'איך זה עובד?',
    answer: 'זה פשוט! נרשמים לפלטפורמה, בוחרים תבנית, מזינים את פרטי העסק, מעלים לוגו ותמונות - והכרטיס מוכן. מקבלים קישור לשיתוף וקוד QR להדפסה.'
  },
  {
    question: 'האם יש תקופת ניסיון?',
    answer: 'כן! תוכל לבחון את הפלטפורמה ולראות איך הכרטיס נראה לפני התשלום. ברגע שאתה מרוצה, פשוט משלמים ומפרסמים את הכרטיס.'
  },
  {
    question: 'האם אפשר לערוך את הכרטיס אחרי הפרסום?',
    answer: 'בהחלט! תוכל לערוך את כל הפרטים בכל עת - לוגו, תמונות, טקסטים, קישורים וצבעים. השינויים מתעדכנים מיידית.'
  },
  {
    question: 'מה ההבדל בין Starter ל-Pro?',
    answer: 'תוכנית Starter מושלמת למתחילים עם כרטיס אחד ותבניות בסיסיות. Pro מציעה עד 5 כרטיסים, תבניות פרימיום, דומיין מותאם אישית ואנליטיקה מתקדמת.'
  },
  {
    question: 'האם הכרטיס עובד בכל מכשיר?',
    answer: 'כן! הכרטיס מותאם באופן אוטומטי לכל מכשיר - מחשב, טאבלט וסמארטפון. הוא נראה מושלם בכל גודל מסך.'
  },
  {
    question: 'איך משתפים את הכרטיס?',
    answer: 'יש מספר דרכים: שליחה בוואטסאפ, מייל, SMS, שיתוף ברשתות חברתיות, או סריקת קוד QR. כל לקוח יכול לפתוח את הכרטיס בדפדפן.'
  },
  {
    question: 'האם אפשר להדפיס את קוד ה-QR?',
    answer: 'בהחלט! כל כרטיס מגיע עם קוד QR באיכות גבוהה להדפסה. תוכל להדביק אותו על שלט, כרטיס ביקור פיזי, או חומרי פרסום.'
  },
  {
    question: 'מה קורה אם אבטל את המנוי?',
    answer: 'הכרטיס ימשיך לעבוד עד סוף תקופת התשלום שכבר שילמת. אחרי זה הוא יהפוך ללא פעיל, אבל כל הנתונים שלך נשמרים ותוכל לחדש בכל עת.'
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            שאלות נפוצות
          </h2>
          <p className="text-xl text-gray-600">
            מצא תשובות לשאלות הנפוצות ביותר
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="card cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </div>
              {openIndex === index && (
                <p className="mt-4 text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            יש לך שאלה אחרת?
          </p>
          <a href="mailto:support@mycards.co" className="btn btn-outline btn-md">
            צור קשר
          </a>
        </div>
      </div>
    </section>
  );
}

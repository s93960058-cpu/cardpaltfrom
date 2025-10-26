import { Check, Sparkles } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: '149',
    period: 'לשנה',
    monthlyPrice: '19',
    description: 'מושלם למתחילים ועצמאים',
    features: [
      'כרטיס דיגיטלי אחד',
      'תבניות בסיסיות',
      'QR להדפסה',
      'סטטיסטיקות בסיס',
      'העלאת לוגו ותמונות',
      'קישורים לרשתות חברתיות',
      'שיתוף בוואטסאפ/מייל'
    ],
    popular: false
  },
  {
    name: 'Pro',
    price: '349',
    period: 'לשנה',
    monthlyPrice: '39',
    description: 'לעסקים שרוצים יותר',
    features: [
      'עד 5 כרטיסים',
      'כל התבניות כולל פרימיום',
      'דומיין מותאם אישית',
      'אנליטיקה מתקדמת',
      'הסרת מיתוג MyCards',
      'גלריית תמונות מורחבת',
      'תמיכה עדיפות',
      'ייצוא ל-VCF'
    ],
    popular: true
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            תוכניות המערכת
          </h2>
          <p className="text-xl text-gray-600">
            כל התוכניות זמינות באמצעות קוד קופון בלבד
          </p>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mt-6">
            <p className="text-lg font-semibold text-blue-900 mb-2">
              💳 גישה לכל התוכניות רק בקופון
            </p>
            <p className="text-blue-700">
              קבל קוד קופון מהמנהלים שלנו כדי להתחיל להשתמש במערכת
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`card relative ${
                plan.popular
                  ? 'border-2 border-blue-500 shadow-xl scale-105'
                  : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 right-1/2 translate-x-1/2">
                  <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Sparkles className="w-4 h-4" />
                    הכי פופולרי
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-gray-900">
                    ₪{plan.price}
                  </span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  או ₪{plan.monthlyPrice}/חודש
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/signup"
                className={`btn w-full ${
                  plan.popular ? 'btn-primary' : 'btn-outline'
                } btn-lg`}
              >
                הירשם עם קופון
              </a>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-xl p-8 mb-6 max-w-3xl mx-auto shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              🎟️ איך להשיג קוד קופון?
            </h3>
            <p className="text-gray-700 mb-4">
              ההרשמה למערכת זמינה רק באמצעות קוד קופון ייחודי
            </p>
            <div className="bg-white rounded-lg p-4 text-right space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <span className="text-blue-600 font-bold">1.</span>
                <span>צור קשר עם המנהלים שלנו</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-blue-600 font-bold">2.</span>
                <span>קבל קוד קופון ייחודי</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-blue-600 font-bold">3.</span>
                <span>הירשם למערכת עם הקוד שקיבלת</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-blue-600 font-bold">4.</span>
                <span>התחל ליצור כרטיסים דיגיטליים מקצועיים!</span>
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              ✓ ללא גרסת ניסיון
            </span>
            <span className="flex items-center gap-1">
              ✓ גישה רק עם קופון
            </span>
            <span className="flex items-center gap-1">
              ✓ תמיכה מלאה
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

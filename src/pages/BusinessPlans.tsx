import { Check, Star, Shield, Zap, Users, BarChart3, Headphones, Lock } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const businessPlans = [
  {
    name: 'Pro',
    price: '₪99',
    period: 'לחודש',
    description: 'מושלם לעסקים קטנים',
    icon: Star,
    features: [
      { text: '5 כרטיסים דיגיטליים', included: true },
      { text: 'תבניות פרימיום', included: true },
      { text: 'העלאת לוגו ותמונות', included: true },
      { text: 'קישורי רשתות חברתיות', included: true },
      { text: 'אנליטיקס בסיסי', included: true },
      { text: 'QR Code מותאם אישית', included: true },
      { text: 'תמיכה במייל', included: true },
      { text: 'דומיין מותאם אישית', included: false },
      { text: 'אנליטיקס מתקדם', included: false },
      { text: 'API וגיבוי', included: false }
    ],
    cta: 'בחר ברשת Pro',
    highlighted: false,
    planId: 'pro'
  },
  {
    name: 'Business',
    price: '₪199',
    period: 'לחודש',
    description: 'המומלץ לעסקים בינוניים',
    icon: Zap,
    features: [
      { text: '15 כרטיסים דיגיטליים', included: true },
      { text: 'כל התבניות הפרימיום', included: true },
      { text: 'העלאת תמונות ללא הגבלה', included: true },
      { text: 'גלריית תמונות מלאה', included: true },
      { text: 'אנליטיקס מתקדם', included: true },
      { text: 'QR Code מותאם אישית', included: true },
      { text: 'תמיכה בטלפון ומייל', included: true },
      { text: 'דומיין מותאם אישית', included: true },
      { text: 'הסרת מיתוג MyCards', included: true },
      { text: 'גיבוי אוטומטי', included: true }
    ],
    cta: 'בחר ברשת Business',
    highlighted: true,
    planId: 'business'
  },
  {
    name: 'Enterprise',
    price: '₪399',
    period: 'לחודש',
    description: 'לארגונים גדולים ופתרונות מיוחדים',
    icon: Shield,
    features: [
      { text: 'כרטיסים ללא הגבלה', included: true },
      { text: 'כל התכונות של Business', included: true },
      { text: 'API מותאם אישית', included: true },
      { text: 'אינטגרציות מתקדמות', included: true },
      { text: 'ניהול צוות מלא', included: true },
      { text: 'תמיכה 24/7', included: true },
      { text: 'מנהל חשבון ייעודי', included: true },
      { text: 'התאמות מיוחדות', included: true },
      { text: 'SLA 99.9%', included: true },
      { text: 'ייעוץ ועיצוב אישי', included: true }
    ],
    cta: 'צור קשר',
    highlighted: false,
    planId: 'enterprise'
  }
];

const comparisonFeatures = [
  { category: 'כרטיסים', features: ['מספר כרטיסים', 'תבניות', 'עיצוב מותאם אישית'] },
  { category: 'תכונות', features: ['QR Code', 'גלריה מלאה', 'אנליטיקס'] },
  { category: 'דומיין וניירוט', features: ['דומיין מותאם אישית', 'הסרת מיתוג MyCards', 'כתובות אימייל מיוחדות'] },
  { category: 'תמיכה', features: ['תמיכה בטלפון', 'מנהל חשבון ייעודי', 'SLA מובטח'] }
];

export function BusinessPlans() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const handleSelectPlan = (planId: string) => {
    if (!user) {
      navigate('/signup');
      return;
    }

    if (planId === 'enterprise') {
      navigate('/contact');
      return;
    }

    const queryParams = new URLSearchParams();
    queryParams.set('plan', planId);
    if (billingPeriod === 'yearly') {
      queryParams.set('billing', 'yearly');
    }
    navigate(`/checkout?${queryParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            תוכניות עסקיות
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            בחר את התוכנית המושלמת לעסקך. כל התוכניות כוללות גישה מלאה ללוח הבקרה שלנו
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                billingPeriod === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              חודשי
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-lg font-medium transition relative ${
                billingPeriod === 'yearly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              שנתי
              <span className="absolute -top-8 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded">
                חסכון 20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {businessPlans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.planId}
                className={`rounded-2xl transition transform hover:scale-105 ${
                  plan.highlighted
                    ? 'bg-white border-2 border-blue-600 shadow-2xl ring-2 ring-blue-100 relative md:scale-105'
                    : 'bg-white border border-gray-200 shadow-lg'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      המומלץ
                    </span>
                  </div>
                )}

                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="w-8 h-8 text-blue-600" />
                    <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  </div>

                  <p className="text-gray-600 text-sm mb-6">{plan.description}</p>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600">{plan.period}</span>
                    </div>
                    {billingPeriod === 'yearly' && (
                      <p className="text-sm text-green-600 mt-2">
                        חסכון של ₪{(parseInt(plan.price.substring(1)) * 2.4).toFixed(0)} בשנה
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleSelectPlan(plan.planId)}
                    className={`w-full py-3 px-4 rounded-lg font-medium mb-8 transition ${
                      plan.highlighted
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </button>

                  <div className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <div className="w-5 h-5 border border-gray-300 rounded flex-shrink-0 mt-0.5" />
                        )}
                        <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-12 mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            השוואה מלאה
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-right py-4 px-4 font-bold text-gray-900"></th>
                  {businessPlans.map((plan) => (
                    <th key={plan.planId} className="text-center py-4 px-4 font-bold text-gray-900">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((category, catIdx) => (
                  <tr key={catIdx} className="border-b border-gray-100">
                    <td className="py-6 px-4 font-bold text-gray-900 bg-gray-50">
                      {category.category}
                    </td>
                    {businessPlans.map((plan) => (
                      <td key={plan.planId} className="text-center py-6 px-4">
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">צריך עזרה בבחירת התוכנית הנכונה?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            צוות התמיכה שלנו כאן כדי לעזור לך למצוא את הפתרון המושלם לעסקך
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition"
          >
            צור קשר עם צוות המכירות
          </button>
        </div>
      </div>
    </div>
  );
}

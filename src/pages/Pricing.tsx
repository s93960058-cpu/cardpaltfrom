import { Check, Tag, CreditCard } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const plans = [
  {
    name: 'Pro',
    price: '₪99',
    period: 'לחודש',
    description: 'מושלם לעסקים קטנים ובינוניים',
    features: [
      '5 כרטיסים דיגיטליים',
      'תבניות פרימיום',
      'העלאת לוגו ותמונות',
      'קישורי רשתות חברתיות',
      'אנליטיקס בסיסי',
      'תמיכה במייל',
      'QR Code מותאם אישית',
      'עדכונים בזמן אמת'
    ],
    highlighted: false,
    planId: 'pro'
  },
  {
    name: 'Business',
    price: '₪199',
    period: 'לחודש',
    description: 'הפתרון המושלם לעסקים גדולים',
    features: [
      '15 כרטיסים דיגיטליים',
      'כל התבניות הפרימיום',
      'העלאת תמונות ללא הגבלה',
      'גלריית תמונות מלאה',
      'אנליטיקס מתקדם',
      'תמיכה בטלפון ומייל',
      'דומיין מותאם אישית',
      'הסרת מיתוג MyCards',
      'עדיפות בתמיכה',
      'גיבוי אוטומטי'
    ],
    highlighted: true,
    planId: 'business'
  },
  {
    name: 'Enterprise',
    price: '₪399',
    period: 'לחודש',
    description: 'פתרון מלא לארגונים',
    features: [
      'כרטיסים ללא הגבלה',
      'כל התכונות של Business',
      'API מותאם אישית',
      'אינטגרציות מתקדמות',
      'תמיכה 24/7',
      'מנהל חשבון ייעודי',
      'הדרכה אישית',
      'התאמות מיוחדות',
      'SLA 99.9%',
      'ייעוץ ועיצוב'
    ],
    highlighted: false,
    planId: 'enterprise'
  }
];

export function Pricing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [showCouponInput, setShowCouponInput] = useState(false);

  const handleSelectPlan = (planId: string) => {
    if (!user) {
      navigate('/signup');
      return;
    }

    const queryParams = new URLSearchParams();
    queryParams.set('plan', planId);
    if (couponCode) {
      queryParams.set('coupon', couponCode);
    }
    navigate(`/checkout?${queryParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Tag className="w-4 h-4" />
            תוכניות מנוי
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            בחר את התוכנית המתאימה לך
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            כל התוכניות כוללות תמיכה מלאה, עדכונים שוטפים ואבטחה ברמה הגבוהה ביותר
          </p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => setShowCouponInput(!showCouponInput)}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <Tag className="w-4 h-4" />
              יש לך קוד קופון?
            </button>
          </div>

          {showCouponInput && (
            <div className="max-w-md mx-auto mb-8">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="הזן קוד קופון"
                  className="input flex-1"
                />
                {couponCode && (
                  <button
                    onClick={() => setCouponCode('')}
                    className="btn btn-secondary"
                  >
                    נקה
                  </button>
                )}
              </div>
              {couponCode && (
                <p className="text-sm text-green-600 mt-2">
                  קוד הקופון יוחל בעמוד התשלום
                </p>
              )}
            </div>
          )}

          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-6 py-3 rounded-lg">
            <CreditCard className="w-5 h-5" />
            <span className="font-medium">
              תשלום חודשי גמיש | ביטול בכל עת | ללא עמלות סמויות
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.planId}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-105 ${
                plan.highlighted ? 'ring-4 ring-blue-500' : ''
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-center py-2 text-sm font-bold">
                  המומלץ ביותר
                </div>
              )}

              <div className={`p-8 ${plan.highlighted ? 'pt-14' : ''}`}>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-6 min-h-[48px]">
                  {plan.description}
                </p>

                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  {couponCode && (
                    <p className="text-sm text-green-600 mt-2">
                      הנחה תוחל בקופה
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleSelectPlan(plan.planId)}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition mb-8 ${
                    plan.highlighted
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  בחר תוכנית
                </button>

                <div className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              שאלות נוספות?
            </h3>
            <p className="text-gray-600 mb-6">
              נשמח לעזור לך לבחור את התוכנית המתאימה ביותר לצרכים שלך
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="/contact"
                className="btn btn-primary"
              >
                צור קשר
              </a>
              <a
                href="/#faq"
                className="btn btn-secondary"
              >
                שאלות נפוצות
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

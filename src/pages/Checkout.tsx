import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Check, Tag, Loader } from 'lucide-react';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 149,
    monthlyPrice: 19,
    features: [
      'כרטיס דיגיטלי אחד',
      'תבניות בסיסיות',
      'QR להדפסה',
      'סטטיסטיקות בסיס',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 349,
    monthlyPrice: 39,
    features: [
      'עד 5 כרטיסים',
      'כל התבניות כולל פרימיום',
      'דומיין מותאם אישית',
      'אנליטיקה מתקדמת',
      'הסרת מיתוג',
    ],
  },
];

export function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'coupon' | 'credit'>('coupon');

  const plan = plans.find((p) => p.id === selectedPlan)!;
  const basePrice = plan.price;
  const discount = appliedCoupon
    ? appliedCoupon.type === 'percent'
      ? (basePrice * appliedCoupon.value) / 100
      : appliedCoupon.value
    : 0;
  const finalPrice = basePrice - discount;

  const validateCoupon = async () => {
    setCouponError('');
    setAppliedCoupon(null);

    if (!couponCode.trim()) return;

    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode.toUpperCase())
      .eq('is_active', true)
      .maybeSingle();

    if (error || !coupon) {
      setCouponError('קוד קופון לא תקין');
      return;
    }

    const now = new Date();
    const startsAt = new Date(coupon.starts_at);
    const endsAt = coupon.ends_at ? new Date(coupon.ends_at) : null;

    if (now < startsAt) {
      setCouponError('הקופון עדיין לא תקף');
      return;
    }

    if (endsAt && now > endsAt) {
      setCouponError('הקופון פג תוקף');
      return;
    }

    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
      setCouponError('הקופון מוצה');
      return;
    }

    if (coupon.min_amount && basePrice < coupon.min_amount) {
      setCouponError(`קופון זה תקף להזמנות מעל ₪${coupon.min_amount}`);
      return;
    }

    if (coupon.allowed_plans && !coupon.allowed_plans.includes(selectedPlan)) {
      setCouponError('קופון זה לא תקף לתוכנית שבחרת');
      return;
    }

    setAppliedCoupon(coupon);
  };

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (paymentMethod === 'credit') {
      alert('אנו מבצעים שדרוג למערכת הסליקה. אנא נסה שוב בעוד מספר שעות או השתמש בקוד קופון.');
      setLoading(false);
      return;
    }

    if (!appliedCoupon) {
      alert('יש להזין קוד קופון תקף לפני ביצוע התשלום');
      return;
    }

    setLoading(true);

    const periodStart = new Date();
    const periodEnd = new Date();
    periodEnd.setFullYear(periodEnd.getFullYear() + 1);

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        plan: selectedPlan,
        amount: finalPrice,
        currency: 'ILS',
        coupon_id: appliedCoupon?.id || null,
        discount_amount: discount,
        status: 'paid',
        period_start: periodStart.toISOString(),
        period_end: periodEnd.toISOString(),
      })
      .select()
      .single();

    if (orderError) {
      alert('שגיאה ביצירת הזמנה');
      setLoading(false);
      return;
    }

    await supabase
      .from('profiles')
      .update({ plan: selectedPlan })
      .eq('id', user.id);

    if (appliedCoupon) {
      await supabase
        .from('coupons')
        .update({ used_count: appliedCoupon.used_count + 1 })
        .eq('id', appliedCoupon.id);
    }

    setLoading(false);
    alert('התשלום בוצע בהצלחה! התוכנית שלך עודכנה.');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container-custom max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CreditCard className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">MyCards</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">בחר תוכנית</h1>
          <p className="text-gray-600">שדרג את החשבון שלך והתחל ליצור כרטיסים</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {plans.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedPlan(p.id)}
              className={`card cursor-pointer transition-all ${
                selectedPlan === p.id
                  ? 'border-2 border-blue-600 shadow-lg'
                  : 'border-2 border-transparent'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">{p.name}</h3>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedPlan === p.id
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedPlan === p.id && <Check className="w-4 h-4 text-white" />}
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold text-gray-900">₪{p.price}</span>
                <span className="text-gray-600">לשנה</span>
              </div>

              <ul className="space-y-2 mb-4">
                {p.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <Check className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="card mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">אמצעי תשלום</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div
              onClick={() => setPaymentMethod('coupon')}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                paymentMethod === 'coupon'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Tag className="w-6 h-6 text-blue-600" />
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'coupon'
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300'
                  }`}
                >
                  {paymentMethod === 'coupon' && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">קוד קופון</h4>
              <p className="text-sm text-gray-600">תשלום עם קוד קופון</p>
            </div>

            <div
              onClick={() => setPaymentMethod('credit')}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                paymentMethod === 'credit'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <CreditCard className="w-6 h-6 text-blue-600" />
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'credit'
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300'
                  }`}
                >
                  {paymentMethod === 'credit' && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">כרטיס אשראי</h4>
              <p className="text-sm text-gray-600">תשלום באשראי</p>
            </div>
          </div>

          {paymentMethod === 'coupon' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                קוד קופון <span className="text-red-600">*</span>
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="הזן קוד קופון"
                  className="input flex-1"
                  required
                />
                <button onClick={validateCoupon} className="btn btn-outline btn-md">
                  <Tag className="w-4 h-4 ml-2" />
                  הפעל
                </button>
              </div>
              {couponError && (
                <p className="text-sm text-red-600 mt-2">{couponError}</p>
              )}
              {appliedCoupon && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">
                    ✓ קופון הופעל! חסכת ₪{discount.toFixed(0)}
                  </p>
                </div>
              )}
            </div>
          )}

          {paymentMethod === 'credit' && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 font-medium mb-1">
                ⚠️ מערכת התשלומים באשראי בשדרוג
              </p>
              <p className="text-sm text-yellow-700">
                אנו מבצעים שדרוג למערכת הסליקה. אנא נסה שוב בעוד מספר שעות או השתמש בקוד קופון.
              </p>
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 mb-4">סיכום הזמנה</h3>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">תוכנית {plan.name}</span>
              <span className="font-semibold">₪{basePrice}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-green-600">
                <span>הנחה ({appliedCoupon.code})</span>
                <span>-₪{discount.toFixed(0)}</span>
              </div>
            )}
            <div className="border-t pt-3 flex justify-between text-lg font-bold">
              <span>סה״כ לתשלום</span>
              <span>₪{finalPrice.toFixed(0)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading || (paymentMethod === 'coupon' && !appliedCoupon)}
            className="btn btn-primary btn-lg w-full"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                מעבד...
              </>
            ) : (
              <>
                {paymentMethod === 'coupon' ? <Tag className="w-5 h-5 ml-2" /> : <CreditCard className="w-5 h-5 ml-2" />}
                {paymentMethod === 'coupon' ? 'הפעל קופון ושדרג' : 'המשך לתשלום'}
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            לחיצה על "המשך לתשלום" מהווה הסכמה לתנאי השימוש ומדיניות הפרטיות
          </p>
        </div>
      </div>
    </div>
  );
}

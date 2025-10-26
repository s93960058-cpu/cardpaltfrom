import { useState } from 'react';
import { Phone, Check, AlertCircle, Loader2 } from 'lucide-react';

interface PhoneVerificationProps {
  onVerified: (phoneNumber: string) => void;
  initialPhone?: string;
}

export default function PhoneVerification({ onVerified, initialPhone = '' }: PhoneVerificationProps) {
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationId, setVerificationId] = useState('');

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.startsWith('972')) {
      return cleaned;
    }
    if (cleaned.startsWith('0')) {
      return '972' + cleaned.substring(1);
    }
    return '972' + cleaned;
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);

      if (formattedPhone.length < 12) {
        setError('מספר טלפון לא תקין');
        setLoading(false);
        return;
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      const { data: { user } } = await window.supabase.auth.getUser();

      if (!user) {
        setError('יש להתחבר כדי לאמת מספר טלפון');
        setLoading(false);
        return;
      }

      const { data, error: dbError } = await window.supabase
        .from('phone_verifications')
        .insert({
          user_id: user.id,
          phone_number: formattedPhone,
          verification_code: code,
          expires_at: expiresAt,
          is_verified: false,
          attempts: 0
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setVerificationId(data.id);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const { data: { session } } = await window.supabase.auth.getSession();

      const smsResponse = await fetch(`${supabaseUrl}/functions/v1/send-sms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || supabaseKey}`,
        },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
          code: code,
        }),
      });

      const smsResult = await smsResponse.json();

      if (!smsResponse.ok) {
        console.error('SMS sending failed:', smsResult);
        if (smsResult.code) {
          alert(`קוד אימות (לפיתוח): ${code}`);
        }
      } else {
        console.log('SMS sent successfully');
      }

      setStep('code');
    } catch (err) {
      console.error('Error sending verification code:', err);
      setError('שגיאה בשליחת קוד אימות');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data: verification, error: fetchError } = await window.supabase
        .from('phone_verifications')
        .select('*')
        .eq('id', verificationId)
        .single();

      if (fetchError) throw fetchError;

      if (new Date(verification.expires_at) < new Date()) {
        setError('הקוד פג תוקף. אנא בקש קוד חדש');
        setStep('phone');
        setLoading(false);
        return;
      }

      if (verification.attempts >= 3) {
        setError('חרגת ממספר הניסיונות המותר. אנא בקש קוד חדש');
        setStep('phone');
        setLoading(false);
        return;
      }

      if (verification.verification_code !== verificationCode) {
        await window.supabase
          .from('phone_verifications')
          .update({ attempts: verification.attempts + 1 })
          .eq('id', verificationId);

        setError(`קוד שגוי. נותרו ${2 - verification.attempts} ניסיונות`);
        setLoading(false);
        return;
      }

      await window.supabase
        .from('phone_verifications')
        .update({ is_verified: true })
        .eq('id', verificationId);

      const { data: { user } } = await window.supabase.auth.getUser();
      if (user) {
        await window.supabase
          .from('profiles')
          .update({
            phone_verified: true,
            phone_verified_at: new Date().toISOString()
          })
          .eq('id', user.id);
      }

      onVerified(verification.phone_number);
    } catch (err) {
      console.error('Error verifying code:', err);
      setError('שגיאה באימות הקוד');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = () => {
    setStep('phone');
    setVerificationCode('');
    setError('');
  };

  if (step === 'phone') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Phone className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">אימות מספר טלפון</h3>
            <p className="text-sm text-gray-600">נשלח אליך קוד אימות ב-SMS</p>
          </div>
        </div>

        <form onSubmit={handleSendCode} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              מספר טלפון
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="050-1234567"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              dir="ltr"
            />
            <p className="text-xs text-gray-500 mt-1">
              הזן מספר טלפון ישראלי (עם או בלי 0 בהתחלה)
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !phoneNumber}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>שולח קוד...</span>
              </>
            ) : (
              <>
                <Phone className="w-5 h-5" />
                <span>שלח קוד אימות</span>
              </>
            )}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <Check className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">הזן קוד אימות</h3>
          <p className="text-sm text-gray-600">קוד בן 6 ספרות נשלח ל-{phoneNumber}</p>
        </div>
      </div>

      <form onSubmit={handleVerifyCode} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            קוד אימות
          </label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="123456"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-2xl tracking-widest font-mono"
            required
            maxLength={6}
            dir="ltr"
          />
          <p className="text-xs text-gray-500 mt-1 text-center">
            הקוד תקף ל-10 דקות
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-2">
          <button
            type="submit"
            disabled={loading || verificationCode.length !== 6}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>מאמת...</span>
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                <span>אמת קוד</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleResendCode}
            className="w-full text-blue-600 py-2 text-sm hover:text-blue-700 transition-colors"
          >
            לא קיבלת קוד? שלח שוב
          </button>
        </div>
      </form>
    </div>
  );
}

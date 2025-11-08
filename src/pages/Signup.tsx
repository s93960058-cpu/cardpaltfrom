import { useState } from 'react';
import { CreditCard, Loader, ArrowRight, Mail, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [signupMode, setSignupMode] = useState<'email' | 'phone'>('email');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!agreed) {
      setError('יש להסכים למדיניות הפרטיות ותנאי השימוש');
      return;
    }

    if (signupMode === 'email' && password.length < 6) {
      setError('הסיסמה חייבת להכיל לפחות 6 תווים');
      return;
    }

    if (signupMode === 'phone' && phone.length < 10) {
      setError('אנא הזן מספר טלפון תקין');
      return;
    }

    setLoading(true);

    try {
      if (signupMode === 'phone') {
        const { error } = await supabase.auth.signInWithOtp({
          phone: phone,
          options: {
            data: {
              full_name: fullName
            }
          }
        });

        if (error) {
          setError(error.message || 'שגיאה בשליחת קוד אימות');
          setLoading(false);
          return;
        }

        localStorage.setItem('signup_phone_number', phone);
        localStorage.setItem('signup_full_name', fullName);
        setOtpSent(true);
        setError('קוד אימות נשלח לטלפון שלך!');
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          setError(error.message === 'User already registered'
            ? 'משתמש זה כבר רשום במערכת'
            : 'אירעה שגיאה בהרשמה, נסה שנית');
        } else {
          if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
          }
          setError('נרשמת בהצלחה! נשלח אליך מייל עם קישור לאימות. אנא בדוק את תיבת הדואר שלך.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'שגיאה בהרשמה');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const savedPhone = localStorage.getItem('signup_phone_number');

      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        phone: savedPhone!,
        token: otp,
        type: 'sms'
      });

      if (verifyError) {
        setError('קוד אימות שגוי');
        setLoading(false);
        return;
      }

      localStorage.removeItem('signup_phone_number');
      localStorage.removeItem('signup_full_name');

      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'שגיאה באימות הקוד');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'שגיאה בהרשמה עם Google');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 mb-6">
            <CreditCard className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">MyCards</span>
          </a>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            הירשם עכשיו
          </h1>
          <p className="text-gray-600">
            הצטרף למערכת והתחל ליצור כרטיסים דיגיטליים מקצועיים
          </p>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>שים לב:</strong> לאחר ההרשמה תקבל מייל עם קישור לאימות כתובת המייל שלך.
              יש לאמת את המייל כדי להתחבר למערכת.
            </p>
          </div>
        </div>

        <div className="card">
          {otpSent && signupMode === 'phone' ? (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold mb-2">הזן קוד אימות</h2>
                <p className="text-sm text-gray-600">שלחנו קוד אימות למספר {phone}</p>
              </div>

              {error && (
                <div className={`${error.includes('נשלח') ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'} border px-4 py-3 rounded-lg text-sm`}>
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                  קוד אימות (6 ספרות)
                </label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="input text-center text-2xl tracking-widest"
                  placeholder="000000"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="btn btn-primary btn-lg w-full"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    מאמת...
                  </>
                ) : (
                  'אמת והירשם'
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setOtp('');
                  setError('');
                }}
                className="w-full text-sm text-blue-600 hover:underline"
              >
                חזור לשליחת קוד מחדש
              </button>
            </form>
          ) : (
            <>
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setSignupMode('email')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${signupMode === 'email' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <Mail className="w-4 h-4 inline ml-2" />
              מייל
            </button>
            <button
              onClick={() => setSignupMode('phone')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${signupMode === 'phone' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <Phone className="w-4 h-4 inline ml-2" />
              טלפון
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className={`${error.includes('קוד אימות') ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'} border px-4 py-3 rounded-lg text-sm`}>
                {error}
              </div>
            )}

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                שם מלא
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input"
                placeholder="יוסי כהן"
                required
              />
            </div>

            {signupMode === 'email' ? (
              <>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    כתובת מייל
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                    placeholder="name@example.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    סיסמה
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input"
                    placeholder="לפחות 6 תווים"
                    required
                    minLength={6}
                  />
                </div>
              </>
            ) : (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  מספר טלפון
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input"
                  placeholder="+972-50-123-4567"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  יישלח אליך קוד אימות ב-SMS
                </p>
              </div>
            )}

            <div className="flex items-start gap-2">
              <input
                id="terms"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                אני מסכים ל
                <a href="/terms" className="text-blue-600 hover:underline mx-1">
                  תנאי השימוש
                </a>
                ול
                <a href="/privacy" className="text-blue-600 hover:underline mx-1">
                  מדיניות הפרטיות
                </a>
              </label>
            </div>

            {signupMode === 'email' && (
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="rememberMe" className="mr-2 text-sm text-gray-700">
                  זכור אותי
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg w-full"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  נרשם...
                </>
              ) : (
                <>
                  {signupMode === 'phone' ? 'שלח קוד אימות' : 'הירשם עכשיו'}
                  <ArrowRight className="w-5 h-5 mr-2" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">או</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            הירשם עם Google
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              כבר יש לך חשבון?{' '}
              <a href="/login" className="text-blue-600 font-medium hover:underline">
                התחבר כאן
              </a>
            </p>
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

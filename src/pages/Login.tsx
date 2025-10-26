import { useState } from 'react';
import { CreditCard, Loader, ArrowRight, Mail, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loginMode, setLoginMode] = useState<'email' | 'phone'>('email');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (loginMode === 'phone') {
        const { data, error } = await supabase.auth.signInWithOtp({
          phone: phone
        });

        if (error) throw error;

        localStorage.setItem('login_phone_number', phone);
        setOtpSent(true);
        setError('קוד אימות נשלח לטלפון שלך!');
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message === 'Invalid login credentials'
            ? 'מייל או סיסמה שגויים'
            : 'אירעה שגיאה בהתחברות, נסה שנית');
        } else {
          if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
          }
          window.location.href = '/dashboard';
        }
      }
    } catch (err: any) {
      setError(err.message || 'שגיאה בהתחברות');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const savedPhone = localStorage.getItem('login_phone_number');

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

      localStorage.removeItem('login_phone_number');

      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'שגיאה באימות הקוד');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
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
      setError(err.message || 'שגיאה בהתחברות עם Google');
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetMessage('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) throw error;
      setResetMessage('נשלח לינק לאיפוס סיסמה למייל שלך!');
    } catch (err: any) {
      setResetMessage('שגיאה בשליחת מייל לאיפוס סיסמה');
    } finally {
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
            התחבר לחשבון
          </h1>
          <p className="text-gray-600">
            ברוך שובך! המשך ליצירת כרטיסים דיגיטליים
          </p>
        </div>

        <div className="card">
          {showForgotPassword ? (
            <div>
              <button
                onClick={() => setShowForgotPassword(false)}
                className="text-sm text-blue-600 hover:underline mb-4"
              >
                ← חזור להתחברות
              </button>
              <h2 className="text-xl font-bold mb-4">שכחתי סיסמה</h2>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                {resetMessage && (
                  <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
                    {resetMessage}
                  </div>
                )}
                <div>
                  <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    כתובת מייל
                  </label>
                  <input
                    id="resetEmail"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="input"
                    placeholder="name@example.com"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-lg w-full"
                >
                  {loading ? 'שולח...' : 'שלח לינק לאיפוס סיסמה'}
                </button>
              </form>
            </div>
          ) : otpSent && loginMode === 'phone' ? (
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
                  'אמת והתחבר'
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
                  onClick={() => setLoginMode('email')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${loginMode === 'email' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <Mail className="w-4 h-4 inline ml-2" />
                  מייל
                </button>
                <button
                  onClick={() => setLoginMode('phone')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${loginMode === 'phone' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
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

                {loginMode === 'email' ? (
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
                      <div className="flex justify-between items-center mb-1">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                          סיסמה
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(true)}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          שכחתי סיסמה
                        </button>
                      </div>
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input"
                        placeholder="הסיסמה שלך"
                        required
                      />
                    </div>

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

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-lg w-full"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      מתחבר...
                    </>
                  ) : (
                    <>
                      {loginMode === 'phone' ? 'שלח קוד אימות' : 'התחבר'}
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
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                התחבר עם Google
              </button>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  אין לך חשבון?{' '}
                  <a href="/signup" className="text-blue-600 font-medium hover:underline">
                    הירשם כאן
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

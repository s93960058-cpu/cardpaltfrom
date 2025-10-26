import { useState, useEffect } from 'react';
import { Mail, CheckCircle, XCircle, Loader, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'resend'>('loading');
  const [message, setMessage] = useState('מאמת את כתובת המייל שלך...');
  const [email, setEmail] = useState('');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      verifyToken(token);
    } else {
      setStatus('error');
      setMessage('לא נמצא קוד אימות. אנא בדוק את הקישור שנשלח אליך במייל.');
    }
  }, [searchParams]);

  const verifyToken = async (token: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, email_verified')
        .eq('verification_token', token)
        .maybeSingle();

      if (error || !data) {
        setStatus('error');
        setMessage('קוד האימות אינו תקין או שפג תוקפו.');
        return;
      }

      if (data.email_verified) {
        setStatus('success');
        setMessage('כתובת המייל שלך כבר מאומתת!');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          email_verified: true,
          email_verified_at: new Date().toISOString(),
          verification_token: null
        })
        .eq('id', data.id);

      if (updateError) {
        setStatus('error');
        setMessage('אירעה שגיאה באימות המייל. אנא נסה שנית.');
        return;
      }

      setStatus('success');
      setMessage('כתובת המייל אומתה בהצלחה! מעביר אותך לדף ההתחברות...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setStatus('error');
      setMessage('אירעה שגיאה באימות המייל. אנא נסה שנית.');
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setMessage('אנא הזן את כתובת המייל שלך');
      return;
    }

    setResending(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email_verified')
        .eq('email', email.toLowerCase())
        .maybeSingle();

      if (error || !data) {
        setMessage('כתובת המייל לא נמצאה במערכת');
        setResending(false);
        return;
      }

      if (data.email_verified) {
        setMessage('כתובת המייל שלך כבר מאומתת!');
        setStatus('success');
        setResending(false);
        return;
      }

      const newToken = crypto.randomUUID().replace(/-/g, '');
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          verification_token: newToken,
          verification_sent_at: new Date().toISOString()
        })
        .eq('id', data.id);

      if (updateError) {
        setMessage('אירעה שגיאה בשליחת המייל. אנא נסה שנית.');
        setResending(false);
        return;
      }

      setMessage('מייל אימות חדש נשלח! בדוק את תיבת הדואר שלך.');
      setStatus('success');
    } catch (err) {
      setMessage('אירעה שגיאה. אנא נסה שנית.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            {status === 'loading' && <Loader className="w-8 h-8 text-blue-600 animate-spin" />}
            {status === 'success' && <CheckCircle className="w-8 h-8 text-green-600" />}
            {status === 'error' && <XCircle className="w-8 h-8 text-red-600" />}
            {status === 'resend' && <Mail className="w-8 h-8 text-blue-600" />}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {status === 'loading' && 'מאמת מייל...'}
            {status === 'success' && 'מייל אומת!'}
            {status === 'error' && 'שגיאה באימות'}
            {status === 'resend' && 'שלח מייל חדש'}
          </h1>
        </div>

        <div className="card">
          <div className={`text-center p-4 rounded-lg mb-6 ${
            status === 'success' ? 'bg-green-50 text-green-700' :
            status === 'error' ? 'bg-red-50 text-red-700' :
            'bg-blue-50 text-blue-700'
          }`}>
            <p>{message}</p>
          </div>

          {status === 'error' && (
            <div className="space-y-4">
              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-600 mb-4 text-center">
                  לא קיבלת מייל אימות? שלח שוב
                </p>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    כתובת מייל
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input mb-4"
                    placeholder="name@example.com"
                  />
                </div>
                <button
                  onClick={handleResendVerification}
                  disabled={resending}
                  className="btn btn-primary w-full"
                >
                  {resending ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      שולח...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      שלח מייל אימות
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-4 border-t border-gray-200">
                <a
                  href="/login"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  חזור להתחברות
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <a
                href="/login"
                className="btn btn-primary w-full"
              >
                עבור להתחברות
                <ArrowRight className="w-5 h-5 mr-2" />
              </a>
            </div>
          )}

          {status === 'loading' && (
            <div className="text-center text-gray-500">
              אנא המתן...
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            צריך עזרה?{' '}
            <a href="/contact" className="text-blue-600 hover:underline font-medium">
              צור קשר
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

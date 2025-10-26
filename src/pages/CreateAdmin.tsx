import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { CreditCard, Shield, Loader } from 'lucide-react';

export function CreateAdmin() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const createAdminUser = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: 'shay053713@gmail.com',
        password: '555333111',
      });

      if (authError) {
        setError('שגיאה ביצירת משתמש: ' + authError.message);
        setLoading(false);
        return;
      }

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: 'shay053713@gmail.com',
            full_name: 'Admin User',
            plan: 'enterprise',
            status: 'active',
          });

        if (profileError) {
          setError('שגיאה ביצירת פרופיל: ' + profileError.message);
        } else {
          setMessage('משתמש אדמין נוצר בהצלחה! אתה יכול עכשיו להתחבר עם המייל והסיסמה.');
        }
      }
    } catch (err: any) {
      setError('שגיאה: ' + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CreditCard className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">MyCards</span>
          </div>
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            יצירת משתמש אדמין
          </h1>
          <p className="text-gray-600">
            לחץ על הכפתור למטה ליצירת משתמש אדמין במערכת
          </p>
        </div>

        <div className="card">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
              {message}
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 mb-2">
              <strong>פרטי משתמש אדמין:</strong>
            </p>
            <p className="text-sm text-blue-800">
              מייל: shay053713@gmail.com
              <br />
              סיסמה: 555333111
              <br />
              תוכנית: Enterprise
            </p>
          </div>

          <button
            onClick={createAdminUser}
            disabled={loading}
            className="btn btn-primary btn-lg w-full"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                יוצר משתמש...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5 ml-2" />
                צור משתמש אדמין
              </>
            )}
          </button>

          {message && (
            <div className="mt-6 space-y-3">
              <a href="/login" className="btn btn-outline btn-md w-full">
                עבור להתחברות
              </a>
              <a href="/" className="btn btn-secondary btn-md w-full">
                חזור לדף הבית
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

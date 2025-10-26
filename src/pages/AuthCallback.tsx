import { useEffect, useState } from 'react';
import { Loader, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function AuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('מאמת את ההתחברות...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (accessToken && refreshToken) {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) throw error;

          if (data.session) {
            setStatus('success');
            setMessage('התחברת בהצלחה!');
            window.history.replaceState({}, document.title, '/dashboard');
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 1000);
            return;
          }
        }

        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session) {
          setStatus('success');
          setMessage('התחברת בהצלחה!');
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1500);
        } else {
          throw new Error('לא נמצאה סשן');
        }
      } catch (err: any) {
        setStatus('error');
        setMessage(err.message || 'שגיאה בהתחברות');
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      }
    };

    handleAuthCallback();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="card text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
            {status === 'loading' && <Loader className="w-8 h-8 text-blue-600 animate-spin" />}
            {status === 'success' && <CheckCircle className="w-8 h-8 text-green-600" />}
            {status === 'error' && <XCircle className="w-8 h-8 text-red-600" />}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {status === 'loading' && 'מאמת...'}
            {status === 'success' && 'הצלחה!'}
            {status === 'error' && 'שגיאה'}
          </h1>
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
}

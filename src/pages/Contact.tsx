import { useState, useEffect } from 'react';
import { CreditCard, ArrowRight, Send, Mail, Bug, HelpCircle, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function Contact() {
  const { user } = useAuth();
  const [deviceInfo, setDeviceInfo] = useState({ ip: '', device: '', browser: '', userAgent: '' });
  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
    type: 'bug',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();

        const ua = navigator.userAgent;
        let device = 'Desktop';
        if (/Mobile|Android|iPhone|iPad/i.test(ua)) {
          device = /iPhone|iPad/i.test(ua) ? 'iOS' : 'Android';
        }

        let browser = 'Other';
        if (ua.includes('Chrome')) browser = 'Chrome';
        else if (ua.includes('Firefox')) browser = 'Firefox';
        else if (ua.includes('Safari')) browser = 'Safari';
        else if (ua.includes('Edge')) browser = 'Edge';

        setDeviceInfo({
          ip: data.ip,
          device,
          browser,
          userAgent: ua,
        });
      } catch (error) {
        console.error('Error fetching device info:', error);
      }
    };

    fetchDeviceInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('contact_messages').insert({
        user_id: user?.id || null,
        name: formData.name,
        email: formData.email,
        type: formData.type,
        subject: formData.subject,
        message: formData.message,
        device_info: deviceInfo,
        page_url: window.location.href,
        referrer: document.referrer || null,
      });

      if (error) throw error;

      setSubmitted(true);
      setFormData({
        name: '',
        email: user?.email || '',
        type: 'bug',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('שגיאה בשליחת הטופס. אנא נסה שוב.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center gap-2">
              <CreditCard className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">MyCards</span>
            </a>
            <a href={user ? '/dashboard' : '/'} className="btn btn-outline btn-sm">
              <ArrowRight className="w-4 h-4 ml-2" />
              {user ? 'חזור לדשבורד' : 'חזור לדף הבית'}
            </a>
          </div>
        </div>
      </nav>

      <div className="container-custom py-12 max-w-3xl">
        {!submitted ? (
          <>
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-10 h-10 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">צור קשר</h1>
              <p className="text-gray-600 text-lg">
                נתקלת בבאג? יש לך שאלה? אנחנו כאן לעזור!
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-lg">
                <span className="text-sm text-orange-800">
                  <strong>גרסת בטא v0.0.2</strong> - אנו משפרים באופן קבוע
                </span>
              </div>
            </div>

            <div className="card">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      שם מלא *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input"
                      required
                      placeholder="שם ושם משפחה"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      מייל *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input"
                      required
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    סוג הפנייה *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.type === 'bug'
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="type"
                        value="bug"
                        checked={formData.type === 'bug'}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="sr-only"
                      />
                      <Bug className="w-5 h-5 text-red-600" />
                      <span className="font-medium">דיווח על באג</span>
                    </label>

                    <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.type === 'question'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="type"
                        value="question"
                        checked={formData.type === 'question'}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="sr-only"
                      />
                      <HelpCircle className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">שאלה</span>
                    </label>

                    <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.type === 'feedback'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="type"
                        value="feedback"
                        checked={formData.type === 'feedback'}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="sr-only"
                      />
                      <Mail className="w-5 h-5 text-green-600" />
                      <span className="font-medium">משוב כללי</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    נושא *
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="input"
                    required
                    placeholder="תאר בקצרה את הנושא"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    הודעה *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="input"
                    rows={6}
                    required
                    placeholder="תאר את הבעיה, השאלה או המשוב שלך בפירוט..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    ככל שתספק יותר פרטים, כך נוכל לעזור לך טוב יותר
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">מידע טכני (נשלח אוטומטית):</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div><strong>IP:</strong> {deviceInfo.ip || 'טוען...'}</div>
                    <div><strong>מכשיר:</strong> {deviceInfo.device || 'טוען...'}</div>
                    <div><strong>דפדפן:</strong> {deviceInfo.browser || 'טוען...'}</div>
                    <div><strong>גרסה:</strong> 0.0.2 Beta</div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-lg w-full"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      שולח...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 ml-2" />
                      שלח הודעה
                    </>
                  )}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="card text-center py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">ההודעה נשלחה בהצלחה!</h2>
            <p className="text-gray-600 mb-6">
              תודה על הפנייה. אנו נחזור אליך בהקדם האפשרי.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setSubmitted(false)}
                className="btn btn-outline btn-md"
              >
                שלח הודעה נוספת
              </button>
              <a href={user ? '/dashboard' : '/'} className="btn btn-primary btn-md">
                {user ? 'חזור לדשבורד' : 'חזור לדף הבית'}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

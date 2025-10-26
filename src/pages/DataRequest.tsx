import { useState } from 'react';
import { CreditCard, ArrowRight, Send } from 'lucide-react';

export function DataRequest() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    requestType: 'view',
    details: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
            <a href="/" className="btn btn-outline btn-sm">
              <ArrowRight className="w-4 h-4 ml-2" />
              חזור לדף הבית
            </a>
          </div>
        </div>
      </nav>

      <div className="container-custom py-12 max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">בקשת מידע אישי</h1>
        <p className="text-gray-600 mb-8">
          בהתאם לתיקון 13 לחוק הגנת הפרטיות, יש לך זכות לבקש גישה למידע האישי שלך,
          לתקן אותו או למחוק אותו. מלא את הטופס למטה ונחזור אליך בהקדם.
        </p>

        {!submitted ? (
          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">שם מלא</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  כתובת מייל
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  סוג הבקשה
                </label>
                <select
                  value={formData.requestType}
                  onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
                  className="input"
                  required
                >
                  <option value="view">עיון במידע האישי שלי</option>
                  <option value="correct">תיקון מידע לא מדויק</option>
                  <option value="delete">מחיקת המידע שלי</option>
                  <option value="export">ייצוא המידע שלי</option>
                  <option value="unsubscribe">ביטול הסכמה לשימוש במידע</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  פרטים נוספים
                </label>
                <textarea
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="input"
                  rows={4}
                  placeholder="אנא פרט את בקשתך..."
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>שים לב:</strong> בקשות למידע אישי יטופלו תוך 30 יום. יתכן ונבקש
                  אימות נוסף לשם הגנת הפרטיות שלך.
                </p>
              </div>

              <button type="submit" className="btn btn-primary btn-lg w-full">
                <Send className="w-5 h-5 ml-2" />
                שלח בקשה
              </button>
            </form>
          </div>
        ) : (
          <div className="card text-center py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">הבקשה נשלחה בהצלחה!</h2>
            <p className="text-gray-600 mb-6">
              קיבלנו את בקשתך ונחזור אליך בהקדם האפשרי, לא יאוחר מ-30 יום.
            </p>
            <a href="/" className="btn btn-primary btn-md mx-auto">
              חזור לדף הבית
            </a>
          </div>
        )}

        <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-3">זכויותיך על פי חוק</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✓ עיון במידע האישי המוחזק עליך</li>
            <li>✓ תיקון מידע לא מדויק או לא שלם</li>
            <li>✓ מחיקת מידע אישי במקרים המתאימים</li>
            <li>✓ ביטול הסכמה לעיבוד מידע</li>
            <li>✓ העברת המידע שלך לספק אחר</li>
            <li>✓ התנגדות לעיבוד מידע למטרות שיווק</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

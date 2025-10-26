import { CreditCard, Mail, Facebook, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-6 h-6 text-blue-400" />
              <span className="text-xl font-bold text-white">MyCards</span>
            </div>
            <p className="text-sm leading-relaxed">
              פלטפורמה מובילה ליצירת כרטיסי ביקור דיגיטליים מקצועיים
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">קישורים מהירים</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  יתרונות
                </a>
              </li>
              <li>
                <a href="#templates" className="hover:text-white transition-colors">
                  תבניות
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  תמחור
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  שאלות נפוצות
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">משפטי</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/privacy" className="hover:text-white transition-colors">
                  מדיניות פרטיות
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-white transition-colors">
                  תנאי שימוש
                </a>
              </li>
              <li>
                <a href="/data-request" className="hover:text-white transition-colors">
                  בקשת מידע אישי
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">צור קשר</h4>
            <div className="space-y-2 text-sm mb-4">
              <a
                href="mailto:support@mycards.co"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                support@mycards.co
              </a>
            </div>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} MyCards. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </footer>
  );
}

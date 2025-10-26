import { CreditCard, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <CreditCard className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">MyCards</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
              יתרונות
            </a>
            <a href="#templates" className="text-gray-600 hover:text-gray-900 transition-colors">
              תבניות
            </a>
            <a href="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
              תמחור
            </a>
            <a href="#faq" className="text-gray-600 hover:text-gray-900 transition-colors">
              שאלות נפוצות
            </a>

            {user ? (
              <div className="flex items-center gap-3">
                <a href="/dashboard" className="text-gray-600 hover:text-gray-900">
                  הדשבורד שלי
                </a>
                <button
                  onClick={signOut}
                  className="btn btn-outline btn-sm"
                >
                  התנתק
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <a href="/login" className="btn btn-outline btn-sm">
                  התחבר
                </a>
                <a href="/signup" className="btn btn-primary btn-sm">
                  הירשם עכשיו
                </a>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-3">
              <a href="#features" className="text-gray-600 hover:text-gray-900 py-2">
                יתרונות
              </a>
              <a href="#templates" className="text-gray-600 hover:text-gray-900 py-2">
                תבניות
              </a>
              <a href="/pricing" className="text-gray-600 hover:text-gray-900 py-2">
                תמחור
              </a>
              <a href="#faq" className="text-gray-600 hover:text-gray-900 py-2">
                שאלות נפוצות
              </a>
              {user ? (
                <>
                  <a href="/dashboard" className="btn btn-outline btn-sm mt-3">
                    הדשבורד שלי
                  </a>
                  <button onClick={signOut} className="btn btn-secondary btn-sm">
                    התנתק
                  </button>
                </>
              ) : (
                <>
                  <a href="/login" className="btn btn-outline btn-sm mt-3">
                    התחבר
                  </a>
                  <a href="/signup" className="btn btn-primary btn-sm">
                    הירשם עכשיו
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

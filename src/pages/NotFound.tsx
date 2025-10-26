import { useNavigate } from 'react-router-dom';
import { Home, Search, MapPin, Compass, AlertCircle } from 'lucide-react';

export function NotFound() {
  const navigate = useNavigate();

  const funnyMessages = [
    'הדף הזה יצא לחופשה בברבדוס ושכח להגיד',
    'נראה שהדף הזה החליט להפוך להיות נינג׳ה - הוא בלתי נראה',
    'הדף שחיפשת ברח עם כל הכפתורים שלו',
    'אופס! הדף הזה החליט לעבור לחיות בנפרד',
    'הדף הזה יצא לטיול ולא השאיר פתק',
    'נראה שהדף הזה עשה Ctrl+Z על עצמו',
  ];

  const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="relative mb-8">
          <div className="text-[180px] sm:text-[250px] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 leading-none animate-pulse">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-bounce">
              <AlertCircle className="w-20 h-20 text-yellow-500 opacity-70" />
            </div>
          </div>
        </div>

        <div className="card mb-8 bg-white/80 backdrop-blur">
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              אוי ווי! משהו השתבש פה
            </h1>
            <p className="text-xl text-gray-700 mb-2">{randomMessage}</p>
            <p className="text-gray-600">
              נראה שהגעת לעמוד שלא קיים. אבל אל דאגה, זה קורה לטובים ביותר!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="animate-spin-slow">
              <Compass className="w-12 h-12 text-blue-600" />
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900 mb-1">איפה אני בכלל?!</p>
              <p className="text-sm text-gray-600">אל תדאג, נעזור לך למצוא את הדרך</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary btn-lg group"
          >
            <Home className="w-5 h-5 ml-2 group-hover:animate-bounce" />
            חזרה לדף הבית
          </button>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline btn-lg group"
          >
            <MapPin className="w-5 h-5 ml-2 group-hover:animate-ping" />
            חזור לאיפה שהיית
          </button>
        </div>

        <div className="space-y-4">
          <div className="card bg-yellow-50 border-2 border-yellow-200">
            <div className="flex items-start gap-3">
              <Search className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
              <div className="text-right">
                <h3 className="font-bold text-gray-900 mb-1">טיפ מקצועי:</h3>
                <p className="text-sm text-gray-700">
                  בדוק את הכתובת שהקלדת. אולי יש שם שגיאת כתיב? זה קורה לכולנו!
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <button
              onClick={() => navigate('/dashboard')}
              className="hover:text-blue-600 transition-colors"
            >
              הדשבורד שלי
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className="hover:text-blue-600 transition-colors"
            >
              מחירים
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="hover:text-blue-600 transition-colors"
            >
              צור קשר
            </button>
          </div>
        </div>

        <div className="mt-12 flex justify-center gap-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
}

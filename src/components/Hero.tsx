import { ArrowLeft, Sparkles, Zap, QrCode } from 'lucide-react';

export function Hero() {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-20">
      <div className="container-custom">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>פשוט, מהיר ומקצועי</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            כרטיס ביקור דיגיטלי
            <br />
            <span className="text-blue-600">ב-3 דקות</span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            צור כרטיס ביקור דיגיטלי מקצועי ללקוחות שלך. שתף בקליק אחד, קבל סטטיסטיקות,
            <br className="hidden md:block" />
            והופך כל לקוח לחיבור מיידי עם קוד QR ייעודי.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a href="/signup" className="btn btn-primary btn-lg w-full sm:w-auto group">
              התחל בחינם
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            </a>
            <a href="#templates" className="btn btn-outline btn-lg w-full sm:w-auto">
              צפה בתבניות
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">יצירה מהירה</p>
                <p className="text-sm text-gray-600">תוך 3 דקות בלבד</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm">
              <div className="bg-green-100 p-3 rounded-lg">
                <QrCode className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">QR אוטומטי</p>
                <p className="text-sm text-gray-600">להדפסה ושיתוף</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">סטטיסטיקות</p>
                <p className="text-sm text-gray-600">מעקב אחר צפיות</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-3xl opacity-20"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto"></div>
                  </div>
                  <div className="flex gap-2 justify-center pt-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full"></div>
                    <div className="w-10 h-10 bg-green-100 rounded-full"></div>
                    <div className="w-10 h-10 bg-purple-100 rounded-full"></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                  <div className="pt-4 space-y-2">
                    <div className="h-10 bg-blue-100 rounded"></div>
                    <div className="h-10 bg-gray-100 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Component, ReactNode } from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full text-center">
            <div className="mb-8">
              <div className="inline-block p-6 bg-red-100 rounded-full mb-6 animate-bounce">
                <AlertTriangle className="w-20 h-20 text-red-600" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                אופס! משהו התפוצץ לנו פה
              </h1>
              <p className="text-xl text-gray-700 mb-2">
                הקוד שלנו החליט לקחת חופש בלתי מתוכנן
              </p>
              <p className="text-gray-600">
                אל דאגה, זה לא אשמתך! המפתחים שלנו כבר על זה (אחרי שהם יסיימו את הקפה)
              </p>
            </div>

            <div className="card mb-8 bg-white/80 backdrop-blur">
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-red-900 mb-2">פרטי השגיאה (למפתחים הסקרנים):</h3>
                <code className="text-sm text-red-700 break-all block text-right">
                  {this.state.error?.message || 'Unknown error'}
                </code>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3 p-4 bg-yellow-50 rounded-lg">
                  <span className="text-4xl">🤷‍♂️</span>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">למה זה קרה?</p>
                    <p className="text-sm text-gray-600">
                      כנראה באג קטן שהתגנב לנו. אבל אל דאגה, אפשר לתקן!
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="btn btn-primary btn-lg group"
                  >
                    <RefreshCw className="w-5 h-5 ml-2 group-hover:animate-spin" />
                    רענן את הדף
                  </button>
                  <button
                    onClick={() => window.location.href = '/'}
                    className="btn btn-outline btn-lg group"
                  >
                    <Home className="w-5 h-5 ml-2 group-hover:animate-bounce" />
                    חזרה לדף הבית
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-600">
              <p className="font-medium">רעיונות לפתרון:</p>
              <ul className="space-y-2 text-right">
                <li className="flex items-start gap-2">
                  <span className="text-lg">💡</span>
                  <span>נסה לרענן את הדף - לפעמים זה הכל שצריך</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lg">🧹</span>
                  <span>נקה את הקאש של הדפדפן (Ctrl+Shift+Delete)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lg">📧</span>
                  <span>אם זה ממשיך לקרות, צור איתנו קשר בדף יצירת הקשר</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 flex justify-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

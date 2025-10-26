import { useState, useEffect } from 'react';
import { AlertTriangle, X, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function BetaBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [deviceInfo, setDeviceInfo] = useState({ ip: 'טוען...', device: '', version: '1.2.9' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setDeviceInfo(prev => ({ ...prev, ip: data.ip }));
      } catch (error) {
        setDeviceInfo(prev => ({ ...prev, ip: 'לא זמין' }));
      }
    };

    const getDeviceInfo = () => {
      const ua = navigator.userAgent;
      let device = 'Desktop';
      if (/Mobile|Android|iPhone|iPad/i.test(ua)) {
        device = /iPhone|iPad/i.test(ua) ? 'iOS' : 'Android';
      }
      return device;
    };

    fetchIP();
    setDeviceInfo(prev => ({ ...prev, device: getDeviceInfo() }));

    const dismissed = sessionStorage.getItem('beta-banner-dismissed');
    if (dismissed) {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('beta-banner-dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white shadow-lg">
      <div className="container-custom py-2 sm:py-3">
        <div className="flex items-start justify-between gap-2 sm:gap-4">
          <div className="flex items-start gap-2 sm:gap-3 flex-1">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <h3 className="font-bold text-base sm:text-lg">גרסת בטא</h3>
                <span className="px-2 py-0.5 sm:py-1 bg-white/20 rounded text-xs sm:text-sm font-mono">
                  v{deviceInfo.version}
                </span>
              </div>
              <p className="text-xs sm:text-sm mb-2 leading-relaxed">
                זוהי גרסת בטא של המערכת. ייתכנו באגים ושגיאות בתפקוד.
              </p>
              <div className="hidden sm:flex flex-wrap items-center gap-4 text-xs opacity-90 mb-2">
                <span className="flex items-center gap-1">
                  <strong>IP:</strong> {deviceInfo.ip}
                </span>
                <span className="flex items-center gap-1">
                  <strong>מכשיר:</strong> {deviceInfo.device}
                </span>
                <span className="flex items-center gap-1">
                  <strong>דפדפן:</strong> {navigator.userAgent.includes('Chrome') ? 'Chrome' : navigator.userAgent.includes('Firefox') ? 'Firefox' : navigator.userAgent.includes('Safari') ? 'Safari' : 'Other'}
                </span>
              </div>
              <div className="mt-2 sm:mt-3">
                <button
                  onClick={() => navigate('/contact')}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors text-xs sm:text-sm"
                >
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  צור קשר
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="סגור הודעה"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

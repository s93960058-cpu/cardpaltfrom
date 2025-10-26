import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Loader, CreditCard, Building2, Palette, Link as LinkIcon, CheckCircle } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  category: string;
  is_premium: boolean;
}

export function Wizard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [existingCardsCount, setExistingCardsCount] = useState(0);

  const [formData, setFormData] = useState({
    templateId: '',
    businessName: '',
    tagline: '',
    description: '',
    phone: '',
    whatsapp: '',
    email: '',
    website: '',
    address: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadUserData();
    loadTemplates();
  }, [user, navigate]);

  const loadUserData = async () => {
    const [profileRes, cardsRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user!.id).maybeSingle(),
      supabase.from('cards').select('id').eq('user_id', user!.id),
    ]);

    if (profileRes.data) {
      setProfile(profileRes.data);
    }

    if (cardsRes.data) {
      setExistingCardsCount(cardsRes.data.length);
    }
  };

  const loadTemplates = async () => {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('sort_order');

    if (error) {
      console.error('Error loading templates:', error);
    }

    if (data) {
      setTemplates(data);
      console.log('Loaded templates:', data.length);
    } else {
      console.warn('No templates found!');
    }
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const userPlan = profile?.plan || 'starter';
      const cardLimit = userPlan === 'starter' ? 1 : userPlan === 'pro' ? 5 : 999;

      if (existingCardsCount >= cardLimit) {
        alert(`הגעת למגבלת הכרטיסים בתוכנית ${userPlan}. שדרג את התוכנית כדי ליצור כרטיסים נוספים.`);
        setLoading(false);
        navigate('/checkout');
        return;
      }
      const { data: businessProfile, error: businessError } = await supabase
        .from('business_profiles')
        .insert({
          user_id: user!.id,
          business_name: formData.businessName,
          tagline: formData.tagline || null,
          description: formData.description || null,
          phone: formData.phone || null,
          whatsapp: formData.whatsapp || null,
          email: formData.email || null,
          site_url: formData.website || null,
          address: formData.address || null,
        })
        .select()
        .single();

      if (businessError) {
        console.error('Business profile error:', businessError);
        alert('שגיאה ביצירת פרופיל עסקי: ' + businessError.message);
        setLoading(false);
        return;
      }

      const slug = generateSlug(formData.businessName) + '-' + Date.now();

      const { data: card, error: cardError } = await supabase
        .from('cards')
        .insert({
          user_id: user!.id,
          business_id: businessProfile.id,
          slug,
          template_id: formData.templateId || null,
          is_published: true,
          published_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (cardError) {
        console.error('Card error:', cardError);
        alert('שגיאה ביצירת כרטיס: ' + cardError.message);
        setLoading(false);
        return;
      }

      if (formData.phone) {
        await supabase.from('links').insert({
          card_id: card.id,
          type: 'phone',
          label: 'טלפון',
          url: `tel:${formData.phone}`,
          sort_order: 1,
        });
      }

      if (formData.whatsapp) {
        await supabase.from('links').insert({
          card_id: card.id,
          type: 'whatsapp',
          label: 'וואטסאפ',
          url: `https://wa.me/${formData.whatsapp.replace(/[^0-9]/g, '')}`,
          sort_order: 2,
        });
      }

      if (formData.website) {
        await supabase.from('links').insert({
          card_id: card.id,
          type: 'website',
          label: 'אתר',
          url: formData.website,
          sort_order: 3,
        });
      }

      setLoading(false);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Unexpected error:', err);
      alert('שגיאה לא צפויה: ' + err.message);
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return true;
      case 2:
        return formData.businessName.trim() !== '';
      case 3:
        return formData.phone || formData.whatsapp || formData.email;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="container-custom max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CreditCard className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">MyCards</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            צור כרטיס ביקור דיגיטלי
          </h1>
          <p className="text-gray-600">
            שלב {step} מתוך 4
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${
                  s === step
                    ? 'bg-blue-600 text-white'
                    : s < step
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s < step ? <CheckCircle className="w-6 h-6" /> : s}
              </div>
            ))}
          </div>
        </div>

        <div className="card max-w-2xl mx-auto">
          {step === 1 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Palette className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">בחר תבנית</h2>
                  <p className="text-gray-600">בחר עיצוב שמתאים לעסק שלך (אופציונלי - ניתן לדלג)</p>
                </div>
              </div>

              {templates.length === 0 ? (
                <div className="text-center py-12 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                  <Palette className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">אין תבניות זמינות</h3>
                  <p className="text-gray-600 mb-4">
                    נראה שהתבניות עדיין לא נטענו למערכת.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-yellow-300 max-w-md mx-auto text-right">
                    <p className="text-sm text-gray-700 mb-2 font-semibold">להוספת תבניות:</p>
                    <ol className="text-sm text-gray-600 space-y-1">
                      <li>1. פתח את Supabase Dashboard</li>
                      <li>2. עבור ל-SQL Editor</li>
                      <li>3. הרץ את הקובץ: <code className="bg-gray-100 px-1">fix-templates-now.sql</code></li>
                    </ol>
                  </div>
                  <button
                    onClick={loadTemplates}
                    className="mt-4 btn btn-primary btn-sm"
                  >
                    <Loader className="w-4 h-4 ml-2" />
                    רענן תבניות
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => setFormData({ ...formData, templateId: template.id })}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.templateId === template.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        {template.is_premium && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                            פרימיום
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{template.category}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">פרטי העסק</h2>
                  <p className="text-gray-600">מלא את הפרטים הבסיסיים</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    שם העסק *
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="input"
                    placeholder="המספרה של דוד"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    סלוגן
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="input"
                    placeholder="התספורת הטובה ביותר בעיר"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    תיאור
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input"
                    rows={4}
                    placeholder="ספר קצת על העסק שלך..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    כתובת
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="input"
                    placeholder="רחוב הרצל 123, תל אביב"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <LinkIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">פרטי יצירת קשר</h2>
                  <p className="text-gray-600">איך לקוחות יוכלו ליצור איתך קשר</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    טלפון *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input"
                    placeholder="050-1234567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    וואטסאפ
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="input"
                    placeholder="972501234567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    מייל
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input"
                    placeholder="info@mybusiness.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    אתר
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="input"
                    placeholder="https://mybusiness.com"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">סיכום</h2>
                  <p className="text-gray-600">בדוק את הפרטים לפני הפרסום</p>
                </div>
              </div>

              <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">שם העסק</p>
                  <p className="font-semibold text-gray-900">{formData.businessName}</p>
                </div>
                {formData.tagline && (
                  <div>
                    <p className="text-sm text-gray-600">סלוגן</p>
                    <p className="font-semibold text-gray-900">{formData.tagline}</p>
                  </div>
                )}
                {formData.phone && (
                  <div>
                    <p className="text-sm text-gray-600">טלפון</p>
                    <p className="font-semibold text-gray-900">{formData.phone}</p>
                  </div>
                )}
                {formData.whatsapp && (
                  <div>
                    <p className="text-sm text-gray-600">וואטסאפ</p>
                    <p className="font-semibold text-gray-900">{formData.whatsapp}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  לחיצה על "פרסם כרטיס" תפרסם את הכרטיס ויהיה זמין לצפייה ציבורית
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="btn btn-outline btn-md"
              >
                <ArrowRight className="w-5 h-5 ml-2" />
                חזור
              </button>
            ) : (
              <div></div>
            )}

            {step < 4 ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="btn btn-primary btn-md"
              >
                המשך
                <ArrowLeft className="w-5 h-5 mr-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn btn-primary btn-md"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    יוצר...
                  </>
                ) : (
                  <>
                    פרסם כרטיס
                    <CheckCircle className="w-5 h-5 mr-2" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

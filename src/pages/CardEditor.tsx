import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { ArrowRight, Save, Eye, Loader, Image as ImageIcon, ShoppingBag, Star, Share2, Settings, Link2, Palette } from 'lucide-react';
import { FileUpload } from '../components/FileUpload';
import { ReviewsSection } from '../components/ReviewsSection';
import { ProductCatalog } from '../components/ProductCatalog';
import { GallerySection } from '../components/GallerySection';
import PhoneVerification from '../components/PhoneVerification';

export function CardEditor() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [card, setCard] = useState<any>(null);
  const [businessProfile, setBusinessProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [verifyingField, setVerifyingField] = useState<'phone' | 'whatsapp' | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadCard();
  }, [user, id]);

  const loadCard = async () => {
    const { data: cardData } = await supabase
      .from('cards')
      .select('*, business_profiles(*)')
      .eq('id', id)
      .eq('user_id', user!.id)
      .maybeSingle();

    if (!cardData) {
      navigate('/dashboard');
      return;
    }

    setCard(cardData);
    setBusinessProfile(cardData.business_profiles);
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);

    await supabase
      .from('business_profiles')
      .update({
        business_name: businessProfile.business_name,
        tagline: businessProfile.tagline,
        description: businessProfile.description,
        phone: businessProfile.phone,
        whatsapp: businessProfile.whatsapp,
        email: businessProfile.email,
        site_url: businessProfile.site_url,
        address: businessProfile.address,
        profile_image_url: businessProfile.profile_image_url,
        logo_url: businessProfile.logo_url,
        cover_url: businessProfile.cover_url,
        social_media_json: businessProfile.social_media_json,
      })
      .eq('id', businessProfile.id);

    setSaving(false);
    alert('השינויים נשמרו בהצלחה!');
  };

  const handleVerifyPhone = (field: 'phone' | 'whatsapp') => {
    setVerifyingField(field);
    setShowPhoneVerification(true);
  };

  const handlePhoneVerified = (verifiedPhone: string) => {
    if (verifyingField === 'phone') {
      setBusinessProfile({ ...businessProfile, phone: verifiedPhone });
    } else if (verifyingField === 'whatsapp') {
      setBusinessProfile({ ...businessProfile, whatsapp: verifiedPhone });
    }
    setShowPhoneVerification(false);
    setVerifyingField(null);
    alert('מספר הטלפון אומת בהצלחה!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-outline btn-sm"
            >
              <ArrowRight className="w-4 h-4 ml-2" />
              חזור לדשבורד
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.open(`/u/${card.slug}`, '_blank')}
                className="btn btn-outline btn-sm"
              >
                <Eye className="w-4 h-4 ml-2" />
                תצוגה מקדימה
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn btn-primary btn-sm"
              >
                {saving ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4 ml-2" />
                    שמור שינויים
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container-custom py-4 sm:py-8 max-w-6xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
          עריכת כרטיס - {businessProfile.business_name}
        </h1>

        <div className="flex gap-2 sm:gap-4 mb-6 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-3 sm:px-4 py-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'basic'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            מידע בסיסי
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`px-3 sm:px-4 py-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'media'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ImageIcon className="w-4 h-4 inline ml-1" />
            תמונות
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 sm:px-4 py-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'products'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4 inline ml-1" />
            קטלוג
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-3 sm:px-4 py-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'gallery'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ImageIcon className="w-4 h-4 inline ml-1" />
            גלריה
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3 sm:px-4 py-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'reviews'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Star className="w-4 h-4 inline ml-1" />
            ביקורות
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`px-3 sm:px-4 py-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'social'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Share2 className="w-4 h-4 inline ml-1" />
            רשתות
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`px-3 sm:px-4 py-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'advanced'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className="w-4 h-4 inline ml-1" />
            מתקדם
          </button>
        </div>

        {activeTab === 'basic' && (
        <div className="card space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              שם העסק
            </label>
            <input
              type="text"
              value={businessProfile.business_name}
              onChange={(e) =>
                setBusinessProfile({ ...businessProfile, business_name: e.target.value })
              }
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              סלוגן
            </label>
            <input
              type="text"
              value={businessProfile.tagline || ''}
              onChange={(e) =>
                setBusinessProfile({ ...businessProfile, tagline: e.target.value })
              }
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              תיאור
            </label>
            <textarea
              value={businessProfile.description || ''}
              onChange={(e) =>
                setBusinessProfile({ ...businessProfile, description: e.target.value })
              }
              className="input"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                טלפון
              </label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  value={businessProfile.phone || ''}
                  onChange={(e) =>
                    setBusinessProfile({ ...businessProfile, phone: e.target.value })
                  }
                  className="input flex-1"
                />
                <button
                  type="button"
                  onClick={() => handleVerifyPhone('phone')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm whitespace-nowrap"
                >
                  אמת
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                וואטסאפ
              </label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  value={businessProfile.whatsapp || ''}
                  onChange={(e) =>
                    setBusinessProfile({ ...businessProfile, whatsapp: e.target.value })
                  }
                  className="input flex-1"
                />
                <button
                  type="button"
                  onClick={() => handleVerifyPhone('whatsapp')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm whitespace-nowrap"
                >
                  אמת
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                מייל
              </label>
              <input
                type="email"
                value={businessProfile.email || ''}
                onChange={(e) =>
                  setBusinessProfile({ ...businessProfile, email: e.target.value })
                }
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                אתר
              </label>
              <input
                type="url"
                value={businessProfile.site_url || ''}
                onChange={(e) =>
                  setBusinessProfile({ ...businessProfile, site_url: e.target.value })
                }
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              כתובת
            </label>
            <input
              type="text"
              value={businessProfile.address || ''}
              onChange={(e) =>
                setBusinessProfile({ ...businessProfile, address: e.target.value })
              }
              className="input"
            />
          </div>
        </div>
        )}

        {activeTab === 'media' && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">תמונת פרופיל</h2>
              <FileUpload
                bucket="logos"
                label="תמונת פרופיל / לוגו"
                currentImage={businessProfile.profile_image_url}
                onUploadComplete={(url) =>
                  setBusinessProfile({ ...businessProfile, profile_image_url: url })
                }
              />
            </div>

            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">לוגו</h2>
              <FileUpload
                bucket="logos"
                label="לוגו העסק"
                currentImage={businessProfile.logo_url}
                onUploadComplete={(url) =>
                  setBusinessProfile({ ...businessProfile, logo_url: url })
                }
              />
            </div>

            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">תמונת רקע</h2>
              <FileUpload
                bucket="covers"
                label="תמונת רקע"
                currentImage={businessProfile.cover_url}
                onUploadComplete={(url) =>
                  setBusinessProfile({ ...businessProfile, cover_url: url })
                }
              />
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <ProductCatalog cardId={card.id} isOwner={true} />
        )}

        {activeTab === 'gallery' && (
          <GallerySection cardId={card.id} isOwner={true} />
        )}

        {activeTab === 'reviews' && (
          <ReviewsSection cardId={card.id} isOwner={true} />
        )}

        {activeTab === 'social' && (
          <div className="card space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">רשתות חברתיות</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook
                </label>
                <input
                  type="url"
                  value={businessProfile.social_media_json?.facebook || ''}
                  onChange={(e) =>
                    setBusinessProfile({
                      ...businessProfile,
                      social_media_json: {
                        ...businessProfile.social_media_json,
                        facebook: e.target.value,
                      },
                    })
                  }
                  className="input"
                  placeholder="https://facebook.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram
                </label>
                <input
                  type="url"
                  value={businessProfile.social_media_json?.instagram || ''}
                  onChange={(e) =>
                    setBusinessProfile({
                      ...businessProfile,
                      social_media_json: {
                        ...businessProfile.social_media_json,
                        instagram: e.target.value,
                      },
                    })
                  }
                  className="input"
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={businessProfile.social_media_json?.linkedin || ''}
                  onChange={(e) =>
                    setBusinessProfile({
                      ...businessProfile,
                      social_media_json: {
                        ...businessProfile.social_media_json,
                        linkedin: e.target.value,
                      },
                    })
                  }
                  className="input"
                  placeholder="https://linkedin.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TikTok
                </label>
                <input
                  type="url"
                  value={businessProfile.social_media_json?.tiktok || ''}
                  onChange={(e) =>
                    setBusinessProfile({
                      ...businessProfile,
                      social_media_json: {
                        ...businessProfile.social_media_json,
                        tiktok: e.target.value,
                      },
                    })
                  }
                  className="input"
                  placeholder="https://tiktok.com/@..."
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <div className="card">
              <div className="flex items-center gap-2 mb-6">
                <Palette className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">עיצוב ורקע</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    רקע מותאם אישית
                  </label>
                  <p className="text-xs text-gray-600 mb-2">
                    הוסף תמונת רקע או גרדיאנט CSS (לדוגמה: linear-gradient(45deg, #667eea 0%, #764ba2 100%))
                  </p>
                  <input
                    type="text"
                    value={card.custom_background || ''}
                    onChange={(e) => setCard({ ...card, custom_background: e.target.value })}
                    className="input"
                    placeholder="URL תמונה או CSS gradient"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={card.hide_branding || false}
                      onChange={(e) => setCard({ ...card, hide_branding: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      הסר את הסימון "MyCards" מהכרטיס
                    </span>
                  </label>
                  <p className="text-xs text-gray-600 mr-6 mt-1">
                    זמין בחבילות Pro ו-Enterprise
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CSS מותאם אישית (מתקדם)
                  </label>
                  <p className="text-xs text-gray-600 mb-2">
                    הוסף CSS מותאם כדי לשנות את עיצוב הכרטיס
                  </p>
                  <textarea
                    value={card.custom_css || ''}
                    onChange={(e) => setCard({ ...card, custom_css: e.target.value })}
                    className="input font-mono text-sm"
                    rows={6}
                    placeholder=".card { border-radius: 20px; }&#10;.title { color: #667eea; }"
                  />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-2 mb-6">
                <Link2 className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">כתובת URL מותאמת אישית</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug נוכחי
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">mycards.com/u/</span>
                    <input
                      type="text"
                      value={card.slug || ''}
                      onChange={(e) => setCard({ ...card, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                      className="input flex-1"
                      placeholder="my-business"
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    השתמש באותיות אנגליות קטנות, מספרים ומקפים בלבד
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    קישור מקוצר מותאם (אופציונלי)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">mycards.link/</span>
                    <input
                      type="text"
                      value={card.custom_url || ''}
                      onChange={(e) => setCard({ ...card, custom_url: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                      className="input flex-1"
                      placeholder="mybiz"
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    זמין בחבילות Pro ו-Enterprise. יצור קישור קצר יותר.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">SEO ומטא-דאטה</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    כותרת SEO
                  </label>
                  <input
                    type="text"
                    value={card.seo_title || ''}
                    onChange={(e) => setCard({ ...card, seo_title: e.target.value })}
                    className="input"
                    placeholder={businessProfile.business_name}
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    תופיע בתוצאות החיפוש של Google (50-60 תווים מומלץ)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    תיאור SEO
                  </label>
                  <textarea
                    value={card.seo_description || ''}
                    onChange={(e) => setCard({ ...card, seo_description: e.target.value })}
                    className="input"
                    rows={3}
                    placeholder="תיאור קצר של העסק שיופיע בתוצאות חיפוש"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    תיאור שיופיע מתחת לכותרת בתוצאות החיפוש (150-160 תווים מומלץ)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Favicon (אייקון הכרטיסייה)
                  </label>
                  <input
                    type="url"
                    value={card.favicon_url || ''}
                    onChange={(e) => setCard({ ...card, favicon_url: e.target.value })}
                    className="input"
                    placeholder="https://example.com/favicon.ico"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    האייקון הקטן שמופיע בכרטיסיית הדפדפן
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showPhoneVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => {
                setShowPhoneVerification(false);
                setVerifyingField(null);
              }}
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <PhoneVerification
              onVerified={handlePhoneVerified}
              initialPhone={verifyingField === 'phone' ? businessProfile.phone : businessProfile.whatsapp}
            />
          </div>
        </div>
      )}
    </div>
  );
}

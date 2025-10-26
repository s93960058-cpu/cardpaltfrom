import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Phone, Mail, MapPin, Globe, MessageCircle, Loader, Download } from 'lucide-react';

export function PublicCard() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [card, setCard] = useState<any>(null);
  const [business, setBusiness] = useState<any>(null);
  const [links, setLinks] = useState<any[]>([]);

  useEffect(() => {
    loadCard();
    trackView();
  }, [slug]);

  const loadCard = async () => {
    const { data: cardData } = await supabase
      .from('cards')
      .select('*, business_profiles(*)')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();

    if (!cardData) {
      setLoading(false);
      return;
    }

    setCard(cardData);
    setBusiness(cardData.business_profiles);

    const { data: linksData } = await supabase
      .from('links')
      .select('*')
      .eq('card_id', cardData.id)
      .order('sort_order');

    if (linksData) setLinks(linksData);
    setLoading(false);
  };

  const trackView = async () => {
    const { data: cardData } = await supabase
      .from('cards')
      .select('id')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();

    if (cardData) {
      await supabase.from('events_analytics').insert({
        card_id: cardData.id,
        event_type: 'view',
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
      });

      await supabase.rpc('increment_views', { card_id: cardData.id });
    }
  };

  const trackClick = async (type: string) => {
    if (card) {
      await supabase.from('events_analytics').insert({
        card_id: card.id,
        event_type: `click_${type}`,
        user_agent: navigator.userAgent,
      });
    }
  };

  const downloadVCF = () => {
    const vcf = `BEGIN:VCARD
VERSION:3.0
FN:${business.business_name}
TEL:${business.phone || ''}
EMAIL:${business.email || ''}
URL:${business.site_url || ''}
ADR:;;${business.address || ''};;;;
NOTE:${business.description || ''}
END:VCARD`;

    const blob = new Blob([vcf], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${business.business_name}.vcf`;
    a.click();
    trackClick('download_vcf');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            כרטיס לא נמצא
          </h1>
          <p className="text-gray-600">הכרטיס שחיפשת לא קיים או הוסר</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container-custom max-w-2xl">
        <div className="card">
          <div className="text-center mb-8">
            {business.logo_url ? (
              <img
                src={business.logo_url}
                alt={business.business_name}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"></div>
            )}

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {business.business_name}
            </h1>

            {business.tagline && (
              <p className="text-xl text-gray-600 mb-4">{business.tagline}</p>
            )}

            {business.description && (
              <p className="text-gray-700 leading-relaxed max-w-lg mx-auto">
                {business.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 mb-6">
            {business.phone && (
              <a
                href={`tel:${business.phone}`}
                onClick={() => trackClick('phone')}
                className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div className="text-right flex-1">
                  <p className="font-semibold text-gray-900">התקשר עכשיו</p>
                  <p className="text-sm text-gray-600">{business.phone}</p>
                </div>
              </a>
            )}

            {business.whatsapp && (
              <a
                href={`https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}`}
                onClick={() => trackClick('whatsapp')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-right flex-1">
                  <p className="font-semibold text-gray-900">שלח הודעה בוואטסאפ</p>
                  <p className="text-sm text-gray-600">{business.whatsapp}</p>
                </div>
              </a>
            )}

            {business.email && (
              <a
                href={`mailto:${business.email}`}
                onClick={() => trackClick('email')}
                className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="text-right flex-1">
                  <p className="font-semibold text-gray-900">שלח מייל</p>
                  <p className="text-sm text-gray-600">{business.email}</p>
                </div>
              </a>
            )}

            {business.site_url && (
              <a
                href={business.site_url}
                onClick={() => trackClick('website')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div className="text-right flex-1">
                  <p className="font-semibold text-gray-900">בקר באתר</p>
                  <p className="text-sm text-gray-600">{business.site_url}</p>
                </div>
              </a>
            )}

            {business.address && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`}
                onClick={() => trackClick('map')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="text-right flex-1">
                  <p className="font-semibold text-gray-900">נווט לכתובת</p>
                  <p className="text-sm text-gray-600">{business.address}</p>
                </div>
              </a>
            )}
          </div>

          <button
            onClick={downloadVCF}
            className="btn btn-outline btn-lg w-full"
          >
            <Download className="w-5 h-5 ml-2" />
            שמור לאנשי קשר
          </button>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500 mb-2">
              נוצר באמצעות MyCards
            </p>
            <a
              href="/"
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              צור גם אתה כרטיס ביקור דיגיטלי
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

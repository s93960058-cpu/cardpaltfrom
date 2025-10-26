import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { CreditCard, Plus, Edit, Eye, QrCode, BarChart3, Loader, Search, TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BetaBanner } from '../components/BetaBanner';

interface Card {
  id: string;
  slug: string;
  is_published: boolean;
  views_count: number;
  created_at: string;
  business_profiles: {
    business_name: string;
    logo_url: string | null;
  };
}

export function Dashboard() {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ totalViews: 0, totalCards: 0 });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadCards();
    }
  }, [user]);

  const loadProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user!.id)
      .maybeSingle();

    setProfile(data);
  };

  const loadCards = async () => {
    const { data, error } = await supabase
      .from('cards')
      .select(`
        *,
        business_profiles (
          business_name,
          logo_url
        )
      `)
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setCards(data);
      const totalViews = data.reduce((sum, card) => sum + (card.views_count || 0), 0);
      setStats({ totalViews, totalCards: data.length });
    }
    setLoading(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BetaBanner />
      <nav className="bg-white border-b border-gray-200">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <CreditCard className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">MyCards</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden sm:inline text-sm text-gray-600 truncate max-w-[150px]">
                {profile?.full_name || user?.email}
              </span>
              <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium">
                {profile?.plan || 'starter'}
              </span>
              {profile?.plan === 'starter' && (
                <button
                  onClick={() => navigate('/checkout')}
                  className="btn btn-primary btn-sm hidden sm:inline-flex"
                >
                  שדרג ל-Pro
                </button>
              )}
              {user?.email === 'shay053713@gmail.com' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="btn btn-outline btn-sm"
                >
                  אדמין
                </button>
              )}
              <button onClick={signOut} className="btn btn-outline btn-sm">
                התנתק
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container-custom py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              הכרטיסים שלי
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              נהל את כרטיסי הביקור הדיגיטליים שלך
            </p>
          </div>
          <button
            onClick={() => navigate('/wizard')}
            className="btn btn-primary btn-md sm:btn-lg group w-full sm:w-auto"
          >
            <Plus className="w-5 h-5 ml-2" />
            כרטיס חדש
          </button>
        </div>

        {cards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm mb-1">סה״כ כרטיסים</p>
                  <p className="text-3xl font-bold">{stats.totalCards}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm mb-1">סה״כ צפיות</p>
                  <p className="text-3xl font-bold">{stats.totalViews}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm mb-1">ממוצע צפיות</p>
                  <p className="text-3xl font-bold">
                    {stats.totalCards > 0 ? Math.round(stats.totalViews / stats.totalCards) : 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        )}

        {cards.length > 3 && (
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="חפש כרטיס..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pr-10 w-full"
              />
            </div>
          </div>
        )}

        {cards.length === 0 ? (
          <div className="card text-center py-12">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              עדיין אין לך כרטיסים
            </h3>
            <p className="text-gray-600 mb-6">
              צור את הכרטיס הדיגיטלי הראשון שלך תוך 3 דקות
            </p>
            <button
              onClick={() => navigate('/wizard')}
              className="btn btn-primary btn-lg mx-auto"
            >
              <Plus className="w-5 h-5 ml-2" />
              צור כרטיס חדש
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {cards
              .filter((card) =>
                card.business_profiles.business_name
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )
              .map((card) => (
              <div key={card.id} className="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start gap-4 mb-4">
                  {card.business_profiles.logo_url ? (
                    <img
                      src={card.business_profiles.logo_url}
                      alt={card.business_profiles.business_name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg"></div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {card.business_profiles.business_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      mycards.co/u/{card.slug}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{card.views_count} צפיות</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    card.is_published
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {card.is_published ? 'פעיל' : 'טיוטה'}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => navigate(`/card/${card.id}/edit`)}
                    className="btn btn-outline btn-sm"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => window.open(`/u/${card.slug}`, '_blank')}
                    className="btn btn-outline btn-sm"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {}}
                    className="btn btn-outline btn-sm"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

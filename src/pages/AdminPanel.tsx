import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  CreditCard,
  Tag,
  BarChart3,
  Loader,
  Edit,
  Trash,
  Plus,
  ArrowRight,
  ShoppingCart,
  Star,
  Image as ImageIcon,
  ShoppingBag,
  FileText,
  DollarSign,
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats');
  const [users, setUsers] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCards: 0,
    totalViews: 0,
    activeUsers: 0,
    totalRevenue: 0,
    totalOrders: 0,
    totalReviews: 0,
    totalProducts: 0,
  });

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'percent' as 'percent' | 'fixed',
    value: 0,
    maxUses: null as number | null,
  });

  useEffect(() => {
    if (!user || user.email !== 'shay053713@gmail.com') {
      navigate('/dashboard');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    const [
      usersRes,
      authUsersRes,
      couponsRes,
      cardsRes,
      viewsRes,
      ordersRes,
      reviewsRes,
      productsRes,
      galleryRes,
    ] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.auth.admin.listUsers(),
      supabase.from('coupons').select('*').order('created_at', { ascending: false }),
      supabase.from('cards').select('*, business_profiles(business_name), profiles(email)').order('created_at', { ascending: false }),
      supabase.from('events_analytics').select('id').eq('event_type', 'view'),
      supabase.from('orders').select('*, profiles(email, full_name)').order('created_at', { ascending: false }),
      supabase.from('reviews').select('*, cards(slug, business_profiles(business_name))').order('created_at', { ascending: false }),
      supabase.from('products').select('*, cards(slug, business_profiles(business_name))').order('created_at', { ascending: false }),
      supabase.from('gallery_items').select('*, cards(slug, business_profiles(business_name))').order('created_at', { ascending: false }),
    ]);

    if (usersRes.data && authUsersRes.data) {
      const enrichedUsers = usersRes.data.map((profile) => {
        const authUser = authUsersRes.data.users.find((u) => u.id === profile.id);
        return {
          ...profile,
          email: authUser?.email || profile.email || 'לא זמין',
          last_sign_in: authUser?.last_sign_in_at,
        };
      });
      setUsers(enrichedUsers);
      setStats((prev) => ({
        ...prev,
        totalUsers: enrichedUsers.length,
        activeUsers: enrichedUsers.filter((u) => u.status === 'active').length,
      }));
    }

    if (couponsRes.data) setCoupons(couponsRes.data);

    if (cardsRes.data) {
      setCards(cardsRes.data);
      setStats((prev) => ({ ...prev, totalCards: cardsRes.data.length }));
    }

    if (viewsRes.data) setStats((prev) => ({ ...prev, totalViews: viewsRes.data.length }));

    if (ordersRes.data) {
      setOrders(ordersRes.data);
      const totalRevenue = ordersRes.data
        .filter((o) => o.status === 'paid')
        .reduce((sum, o) => sum + o.amount, 0);
      setStats((prev) => ({
        ...prev,
        totalOrders: ordersRes.data.length,
        totalRevenue,
      }));
    }

    if (reviewsRes.data) {
      setReviews(reviewsRes.data);
      setStats((prev) => ({ ...prev, totalReviews: reviewsRes.data.length }));
    }

    if (productsRes.data) {
      setProducts(productsRes.data);
      setStats((prev) => ({ ...prev, totalProducts: productsRes.data.length }));
    }

    if (galleryRes.data) setGalleryItems(galleryRes.data);

    setLoading(false);
  };

  const createCoupon = async () => {
    if (!newCoupon.code || !newCoupon.value) {
      alert('נא למלא את כל השדות הנדרשים');
      return;
    }

    const { error } = await supabase.from('coupons').insert({
      code: newCoupon.code.toUpperCase(),
      type: newCoupon.type,
      value: newCoupon.value,
      max_uses: newCoupon.maxUses,
      used_count: 0,
      is_active: true,
    });

    if (error) {
      alert('שגיאה ביצירת קופון: ' + error.message);
    } else {
      alert('קופון נוצר בהצלחה!');
      setNewCoupon({ code: '', type: 'percent', value: 0, maxUses: null });
      loadData();
    }
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק קופון זה?')) return;

    await supabase.from('coupons').delete().eq('id', id);
    loadData();
  };

  const updateUserPlan = async (userId: string, plan: string) => {
    await supabase.from('profiles').update({ plan }).eq('id', userId);
    loadData();
  };

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    await supabase.from('profiles').update({ status: newStatus }).eq('id', userId);
    loadData();
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
            <div className="flex items-center gap-2">
              <CreditCard className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">MyCards Admin</span>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-outline btn-sm"
            >
              <ArrowRight className="w-4 h-4 ml-2" />
              חזור לדשבורד
            </button>
          </div>
        </div>
      </nav>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">סה״כ משתמשים</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <Users className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">משתמשים פעילים</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeUsers}</p>
              </div>
              <Users className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">כרטיסים</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalCards}</p>
              </div>
              <CreditCard className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">צפיות</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalViews}</p>
              </div>
              <BarChart3 className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">הזמנות</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <ShoppingCart className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">הכנסות</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">₪{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">ביקורות</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalReviews}</p>
              </div>
              <Star className="w-12 h-12 text-yellow-600 opacity-20" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">מוצרים</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
              <ShoppingBag className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>
        </div>

        <div className="flex gap-1 sm:gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-2 sm:px-4 py-2 font-medium transition-colors whitespace-nowrap text-xs sm:text-base ${
              activeTab === 'stats'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline ml-1" />
            סטטיסטיקות
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-2 sm:px-4 py-2 font-medium transition-colors whitespace-nowrap text-xs sm:text-base ${
              activeTab === 'users'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4 inline ml-1" />
            משתמשים
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-2 sm:px-4 py-2 font-medium transition-colors whitespace-nowrap text-xs sm:text-base ${
              activeTab === 'orders'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShoppingCart className="w-4 h-4 inline ml-1" />
            הזמנות
          </button>
          <button
            onClick={() => setActiveTab('cards')}
            className={`px-2 sm:px-4 py-2 font-medium transition-colors whitespace-nowrap text-xs sm:text-base ${
              activeTab === 'cards'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <CreditCard className="w-4 h-4 inline ml-1" />
            כרטיסים
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-2 sm:px-4 py-2 font-medium transition-colors whitespace-nowrap text-xs sm:text-base ${
              activeTab === 'reviews'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Star className="w-4 h-4 inline ml-1" />
            ביקורות
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-2 sm:px-4 py-2 font-medium transition-colors whitespace-nowrap text-xs sm:text-base ${
              activeTab === 'products'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4 inline ml-1" />
            מוצרים
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-2 sm:px-4 py-2 font-medium transition-colors whitespace-nowrap text-xs sm:text-base ${
              activeTab === 'gallery'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ImageIcon className="w-4 h-4 inline ml-1" />
            גלריה
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-2 sm:px-4 py-2 font-medium transition-colors whitespace-nowrap text-xs sm:text-base ${
              activeTab === 'coupons'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Tag className="w-4 h-4 inline ml-1" />
            קופונים
          </button>
        </div>

        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">משתמשים לפי תוכנית</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium">Starter</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {users.filter((u) => u.plan === 'starter').length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="font-medium">Pro</span>
                  <span className="text-2xl font-bold text-purple-600">
                    {users.filter((u) => u.plan === 'pro').length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">Enterprise</span>
                  <span className="text-2xl font-bold text-green-600">
                    {users.filter((u) => u.plan === 'enterprise').length}
                  </span>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">הכנסות לפי חודש</h2>
              <div className="space-y-3">
                {orders
                  .filter((o) => o.status === 'paid')
                  .slice(0, 5)
                  .map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{order.profiles?.full_name || order.profiles?.email}</p>
                        <p className="text-xs text-gray-600">
                          {new Date(order.created_at).toLocaleDateString('he-IL')}
                        </p>
                      </div>
                      <span className="text-lg font-bold text-green-600">₪{order.amount}</span>
                    </div>
                  ))}
                {orders.filter((o) => o.status === 'paid').length === 0 && (
                  <p className="text-center text-gray-500 py-4">אין הזמנות</p>
                )}
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">כרטיסים פופולריים</h2>
              <div className="space-y-3">
                {cards
                  .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
                  .slice(0, 5)
                  .map((card) => (
                    <div key={card.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{card.business_profiles?.business_name}</p>
                        <p className="text-xs text-gray-600">{card.slug}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-gray-500" />
                        <span className="font-bold">{card.views_count || 0}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">ביקורות אחרונות</h2>
              <div className="space-y-3">
                {reviews.slice(0, 5).map((review) => (
                  <div key={review.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{review.customer_name}</span>
                      <div className="flex">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">{review.comment}</p>
                  </div>
                ))}
                {reviews.length === 0 && (
                  <p className="text-center text-gray-500 py-4">אין ביקורות</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="card">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">היסטוריית הזמנות ורכישות</h2>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-right py-3 px-2 sm:px-4 font-semibold text-gray-900 text-sm">מזהה</th>
                    <th className="text-right py-3 px-2 sm:px-4 font-semibold text-gray-900 text-sm">משתמש</th>
                    <th className="text-right py-3 px-2 sm:px-4 font-semibold text-gray-900 text-sm">תוכנית</th>
                    <th className="text-right py-3 px-2 sm:px-4 font-semibold text-gray-900 text-sm">סכום</th>
                    <th className="text-right py-3 px-2 sm:px-4 font-semibold text-gray-900 text-sm">הנחה</th>
                    <th className="text-right py-3 px-2 sm:px-4 font-semibold text-gray-900 text-sm">סטטוס</th>
                    <th className="text-right py-3 px-2 sm:px-4 font-semibold text-gray-900 text-sm">תאריך</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-500">
                        אין הזמנות במערכת
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100">
                        <td className="py-3 px-2 sm:px-4 text-xs font-mono">
                          {order.id.substring(0, 8)}...
                        </td>
                        <td className="py-3 px-2 sm:px-4 text-sm">
                          {order.profiles?.full_name || order.profiles?.email || '-'}
                        </td>
                        <td className="py-3 px-2 sm:px-4">
                          <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                            {order.plan}
                          </span>
                        </td>
                        <td className="py-3 px-2 sm:px-4 text-sm font-semibold">
                          ₪{order.amount}
                        </td>
                        <td className="py-3 px-2 sm:px-4 text-sm text-green-600">
                          {order.discount_amount > 0 ? `-₪${order.discount_amount}` : '-'}
                        </td>
                        <td className="py-3 px-2 sm:px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === 'paid'
                                ? 'bg-green-100 text-green-700'
                                : order.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 sm:px-4 text-xs text-gray-600">
                          {new Date(order.created_at).toLocaleDateString('he-IL', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="card">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">ניהול משתמשים</h2>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-right py-3 px-2 sm:px-4 font-semibold text-gray-900 text-sm">
                      שם מלא
                    </th>
                    <th className="text-right py-3 px-2 sm:px-4 font-semibold text-gray-900 text-sm">מייל</th>
                    <th className="text-right py-3 px-2 sm:px-4 font-semibold text-gray-900 text-sm">תוכנית</th>
                    <th className="text-right py-3 px-2 sm:px-4 font-semibold text-gray-900 text-sm">סטטוס</th>
                    <th className="text-right py-3 px-2 sm:px-4 font-semibold text-gray-900 text-sm">
                      תאריך הצטרפות
                    </th>
                    <th className="text-right py-3 px-2 sm:px-4 font-semibold text-gray-900 text-sm">
                      פעולות
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">
                        אין משתמשים במערכת
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} className="border-b border-gray-100">
                        <td className="py-3 px-2 sm:px-4 text-sm">{u.full_name || '-'}</td>
                        <td className="py-3 px-2 sm:px-4 text-sm font-medium text-blue-600">
                          {u.email}
                        </td>
                        <td className="py-3 px-2 sm:px-4">
                          <select
                            value={u.plan}
                            onChange={(e) => updateUserPlan(u.id, e.target.value)}
                            className="text-xs sm:text-sm border border-gray-300 rounded px-1 sm:px-2 py-1"
                          >
                            <option value="starter">Starter</option>
                            <option value="pro">Pro</option>
                            <option value="enterprise">Enterprise</option>
                          </select>
                        </td>
                        <td className="py-3 px-2 sm:px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              u.status === 'active'
                                ? 'bg-green-100 text-green-700'
                                : u.status === 'suspended'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {u.status === 'active'
                              ? 'פעיל'
                              : u.status === 'suspended'
                              ? 'מושעה'
                              : 'חסום'}
                          </span>
                        </td>
                        <td className="py-3 px-2 sm:px-4 text-xs text-gray-600">
                          {u.created_at
                            ? new Date(u.created_at).toLocaleDateString('he-IL')
                            : '-'}
                        </td>
                        <td className="py-3 px-2 sm:px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleUserStatus(u.id, u.status)}
                              className={`text-xs sm:text-sm px-2 py-1 rounded ${
                                u.status === 'active'
                                  ? 'text-orange-600 hover:bg-orange-50'
                                  : 'text-green-600 hover:bg-green-50'
                              }`}
                            >
                              {u.status === 'active' ? 'השעה' : 'הפעל'}
                            </button>
                            {u.status !== 'blocked' && (
                              <button
                                onClick={async () => {
                                  if (!confirm('האם לחסום משתמש זה לצמיתות?')) return;
                                  await supabase
                                    .from('profiles')
                                    .update({ status: 'blocked' })
                                    .eq('id', u.id);
                                  loadData();
                                }}
                                className="text-xs sm:text-sm text-red-600 hover:bg-red-50 px-2 py-1 rounded"
                              >
                                חסום
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'cards' && (
          <div className="card">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">כרטיסים קיימים</h2>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-right py-3 px-2 sm:px-4 font-semibold text-gray-900 text-sm">
                      שם עסק
                    </th>
                    <th className="text-right py-3 px-2 sm:px-4 font-semibold text-gray-900 text-sm">
                      משתמש
                    </th>
                    <th className="text-right py-3 px-2 sm:px-4 font-semibold text-gray-900 text-sm">
                      Slug
                    </th>
                    <th className="text-right py-3 px-2 sm:px-4 font-semibold text-gray-900 text-sm">
                      סטטוס
                    </th>
                    <th className="text-right py-3 px-2 sm:px-4 font-semibold text-gray-900 text-sm">
                      צפיות
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cards.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-500">
                        אין כרטיסים במערכת
                      </td>
                    </tr>
                  ) : (
                    cards.map((card) => (
                      <tr key={card.id} className="border-b border-gray-100">
                        <td className="py-3 px-2 sm:px-4 text-sm font-medium">
                          {card.business_profiles?.business_name || '-'}
                        </td>
                        <td className="py-3 px-2 sm:px-4 text-sm">
                          {card.profiles?.email || '-'}
                        </td>
                        <td className="py-3 px-2 sm:px-4 text-sm text-blue-600">
                          <a
                            href={`/u/${card.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {card.slug}
                          </a>
                        </td>
                        <td className="py-3 px-2 sm:px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              card.is_published
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {card.is_published ? 'מפורסם' : 'טיוטה'}
                          </span>
                        </td>
                        <td className="py-3 px-2 sm:px-4 text-sm">
                          {card.views_count || 0}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="card">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">ניהול ביקורות</h2>
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-center text-gray-500 py-8">אין ביקורות במערכת</p>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-gray-900">{review.customer_name}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              review.is_approved
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {review.is_approved ? 'מאושר' : 'ממתין לאישור'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{review.comment}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>כרטיס: {review.cards?.business_profiles?.business_name || '-'}</span>
                          <span>•</span>
                          <span>{new Date(review.created_at).toLocaleDateString('he-IL')}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!review.is_approved && (
                          <button
                            onClick={async () => {
                              await supabase
                                .from('reviews')
                                .update({ is_approved: true })
                                .eq('id', review.id);
                              loadData();
                            }}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={async () => {
                            if (!confirm('האם למחוק ביקורת זו?')) return;
                            await supabase.from('reviews').delete().eq('id', review.id);
                            loadData();
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="card">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">כל המוצרים</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.length === 0 ? (
                <div className="col-span-full text-center text-gray-500 py-8">
                  אין מוצרים במערכת
                </div>
              ) : (
                products.map((product) => (
                  <div key={product.id} className="card">
                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                    )}
                    <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-blue-600">
                        ₪{product.price}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          product.is_available
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {product.is_available ? 'זמין' : 'אזל'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      כרטיס: {product.cards?.business_profiles?.business_name || '-'}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="card">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">כל תמונות הגלריה</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryItems.length === 0 ? (
                <div className="col-span-full text-center text-gray-500 py-8">
                  אין תמונות גלריה במערכת
                </div>
              ) : (
                galleryItems.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <img
                      src={item.image_url}
                      alt={item.title || 'Gallery'}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    {item.title && (
                      <p className="font-medium text-sm text-gray-900 truncate">{item.title}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      {item.cards?.business_profiles?.business_name || '-'}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'coupons' && (
          <div>
            <div className="card mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">צור קופון חדש</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    קוד קופון
                  </label>
                  <input
                    type="text"
                    value={newCoupon.code}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })
                    }
                    className="input"
                    placeholder="SAVE20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">סוג</label>
                  <select
                    value={newCoupon.type}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, type: e.target.value as any })
                    }
                    className="input"
                  >
                    <option value="percent">אחוזים</option>
                    <option value="fixed">סכום קבוע</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ערך</label>
                  <input
                    type="number"
                    value={newCoupon.value}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, value: parseFloat(e.target.value) })
                    }
                    className="input"
                    placeholder="20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    מספר שימושים
                  </label>
                  <input
                    type="number"
                    value={newCoupon.maxUses || ''}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        maxUses: e.target.value ? parseInt(e.target.value) : null,
                      })
                    }
                    className="input"
                    placeholder="ללא הגבלה"
                  />
                </div>
              </div>

              <button onClick={createCoupon} className="btn btn-primary btn-md mt-4">
                <Plus className="w-4 h-4 ml-2" />
                צור קופון
              </button>
            </div>

            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">קופונים קיימים</h2>
              <div className="space-y-3">
                {coupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-lg text-gray-900">
                          {coupon.code}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            coupon.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {coupon.is_active ? 'פעיל' : 'לא פעיל'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {coupon.type === 'percent' ? `${coupon.value}% הנחה` : `₪${coupon.value} הנחה`}
                        {' • '}
                        נוצל {coupon.used_count}
                        {coupon.max_uses ? ` מתוך ${coupon.max_uses}` : ' פעמים'}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteCoupon(coupon.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                  </div>
                ))}

                {coupons.length === 0 && (
                  <p className="text-center text-gray-500 py-8">אין קופונים במערכת</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

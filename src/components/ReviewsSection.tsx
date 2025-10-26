import { useState, useEffect } from 'react';
import { Star, Loader, ThumbsUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface ReviewsSectionProps {
  cardId: string;
  isOwner?: boolean;
}

export function ReviewsSection({ cardId, isOwner = false }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    rating: 5,
    comment: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [cardId]);

  const loadReviews = async () => {
    const query = supabase
      .from('reviews')
      .select('*')
      .eq('card_id', cardId)
      .order('created_at', { ascending: false });

    if (!isOwner) {
      query.eq('is_approved', true);
    }

    const { data } = await query;
    if (data) setReviews(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase.from('reviews').insert({
      card_id: cardId,
      customer_name: formData.customer_name,
      rating: formData.rating,
      comment: formData.comment,
      is_approved: false,
    });

    if (!error) {
      alert('תודה על הביקורת! היא תפורסם לאחר אישור.');
      setFormData({ customer_name: '', rating: 5, comment: '' });
      setShowForm(false);
      loadReviews();
    }

    setSubmitting(false);
  };

  const approveReview = async (reviewId: string) => {
    await supabase
      .from('reviews')
      .update({ is_approved: true })
      .eq('id', reviewId);
    loadReviews();
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm('האם למחוק ביקורת זו?')) return;
    await supabase.from('reviews').delete().eq('id', reviewId);
    loadReviews();
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">ביקורות לקוחות</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              {renderStars(
                Math.round(
                  reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                )
              )}
              <span className="text-sm text-gray-600">
                ({reviews.length} ביקורות)
              </span>
            </div>
          )}
        </div>
        {!isOwner && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary btn-sm"
          >
            {showForm ? 'ביטול' : 'כתוב ביקורת'}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card bg-blue-50">
          <h3 className="font-semibold text-gray-900 mb-4">כתוב ביקורת חדשה</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                השם שלך *
              </label>
              <input
                type="text"
                value={formData.customer_name}
                onChange={(e) =>
                  setFormData({ ...formData, customer_name: e.target.value })
                }
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                דירוג *
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                  >
                    <Star
                      className={`w-8 h-8 cursor-pointer transition ${
                        star <= formData.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 hover:text-yellow-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                הביקורת שלך *
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
                className="input"
                rows={4}
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-md w-full"
            >
              {submitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  שולח...
                </>
              ) : (
                <>
                  <ThumbsUp className="w-4 h-4 ml-2" />
                  שלח ביקורת
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Star className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">אין ביקורות עדיין</p>
          <p className="text-sm text-gray-500">היה הראשון לכתוב ביקורת!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {review.customer_name}
                  </h4>
                  {renderStars(review.rating)}
                </div>
                {isOwner && (
                  <div className="flex gap-2">
                    {!review.is_approved && (
                      <button
                        onClick={() => approveReview(review.id)}
                        className="text-sm text-green-600 hover:underline"
                      >
                        אשר
                      </button>
                    )}
                    <button
                      onClick={() => deleteReview(review.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      מחק
                    </button>
                  </div>
                )}
              </div>
              <p className="text-gray-700">{review.comment}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(review.created_at).toLocaleDateString('he-IL')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

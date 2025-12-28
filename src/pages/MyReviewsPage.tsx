import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Pencil, Trash2, MessageSquare } from 'lucide-react';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    image_url: string | null;
  };
}

const MyReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data } = await api.get('/reviews/user/me');
      setReviews(data.data || data || []);
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (review: Review) => {
    setEditingId(review.id);
    setEditData({ rating: review.rating, comment: review.comment });
  };

  const handleUpdate = async (id: string) => {
    try {
      await api.patch(`/reviews/${id}`, editData);
      toast.success('Review updated');
      setEditingId(null);
      fetchReviews();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to update review');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      toast.success('Review deleted');
      fetchReviews();
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  if (loading) {
    return (
      <div className="daraz-container py-10">
        <div className="bg-white rounded-sm shadow-card p-10 text-center">
          <p className="text-gray-500">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="daraz-container py-6">
      <h1 className="text-2xl font-medium text-gray-800 mb-6">My Reviews</h1>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-sm shadow-card p-10 flex flex-col items-center">
          <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-medium text-gray-700 mb-2">No Reviews Yet</h2>
          <p className="text-gray-500 mb-6">You haven't reviewed any products</p>
          <Link to="/" className="daraz-btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-sm shadow-card p-4">
              <div className="flex gap-4">
                {/* Product Image */}
                <Link to={`/products/${review.product.id}`} className="shrink-0">
                  <img
                    src={review.product.image_url || 'https://via.placeholder.com/80'}
                    alt={review.product.name}
                    className="w-20 h-20 object-cover rounded-sm border border-gray-100"
                  />
                </Link>

                {/* Review Content */}
                <div className="flex-1">
                  <Link
                    to={`/products/${review.product.id}`}
                    className="font-medium text-gray-800 hover:text-primary"
                  >
                    {review.product.name}
                  </Link>

                  {editingId === review.id ? (
                    <div className="mt-3 space-y-3">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setEditData({ ...editData, rating: star })}
                            className={`text-2xl ${star <= editData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={editData.comment}
                        onChange={(e) => setEditData({ ...editData, comment: e.target.value })}
                        className="w-full border border-gray-300 rounded-sm p-3 text-sm focus:border-primary outline-none"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(review.id)}
                          className="px-4 py-1 bg-primary text-white text-sm rounded-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-4 py-1 border border-gray-300 text-sm rounded-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
                    </>
                  )}
                </div>

                {/* Actions */}
                {editingId !== review.id && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(review)}
                      className="p-2 hover:bg-gray-100 rounded-sm text-gray-500"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="p-2 hover:bg-red-50 rounded-sm text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviewsPage;

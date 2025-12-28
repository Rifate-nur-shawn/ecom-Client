import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Minus, Plus, Star, Heart, Share2, MapPin, Truck, ShieldCheck, User } from 'lucide-react';
import { api } from '../lib/api';
import type { Product } from '../types';
import { useCart } from '../store/useCart';
import { useAuth } from '../store/useAuth';
import toast from 'react-hot-toast';

interface ProductImage {
  id: string;
  url: string;
  alt_text?: string;
  is_primary?: boolean;
}

interface ExtendedProduct extends Product {
  images?: ProductImage[];
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
}

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ExtendedProduct | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchReviews();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data.data || data);
    } catch (error) {
      console.error("Failed to fetch product");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await api.get(`/reviews/products/${id}`);
      setReviews(data.data?.reviews || data.data || data.reviews || data || []);
    } catch (error) {
      console.error("Failed to fetch reviews");
    }
  };

  const handleAddToCart = async () => {
    if (product) {
      await addItem(product, quantity);
    }
  };

  const handleBuyNow = async () => {
    if (product) {
      await addItem(product, quantity);
      navigate('/cart');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to submit a review');
      navigate('/login');
      return;
    }

    setSubmittingReview(true);
    try {
      await api.post('/reviews', {
        productId: id,
        rating: newReview.rating,
        comment: newReview.comment,
      });
      toast.success('Review submitted!');
      setNewReview({ rating: 5, comment: '' });
      fetchReviews();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Get all available images for the product
  const getProductImages = (): string[] => {
    const images: string[] = [];
    
    // Add images from the images array (ProductImage table)
    if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
      product.images.forEach(img => {
        if (img.url) images.push(img.url);
      });
    }
    
    // Add the main image_url if exists and not already in array
    const mainImage = product?.imageUrl || (product as any)?.image_url;
    if (mainImage && !images.includes(mainImage)) {
      images.unshift(mainImage);
    }
    
    // Return at least placeholder if no images
    return images.length > 0 ? images : ['https://via.placeholder.com/400'];
  };

  const productImages = product ? getProductImages() : [];
  const currentImage = productImages[selectedImageIndex] || productImages[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
    : 0;

  if (loading) return <div className="daraz-container py-20 text-center">Loading...</div>;
  
  if (!product) return <div className="daraz-container py-20 text-center">Product not found</div>;

  return (
    <div className="daraz-container py-4">
      <div className="bg-white rounded-sm shadow-card p-4 flex flex-col md:flex-row gap-8">
        {/* Left: Image Gallery with Zoom */}
        <div className="md:w-1/3">
          {/* Main Image with Zoom */}
          <div 
            ref={imageContainerRef}
            className="w-full h-80 bg-gray-50 flex items-center justify-center mb-4 border border-gray-100 rounded-sm overflow-hidden cursor-zoom-in relative"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <img 
              src={currentImage} 
              alt={product.name} 
              className={`max-h-full max-w-full object-contain transition-transform duration-200 ${isZoomed ? 'scale-150' : 'scale-100'}`}
              style={isZoomed ? {
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
              } : undefined}
            />
          </div>
          
          {/* Thumbnail Gallery - Only show if there are images */}
          {productImages.length > 0 && (
            <div className="flex gap-2 justify-center flex-wrap">
              {productImages.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedImageIndex(i)}
                  className={`w-14 h-14 border cursor-pointer hover:border-primary p-1 transition-all ${
                    selectedImageIndex === i ? 'border-primary border-2' : 'border-gray-200'
                  }`}
                >
                  <img 
                    src={img} 
                    className="w-full h-full object-cover" 
                    alt={`Product view ${i + 1}`} 
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Middle: Details */}
        <div className="md:w-1/3 border-r border-gray-100 pr-8">
          <h1 className="text-xl font-medium text-gray-800 mb-2 leading-relaxed">{product.name}</h1>
          
          {/* Ratings & Share */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="flex text-yellow-400 text-xs">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3 h-3 ${i < Math.round(averageRating) ? 'fill-current' : ''}`} />
                ))}
              </div>
              <span className="text-blue-500 hover:underline cursor-pointer">{reviews.length} Reviews</span>
            </div>
            <div className="flex gap-3 text-gray-400">
              <Share2 className="w-5 h-5 cursor-pointer hover:text-gray-600" />
              <Heart className="w-5 h-5 cursor-pointer hover:text-red-500" />
            </div>
          </div>

          <div className="h-px w-full bg-gray-200 mb-4"></div>

          {/* Price */}
          <div className="mb-6">
            <div className="text-3xl font-bold text-primary">৳ {product.price.toLocaleString()}</div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
              <span className="line-through">৳ {(product.price * 1.2).toLocaleString()}</span>
              <span className="text-gray-800">-20%</span>
            </div>
          </div>

          {/* Stock */}
          <div className="mb-6">
            <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} items in stock` : 'Out of stock'}
            </span>
          </div>

          {/* Quantity */}
          <div className="flex gap-8 items-center mb-8">
            <span className="text-gray-500 text-sm font-medium w-16">Quantity</span>
            <div className="flex items-center">
              <button 
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 rounded-l-sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="w-3 h-3" />
              </button>
              <input type="text" value={quantity} readOnly className="w-12 h-8 text-center border-t border-b border-gray-100 text-sm font-bold text-gray-700" />
              <button 
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 rounded-r-sm"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button 
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 bg-[#2abbe8] text-white font-bold uppercase py-3 rounded-sm leading-tight hover:bg-blue-500 shadow-lg text-sm disabled:opacity-50"
            >
              Buy Now
            </button>
            <button 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-primary text-white font-bold uppercase py-3 rounded-sm leading-tight hover:bg-primary-hover shadow-lg text-sm disabled:opacity-50"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Right: Delivery & Warranty */}
        <div className="md:w-1/3 bg-gray-50 p-4 rounded-sm">
          <div className="bg-white p-3 mb-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500 font-medium">Delivery</span>
            </div>
            <div className="flex gap-3 mb-4">
              <MapPin className="w-5 h-5 text-gray-400 mt-1" />
              <div className="text-sm">
                <div className="font-bold text-gray-800">Dhaka, Bangladesh</div>
              </div>
            </div>
            <div className="h-px bg-gray-100 mb-3"></div>
            <div className="flex gap-3 mb-2">
              <Truck className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <div className="font-bold text-gray-800 text-sm">Standard Delivery</div>
                <div className="text-xs text-gray-500">3 - 5 days</div>
              </div>
              <div className="font-bold text-gray-800 text-sm">৳ 60</div>
            </div>
          </div>

          <div className="bg-white p-3">
            <div className="flex gap-3 mb-2">
              <ShieldCheck className="w-5 h-5 text-gray-400" />
              <div>
                <div className="font-bold text-gray-800 text-sm">7 Days Returns</div>
                <div className="text-xs text-gray-500">Change of mind is not applicable</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="mt-4 bg-white rounded-sm shadow-card p-4">
        <h2 className="bg-gray-100 p-2 font-bold text-gray-700 mb-4 text-sm">Product Details</h2>
        <div className="text-sm text-gray-600 leading-loose">
          <p>{product.description}</p>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-4 bg-white rounded-sm shadow-card p-4">
        <h2 className="bg-gray-100 p-2 font-bold text-gray-700 mb-4 text-sm">Customer Reviews ({reviews.length})</h2>
        
        {/* Review Form */}
        {isAuthenticated && (
          <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-gray-50 rounded-sm">
            <h3 className="font-medium text-gray-800 mb-3">Write a Review</h3>
            <div className="mb-3">
              <label className="block text-sm text-gray-600 mb-1">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className={`text-2xl ${star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-sm text-gray-600 mb-1">Comment</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="w-full border border-gray-300 rounded-sm p-3 text-sm focus:border-primary outline-none"
                rows={3}
                required
              />
            </div>
            <button
              type="submit"
              disabled={submittingReview}
              className="daraz-btn-primary disabled:opacity-50"
            >
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {reviews.map((review) => (
              <div key={review.id} className="py-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-800">{review.user?.name || 'Anonymous'}</span>
                      <div className="flex text-yellow-400 text-xs">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < review.rating ? '' : 'text-gray-300'}>★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-6">No reviews yet. Be the first to review this product!</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;


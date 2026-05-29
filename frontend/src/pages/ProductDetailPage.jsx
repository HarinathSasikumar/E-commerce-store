import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getProductById, addProductReview } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ProductDetailSkeleton } from '../components/ui/Skeleton';
import { FiStar, FiShoppingCart, FiHeart, FiShare2, FiTruck, FiShield, FiRotateCcw, FiChevronRight, FiMinus, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './ProductDetailPage.css';

function StarRating({ value, onChange, readonly = false }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="star-rating">
      {[1,2,3,4,5].map(s => (
        <button key={s} type="button"
          className={`star-rating__star ${(hovered || value) >= s ? 'star-rating__star--active' : ''}`}
          onMouseEnter={() => !readonly && setHovered(s)}
          onMouseLeave={() => !readonly && setHovered(0)}
          onClick={() => !readonly && onChange && onChange(s)}
          disabled={readonly}>
          <FiStar />
        </button>
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [wishlisted, setWishlisted] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getProductById(id);
        setProduct(data);
      } catch (e) {
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to leave a review'); navigate('/login'); return; }
    if (reviewRating === 0) { toast.error('Please select a rating'); return; }
    setSubmittingReview(true);
    try {
      await addProductReview(id, { rating: reviewRating, comment: reviewText });
      toast.success('Review submitted!');
      const { data } = await getProductById(id);
      setProduct(data);
      setReviewRating(0);
      setReviewText('');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <ProductDetailSkeleton />;
  if (!product) return null;

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const images = product.images?.length ? product.images : ['https://via.placeholder.com/600'];

  return (
    <div className="product-detail page-enter">
      {/* Breadcrumb */}
      <div className="container product-detail__breadcrumb">
        <Link to="/">Home</Link> <FiChevronRight />
        <Link to="/products">Products</Link> <FiChevronRight />
        <Link to={`/products?category=${product.category}`}>{product.category}</Link> <FiChevronRight />
        <span>{product.name}</span>
      </div>

      <div className="container product-detail__grid">
        {/* Gallery */}
        <div className="product-detail__gallery">
          <motion.div className="product-detail__main-img-wrap"
            key={activeImg}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <img
              src={imgError ? `https://via.placeholder.com/600x600?text=${encodeURIComponent(product.name)}` : images[activeImg]}
              alt={product.name}
              className="product-detail__main-img"
              onError={() => setImgError(true)}
            />
            {discount > 0 && <div className="product-detail__discount-badge">-{discount}%</div>}
          </motion.div>
          {images.length > 1 && (
            <div className="product-detail__thumbnails">
              {images.map((img, i) => (
                <button key={i} className={`product-detail__thumb ${i === activeImg ? 'product-detail__thumb--active' : ''}`}
                  onClick={() => { setActiveImg(i); setImgError(false); }}>
                  <img src={img} alt={`View ${i+1}`} onError={e => e.target.src='https://via.placeholder.com/80'} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="product-detail__info">
          <div className="product-detail__category-brand">
            <span className="product-detail__category">{product.category}</span>
            <span className="product-detail__brand">by {product.brand}</span>
          </div>

          <h1 className="product-detail__name">{product.name}</h1>

          <div className="product-detail__rating-row">
            <StarRating value={Math.round(product.ratings)} readonly />
            <span className="product-detail__rating-val">{product.ratings.toFixed(1)}</span>
            <span className="product-detail__review-count">({product.numReviews} reviews)</span>
          </div>

          <div className="product-detail__price-row">
            <span className="product-detail__price">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <>
                <span className="product-detail__original">${product.originalPrice.toFixed(2)}</span>
                <span className="badge badge-danger">Save {discount}%</span>
              </>
            )}
          </div>

          <div className="product-detail__stock-row">
            {product.stock > 0 ? (
              <span className="product-detail__in-stock">✓ In Stock ({product.stock} available)</span>
            ) : (
              <span className="product-detail__out-stock">✗ Out of Stock</span>
            )}
          </div>

          <p className="product-detail__short-desc">{product.description.slice(0, 200)}...</p>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="product-detail__tags">
              {product.tags.map(tag => <span key={tag} className="product-detail__tag">#{tag}</span>)}
            </div>
          )}

          {/* Qty + Cart */}
          <div className="product-detail__actions">
            <div className="product-detail__qty">
              <button className="product-detail__qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}><FiMinus /></button>
              <span className="product-detail__qty-val">{qty}</span>
              <button className="product-detail__qty-btn" onClick={() => setQty(q => Math.min(product.stock, q + 1))} disabled={qty >= product.stock}><FiPlus /></button>
            </div>
            <button className="btn btn-primary btn-lg product-detail__cart-btn" onClick={handleAddToCart} disabled={product.stock === 0}>
              <FiShoppingCart /> {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button className={`product-detail__wish-btn ${wishlisted ? 'product-detail__wish-btn--active' : ''}`}
              onClick={() => { setWishlisted(w => !w); toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist! ❤️'); }}>
              <FiHeart />
            </button>
            <button className="product-detail__wish-btn" onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success('Link copied!'); }}>
              <FiShare2 />
            </button>
          </div>

          {/* Guarantees */}
          <div className="product-detail__guarantees">
            {[
              { icon: FiTruck, text: 'Free shipping on orders $99+' },
              { icon: FiShield, text: '2-year warranty included' },
              { icon: FiRotateCcw, text: '30-day easy returns' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="product-detail__guarantee">
                <Icon /> <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container product-detail__tabs-section">
        <div className="product-detail__tabs">
          {['description', 'reviews'].map(tab => (
            <button key={tab} className={`product-detail__tab ${activeTab === tab ? 'product-detail__tab--active' : ''}`}
              onClick={() => setActiveTab(tab)}>
              {tab === 'reviews' ? `Reviews (${product.numReviews})` : 'Description'}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'description' && (
            <motion.div key="desc" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="product-detail__tab-content">
              <p className="product-detail__desc-text">{product.description}</p>
            </motion.div>
          )}
          {activeTab === 'reviews' && (
            <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="product-detail__tab-content">
              {/* Write a review */}
              <div className="review-form glass">
                <h3 className="review-form__title">Write a Review</h3>
                <form onSubmit={handleReview} className="review-form__form">
                  <div className="form-group">
                    <label className="form-label">Your Rating</label>
                    <StarRating value={reviewRating} onChange={setReviewRating} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Your Review</label>
                    <textarea className="form-input review-form__textarea" rows={4}
                      placeholder="Share your experience with this product..."
                      value={reviewText} onChange={e => setReviewText(e.target.value)} required />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={submittingReview}>
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>

              {/* Reviews list */}
              <div className="reviews-list">
                {product.reviews?.length === 0 ? (
                  <div className="reviews-empty">No reviews yet. Be the first to review!</div>
                ) : (
                  product.reviews.map((r, i) => (
                    <div key={i} className="review-item glass">
                      <div className="review-item__header">
                        <div className="review-item__avatar">{r.name?.charAt(0)?.toUpperCase()}</div>
                        <div>
                          <div className="review-item__name">{r.name}</div>
                          <div className="review-item__date">{new Date(r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                        </div>
                        <div className="review-item__stars"><StarRating value={r.rating} readonly /></div>
                      </div>
                      <p className="review-item__text">{r.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiStar, FiEye } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [imgError, setImgError] = useState(false);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div className="product-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -6 }}>

      {/* Image */}
      <div className="product-card__img-wrap">
        <Link to={`/product/${product._id}`} tabIndex={-1}>
          <img
            src={imgError ? `https://via.placeholder.com/400x400?text=${encodeURIComponent(product.name)}` : product.images[0]}
            alt={product.name}
            className="product-card__img"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="product-card__badges">
          {discount > 0 && <span className="product-card__badge product-card__badge--sale">-{discount}%</span>}
          {product.badge && <span className="product-card__badge product-card__badge--custom">{product.badge}</span>}
          {product.stock === 0 && <span className="product-card__badge product-card__badge--out">Out of Stock</span>}
        </div>

        {/* Wishlist */}
        <button className={`product-card__wishlist ${wishlisted ? 'product-card__wishlist--active' : ''}`}
          onClick={() => setWishlisted(w => !w)} aria-label="Wishlist">
          <FiHeart />
        </button>

        {/* Hover actions */}
        <div className="product-card__hover-actions">
          <Link to={`/product/${product._id}`} className="product-card__action-btn" aria-label="View">
            <FiEye />
            <span>Quick View</span>
          </Link>
          <button
            className="product-card__action-btn product-card__action-btn--cart"
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            aria-label="Add to cart">
            <FiShoppingCart />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="product-card__info">
        <div className="product-card__category">{product.category}</div>
        <Link to={`/product/${product._id}`} className="product-card__name">{product.name}</Link>
        <div className="product-card__brand">{product.brand}</div>

        {/* Rating */}
        <div className="product-card__rating">
          <div className="stars">
            {[1,2,3,4,5].map(s => (
              <FiStar key={s} className={s <= Math.round(product.ratings) ? 'star--filled' : 'star--empty'} />
            ))}
          </div>
          <span className="product-card__reviews">({product.numReviews})</span>
        </div>

        {/* Price */}
        <div className="product-card__price-row">
          <span className="product-card__price">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="product-card__original">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>

        {/* Stock */}
        <div className="product-card__stock">
          {product.stock > 0
            ? <span className="product-card__stock--in">✓ In Stock</span>
            : <span className="product-card__stock--out">✗ Out of Stock</span>}
        </div>
      </div>
    </motion.div>
  );
}

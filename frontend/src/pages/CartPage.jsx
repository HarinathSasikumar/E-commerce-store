import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiArrowRight, FiTag } from 'react-icons/fi';
import './CartPage.css';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, subtotal, tax, shipping, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="cart-empty page-enter">
        <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
          <motion.div className="cart-empty__inner" initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
            <div className="cart-empty__icon-wrapper">
              <div className="cart-empty__icon-glow"></div>
              <div className="cart-empty__icon"><FiShoppingCart /></div>
            </div>
            <h2 className="cart-empty__title">Your cart is empty</h2>
            <p className="cart-empty__sub">Discover cutting-edge collections designed for those who live beyond ordinary.</p>
            <Link to="/products" className="btn btn-primary btn-lg" style={{ marginTop: '1rem', padding: '1rem 2.5rem', fontSize: '1.05rem', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)' }}>
              <FiArrowLeft /> Start Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page page-enter">
      <div className="container">
        <div className="cart-page__header">
          <h1 className="cart-page__title">Shopping Cart</h1>
          <span className="cart-page__count">{items.length} item{items.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="cart-page__layout">
          {/* Items */}
          <div className="cart-items">
            <AnimatePresence>
              {items.map(item => (
                <motion.div key={item._id} className="cart-item glass"
                  layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30, height: 0 }} transition={{ duration: 0.3 }}>
                  <Link to={`/product/${item._id}`} className="cart-item__img-link">
                    <img src={item.images?.[0] || 'https://via.placeholder.com/100'} alt={item.name}
                      className="cart-item__img" onError={e => e.target.src='https://via.placeholder.com/100'} />
                  </Link>
                  <div className="cart-item__info">
                    <div className="cart-item__category">{item.category}</div>
                    <Link to={`/product/${item._id}`} className="cart-item__name">{item.name}</Link>
                    <div className="cart-item__brand">{item.brand}</div>
                    <div className="cart-item__unit-price">${item.price.toFixed(2)} each</div>
                  </div>
                  <div className="cart-item__controls">
                    <div className="cart-item__qty">
                      <button className="cart-item__qty-btn" onClick={() => updateQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1}><FiMinus /></button>
                      <span className="cart-item__qty-val">{item.quantity}</span>
                      <button className="cart-item__qty-btn" onClick={() => updateQuantity(item._id, item.quantity + 1)} disabled={item.quantity >= item.stock}><FiPlus /></button>
                    </div>
                    <div className="cart-item__subtotal">${(item.price * item.quantity).toFixed(2)}</div>
                    <button className="cart-item__remove" onClick={() => removeFromCart(item._id)} aria-label="Remove"><FiTrash2 /></button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="cart-summary glass">
            <h2 className="cart-summary__title">Order Summary</h2>

            <div className="cart-summary__rows">
              <div className="cart-summary__row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="cart-summary__row"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
              <div className="cart-summary__row">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-success">Free</span> : `$${shipping.toFixed(2)}`}</span>
              </div>
              {shipping > 0 && (
                <div className="cart-summary__shipping-note">
                  <FiTag /> Add ${(99 - subtotal).toFixed(2)} more for free shipping
                </div>
              )}
            </div>

            <div className="divider" />
            <div className="cart-summary__total"><span>Total</span><span>${total.toFixed(2)}</span></div>

            {/* Promo placeholder */}
            <div className="cart-summary__promo">
              <input type="text" placeholder="Promo code" className="form-input cart-summary__promo-input" />
              <button className="btn btn-outline btn-sm">Apply</button>
            </div>

            <button className="btn btn-primary w-full cart-summary__checkout-btn" onClick={() => navigate('/checkout')}>
              Proceed to Checkout <FiArrowRight />
            </button>
            <Link to="/products" className="btn btn-ghost w-full cart-summary__continue-btn">
              <FiArrowLeft /> Continue Shopping
            </Link>

            <div className="cart-summary__secure">🔒 Secure checkout — 256-bit SSL encryption</div>
          </div>
        </div>
      </div>
    </div>
  );
}

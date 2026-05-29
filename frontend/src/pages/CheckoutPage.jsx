import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/api';
import toast from 'react-hot-toast';
import { FiCreditCard, FiLock, FiCheck, FiTruck, FiPackage } from 'react-icons/fi';
import './CheckoutPage.css';

const STEPS = ['Shipping', 'Payment', 'Review'];

const COUNTRIES = ['United States', 'United Kingdom', 'Canada', 'Australia', 'India', 'Germany', 'France', 'Japan'];

import { FiDollarSign, FiBriefcase } from 'react-icons/fi';

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: <FiCreditCard /> },
  { id: 'paypal', label: 'PayPal', icon: <FiDollarSign /> },
  { id: 'upi', label: 'UPI / Bank Transfer', icon: <FiBriefcase /> },
];

export default function CheckoutPage() {
  const { items, subtotal, tax, shipping, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [form, setForm] = useState({
    fullName: user?.name || '', address: '', city: '', state: '', postalCode: '', country: 'United States', phone: '',
    cardNumber: '', cardName: '', cardExpiry: '', cardCvv: '',
  });

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleNext = (e) => {
    e.preventDefault();
    if (step < STEPS.length - 1) setStep(s => s + 1);
  };

  const handlePlace = async () => {
    if (!user) { navigate('/login'); return; }
    setLoading(true);
    try {
      const orderData = {
        orderItems: items.map(i => ({ product: i._id, name: i.name, image: i.images?.[0], price: i.price, quantity: i.quantity })),
        shippingAddress: { fullName: form.fullName, address: form.address, city: form.city, state: form.state, postalCode: form.postalCode, country: form.country, phone: form.phone },
        paymentMethod,
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total,
      };
      const { data } = await createOrder(orderData);
      clearCart();
      navigate('/order-success', { state: { order: data } });
    } catch (e) {
      toast.error(e.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) { navigate('/cart'); return null; }

  return (
    <div className="checkout page-enter">
      {/* Premium Background Orbs */}
      <div className="checkout__bg-orbs">
        <div className="checkout__bg-orb checkout__bg-orb--1" />
        <div className="checkout__bg-orb checkout__bg-orb--2" />
      </div>
      <div className="container checkout__inner">
        {/* Steps */}
        <div className="checkout__steps">
          {STEPS.map((s, i) => (
            <div key={s} className={`checkout__step ${i <= step ? 'checkout__step--active' : ''} ${i < step ? 'checkout__step--done' : ''}`}>
              <div className="checkout__step-num">
                {i < step ? <FiCheck /> : <span>{i + 1}</span>}
              </div>
              <span className="checkout__step-label">{s}</span>
              {i < STEPS.length - 1 && <div className="checkout__step-line" />}
            </div>
          ))}
        </div>

        <div className="checkout__layout">
          {/* Form */}
          <div className="checkout__form-area">
            {step === 0 && (
              <motion.form key="shipping" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="checkout__form glass" onSubmit={handleNext}>
                <div className="checkout__form-header">
                  <FiTruck className="checkout__form-icon" />
                  <h2 className="checkout__form-title">Shipping Address</h2>
                </div>
                <div className="checkout__form-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input className="form-input" name="fullName" value={form.fullName} onChange={handleChange} required placeholder="John Doe" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input className="form-input" name="phone" value={form.phone} onChange={handleChange} required placeholder="+1 (555) 000-0000" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Street Address</label>
                    <input className="form-input" name="address" value={form.address} onChange={handleChange} required placeholder="123 Main St, Apt 4B" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input className="form-input" name="city" value={form.city} onChange={handleChange} required placeholder="New York" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State / Province</label>
                    <input className="form-input" name="state" value={form.state} onChange={handleChange} required placeholder="NY" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Postal Code</label>
                    <input className="form-input" name="postalCode" value={form.postalCode} onChange={handleChange} required placeholder="10001" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <select className="form-input form-select" name="country" value={form.country} onChange={handleChange}>
                      {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-lg checkout__next-btn">Continue to Payment</button>
              </motion.form>
            )}

            {step === 1 && (
              <motion.form key="payment" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="checkout__form glass" onSubmit={handleNext}>
                <div className="checkout__form-header">
                  <FiCreditCard className="checkout__form-icon" />
                  <h2 className="checkout__form-title">Payment Method</h2>
                </div>

                <div className="checkout__payment-methods">
                  {PAYMENT_METHODS.map(m => (
                    <label key={m.id} className={`checkout__payment-option ${paymentMethod === m.id ? 'checkout__payment-option--active' : ''}`}>
                      <input type="radio" name="paymentMethod" value={m.id} checked={paymentMethod === m.id}
                        onChange={e => setPaymentMethod(e.target.value)} className="checkout__payment-radio" />
                      <span className="checkout__payment-icon">{m.icon}</span>
                      <span className="checkout__payment-label">{m.label}</span>
                      {paymentMethod === m.id && <span className="checkout__payment-check"><FiCheck /></span>}
                    </label>
                  ))}
                </div>

                {paymentMethod === 'card' && (
                  <motion.div className="checkout__card-fields" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="checkout__card-header">
                      <div className="checkout__card-brands">
                        {['VISA', 'MC', 'AMEX'].map(b => <span key={b} className="checkout__card-brand">{b}</span>)}
                      </div>
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Card Number</label>
                      <input className="form-input" name="cardNumber" value={form.cardNumber} onChange={handleChange}
                        placeholder="4242 4242 4242 4242" maxLength={19}
                        onInput={e => { e.target.value = e.target.value.replace(/\D/g,'').replace(/(\d{4})/g,'$1 ').trim(); }} />
                    </div>
                    <div className="checkout__form-grid">
                      <div className="form-group">
                        <label className="form-label">Cardholder Name</label>
                        <input className="form-input" name="cardName" value={form.cardName} onChange={handleChange} placeholder="John Doe" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Expiry Date</label>
                        <input className="form-input" name="cardExpiry" value={form.cardExpiry} onChange={handleChange} placeholder="MM / YY" maxLength={7} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">CVV</label>
                        <input className="form-input" name="cardCvv" value={form.cardCvv} onChange={handleChange} placeholder="•••" maxLength={4} type="password" />
                      </div>
                    </div>
                    <div className="checkout__card-secure"><FiLock /> Your card info is encrypted & secure</div>
                  </motion.div>
                )}

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setStep(0)}>Back</button>
                  <button type="submit" className="btn btn-primary btn-lg checkout__next-btn">Review Order</button>
                </div>
              </motion.form>
            )}

            {step === 2 && (
              <motion.div key="review" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="checkout__form glass">
                <div className="checkout__form-header">
                  <FiPackage className="checkout__form-icon" />
                  <h2 className="checkout__form-title">Review Your Order</h2>
                </div>

                <div className="checkout__review-section">
                  <h3 className="checkout__review-subtitle">Shipping to</h3>
                  <p className="checkout__review-text">{form.fullName}<br />{form.address}<br />{form.city}, {form.state} {form.postalCode}<br />{form.country}<br />{form.phone}</p>
                </div>
                <div className="checkout__review-section">
                  <h3 className="checkout__review-subtitle">Payment</h3>
                  <p className="checkout__review-text">{PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label}</p>
                </div>
                <div className="checkout__review-section">
                  <h3 className="checkout__review-subtitle">Items ({items.length})</h3>
                  {items.map(item => (
                    <div key={item._id} className="checkout__review-item">
                      <img src={item.images?.[0] || 'https://via.placeholder.com/50'} alt={item.name} className="checkout__review-item-img" onError={e => e.target.src='https://via.placeholder.com/50'} />
                      <div className="checkout__review-item-info">
                        <span className="checkout__review-item-name">{item.name}</span>
                        <span className="checkout__review-item-qty">Qty: {item.quantity}</span>
                      </div>
                      <span className="checkout__review-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
                  <button className="btn btn-primary btn-lg checkout__next-btn" onClick={handlePlace} disabled={loading}>
                    {loading ? 'Processing...' : `Place Order — $${total.toFixed(2)}`}
                  </button>
                </div>

                <p className="checkout__terms">By placing this order, you agree to our Terms of Service and Privacy Policy.</p>
              </motion.div>
            )}
          </div>

          {/* Order Summary sidebar */}
          <div className="checkout__summary glass">
            <h3 className="checkout__summary-title">Order Summary</h3>
            <div className="checkout__summary-items">
              {items.map(item => (
                <div key={item._id} className="checkout__summary-item">
                  <div className="checkout__summary-item-img-wrap">
                    <img src={item.images?.[0] || 'https://via.placeholder.com/56'} alt={item.name} onError={e => e.target.src='https://via.placeholder.com/56'} />
                    <span className="checkout__summary-item-qty">{item.quantity}</span>
                  </div>
                  <span className="checkout__summary-item-name">{item.name}</span>
                  <span className="checkout__summary-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="divider" />
            <div className="checkout__summary-rows">
              <div className="checkout__summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="checkout__summary-row"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
              <div className="checkout__summary-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
            </div>
            <div className="divider" />
            <div className="checkout__summary-total"><span>Total</span><strong>${total.toFixed(2)}</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FiMail, FiLock, FiEye, FiEyeOff, FiShoppingBag,
  FiStar, FiAlertCircle, FiArrowRight, FiShield,
  FiUsers, FiPackage
} from 'react-icons/fi';

import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

/* ─── Floating product card data ──────────────────────── */
const FLOAT_CARDS = [
  {
    cls: 'auth-float-card-1',
    imgCls: 'auth-float-card-img-1',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=100&h=100&fit=crop',
    name: 'Luxury Timepiece',
    price: '$2,499',
    stars: 5,
  },
  {
    cls: 'auth-float-card-2',
    imgCls: 'auth-float-card-img-2',
    image: 'https://images.unsplash.com/photo-1599643478514-4a4e09d56334?w=100&h=100&fit=crop',
    name: 'Diamond Necklace',
    price: '$4,199',
    stars: 5,
  },
  {
    cls: 'auth-float-card-3',
    imgCls: 'auth-float-card-img-3',
    image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=100&h=100&fit=crop',
    name: 'Designer Handbag',
    price: '$1,299',
    stars: 4,
  },
];

/* ─── Framer-Motion variants ──────────────────────────── */
const panelVariants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const formVariants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 } },
};

const cardVariants = (i) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.4 + i * 0.15, ease: 'easeOut' },
  },
});

const floatAnim = (i) => ({
  y: [0, i % 2 === 0 ? -10 : -6, 0],
  transition: {
    duration: 3 + i * 0.5,
    repeat: Infinity,
    ease: 'easeInOut',
    delay: i * 0.4,
  },
});

/* ─── Component ───────────────────────────────────────── */
export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  /* Controlled change */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (submitError) setSubmitError('');
  };

  /* Client-side validation */
  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await login(form.email, form.password);
    if (result.success) {
      navigate('/');
    } else {
      setSubmitError(result.message || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      {/* ── Left Decorative Panel ── */}
      <motion.div
        className="auth-panel"
        variants={panelVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="auth-panel-gradient" />
        <div className="auth-panel-grid" />
        <div className="auth-panel-glow-1" />
        <div className="auth-panel-glow-2" />
        <div className="auth-panel-glow-3" />

        <div className="auth-panel-content">
          {/* Brand */}
          <motion.div
            className="auth-brand"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="auth-brand-logo">
              <div className="auth-brand-icon">
                <FiShoppingBag />
              </div>
              <span className="auth-brand-name display-serif">LuxeMart</span>
            </div>
            <p className="auth-brand-tagline">
              Experience the future of luxury shopping with modern innovation.
            </p>
          </motion.div>

          {/* Floating product cards */}
          <div className="auth-floating-cards">
            {FLOAT_CARDS.map((card, i) => (
              <motion.div
                key={card.name}
                className={`auth-float-card ${card.cls}`}
                variants={cardVariants(i)}
                initial="hidden"
                animate={['visible', floatAnim(i)]}
              >
                <div className={`auth-float-card-img ${card.imgCls}`} style={{ padding: 0, overflow: 'hidden' }}>
                  <img src={card.image} alt={card.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="auth-float-card-info">
                  <div className="auth-float-card-name">{card.name}</div>
                  <div className="auth-float-card-price">{card.price}</div>
                  <div className="auth-float-card-stars">
                    {Array.from({ length: card.stars }).map((_, si) => (
                      <FiStar key={si} style={{ fill: 'currentColor' }} />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust badge */}
          <motion.div
            className="auth-trust-badge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="auth-trust-badge-icon">
              <FiShield />
            </div>
            <span>
              Trusted by <strong>50K+</strong> shoppers worldwide
            </span>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="auth-stats-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            {[
              { num: '10K+', label: 'Products' },
              { num: '50K+', label: 'Customers' },
              { num: '4.9★', label: 'Rating' },
            ].map((s) => (
              <div key={s.label} className="auth-stat">
                <div className="auth-stat-num">{s.num}</div>
                <div className="auth-stat-label">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ── Right Form Section ── */}
      <div className="auth-form-section">
        <motion.div
          className="auth-form-card"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <div className="auth-form-header">
            <div className="auth-form-eyebrow">
              <FiShoppingBag size={11} />
              Welcome Back
            </div>
            <h1 className="auth-form-title">
              Sign in to{' '}
              <span className="text-gradient display-serif">LuxeMart</span>
            </h1>
            <p className="auth-form-subtitle">
              Elevate your everyday lifestyle with exclusive premium experiences.
            </p>
          </div>

          {/* Error Banner */}
          <AnimatePresence>
            {submitError && (
              <motion.div
                className="auth-error-banner"
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: '1.25rem' }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.25 }}
              >
                <FiAlertCircle size={16} style={{ flexShrink: 0 }} />
                {submitError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="auth-field-group">
              <label className="auth-field-label" htmlFor="login-email">
                Email Address
              </label>
              <div className="auth-field-wrapper">
                <FiMail className="auth-field-icon" />
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className={`auth-field-input${errors.email ? ' input-error' : ''}`}
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    className="auth-field-error"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                  >
                    <FiAlertCircle size={12} /> {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password */}
            <div className="auth-field-group">
              <label className="auth-field-label" htmlFor="login-password">
                Password
              </label>
              <div className="auth-field-wrapper">
                <FiLock className="auth-field-icon" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className={`auth-field-input${errors.password ? ' input-error' : ''}`}
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  className="auth-pw-toggle"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    className="auth-field-error"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                  >
                    <FiAlertCircle size={12} /> {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Forgot Password */}
            <button
              type="button"
              className="auth-forgot-link"
              onClick={() => toast('Password reset coming soon!')}
            >
              Forgot Password?
            </button>

            {/* Submit */}
            <motion.button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <>
                  <span className="auth-spinner" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <FiArrowRight size={17} />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">New here?</span>
            <div className="auth-divider-line" />
          </div>

          {/* Bottom link */}
          <p className="auth-bottom-link">
            Don&apos;t have an account?
            <Link to="/signup">Create your account</Link>
          </p>

          {/* Perks row */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              justifyContent: 'center',
              marginTop: '1.5rem',
              flexWrap: 'wrap',
            }}
          >
            {[
              { icon: <FiShield size={12} />, text: 'Secure checkout' },
              { icon: <FiPackage size={12} />, text: 'Free returns' },
              { icon: <FiUsers size={12} />, text: '24/7 support' },
            ].map((perk) => (
              <span
                key={perk.text}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  padding: '0.25rem 0.65rem',
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: '999px',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                {perk.icon} {perk.text}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

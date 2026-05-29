import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiShoppingBag,
  FiStar, FiAlertCircle, FiArrowRight, FiShield, FiCheck,
  FiTruck, FiAward, FiZap
} from 'react-icons/fi';

import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

/* ─── Password strength logic ─────────────────────────── */
function getPasswordStrength(pw) {
  if (!pw) return { level: 0, label: '', key: '' };
  const hasUpper = /[A-Z]/.test(pw);
  const hasLower = /[a-z]/.test(pw);
  const hasNum = /\d/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);
  const score = (hasUpper ? 1 : 0) + (hasLower ? 1 : 0) + (hasNum ? 1 : 0) + (hasSpecial ? 1 : 0);

  if (pw.length < 6) return { level: 1, label: 'Too short', key: 'weak' };
  if (pw.length >= 6 && score <= 2) return { level: 1, label: 'Weak', key: 'weak' };
  if (pw.length >= 8 && score === 3) return { level: 2, label: 'Medium', key: 'medium' };
  if (pw.length >= 10 && score >= 4) return { level: 3, label: 'Strong', key: 'strong' };
  if (pw.length >= 8 && score >= 3) return { level: 2, label: 'Medium', key: 'medium' };
  return { level: 1, label: 'Weak', key: 'weak' };
}

/* ─── Floating card data (signup panel) ───────────────── */
const FLOAT_CARDS = [
  {
    cls: 'auth-float-card-1',
    imgCls: 'auth-float-card-img-1',
    image: 'https://images.unsplash.com/photo-1613317447829-01e403d50f58?w=100&h=100&fit=crop',
    name: 'Artisan Vase',
    price: '$349',
    stars: 5,
  },
  {
    cls: 'auth-float-card-2',
    imgCls: 'auth-float-card-img-2',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=100&h=100&fit=crop',
    name: 'Luxury Sunglasses',
    price: '$599',
    stars: 5,
  },
  {
    cls: 'auth-float-card-3',
    imgCls: 'auth-float-card-img-3',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&h=100&fit=crop',
    name: 'Premium Skincare',
    price: '$189',
    stars: 4,
  },
];

const PERKS = [
  { icon: <FiTruck size={13} />, text: 'Free Shipping', sub: 'On orders over $99' },
  { icon: <FiShield size={13} />, text: 'Secure Payments', sub: '256-bit SSL encryption' },
  { icon: <FiAward size={13} />, text: 'Premium Quality', sub: 'Curated luxury goods' },
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

const fieldVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.25 + i * 0.08, duration: 0.4, ease: 'easeOut' },
  }),
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
export default function SignupPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const strength = getPasswordStrength(form.password);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (submitError) setSubmitError('');
  }, [errors, submitError]);

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

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

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!form.terms) {
      newErrors.terms = 'You must accept the terms to continue';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await register(form.name.trim(), form.email, form.password);
    if (result.success) {
      navigate('/');
    } else {
      setSubmitError(result.message || 'Registration failed. Please try again.');
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
              Explore luxury, innovation, and timeless style — all in one destination.
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

          {/* Perks list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.5 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', width: '100%' }}
          >
            {PERKS.map((perk, i) => (
              <motion.div
                key={perk.text}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + i * 0.1, duration: 0.4 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.6rem 0.9rem',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px',
                }}
              >
                <div style={{
                  width: 30,
                  height: 30,
                  borderRadius: '8px',
                  background: 'var(--grad-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  flexShrink: 0,
                }}>
                  {perk.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {perk.text}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{perk.sub}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust badge */}
          <motion.div
            className="auth-trust-badge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.5 }}
          >
            <div className="auth-trust-badge-icon">
              <FiZap />
            </div>
            <span>
              <strong>Instant access</strong> — join in under 60 seconds
            </span>
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
              <FiAward size={11} />
              Create Account
            </div>
            <h1 className="auth-form-title">
              Join{' '}
              <span className="text-gradient display-serif">LuxeMart</span>
            </h1>
            <p className="auth-form-subtitle">
              Unleash a smarter, bolder, and more luxurious shopping experience.
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

          <form onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <motion.div
              className="auth-field-group"
              custom={0}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
            >
              <label className="auth-field-label" htmlFor="signup-name">
                Full Name
              </label>
              <div className="auth-field-wrapper">
                <FiUser className="auth-field-icon" />
                <input
                  id="signup-name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  className={`auth-field-input${errors.name ? ' input-error' : ''}`}
                />
              </div>
              <AnimatePresence>
                {errors.name && (
                  <motion.p
                    className="auth-field-error"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                  >
                    <FiAlertCircle size={12} /> {errors.name}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Email */}
            <motion.div
              className="auth-field-group"
              custom={1}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
            >
              <label className="auth-field-label" htmlFor="signup-email">
                Email Address
              </label>
              <div className="auth-field-wrapper">
                <FiMail className="auth-field-icon" />
                <input
                  id="signup-email"
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
            </motion.div>

            {/* Password */}
            <motion.div
              className="auth-field-group"
              custom={2}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
            >
              <label className="auth-field-label" htmlFor="signup-password">
                Password
              </label>
              <div className="auth-field-wrapper">
                <FiLock className="auth-field-icon" />
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="new-password"
                  placeholder="Create a strong password"
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
              {/* Password strength indicator */}
              <AnimatePresence>
                {form.password && (
                  <motion.div
                    className="pw-strength-wrapper"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="pw-strength-bars">
                      {[1, 2, 3].map((bar) => (
                        <div
                          key={bar}
                          className={`pw-strength-bar ${
                            strength.level >= bar
                              ? `active-${strength.key}`
                              : ''
                          }`}
                        />
                      ))}
                    </div>
                    <span className={`pw-strength-label ${strength.key}`}>
                      {strength.label}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
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
            </motion.div>

            {/* Confirm Password */}
            <motion.div
              className="auth-field-group"
              custom={3}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
            >
              <label className="auth-field-label" htmlFor="signup-confirm">
                Confirm Password
              </label>
              <div className="auth-field-wrapper">
                <FiLock className="auth-field-icon" />
                <input
                  id="signup-confirm"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={`auth-field-input${errors.confirmPassword ? ' input-error' : ''}`}
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  className="auth-pw-toggle"
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                </button>
              </div>
              {/* Passwords match indicator */}
              <AnimatePresence>
                {form.confirmPassword && form.password === form.confirmPassword && !errors.confirmPassword && (
                  <motion.p
                    style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.775rem', color: 'var(--success)', marginTop: '0.35rem' }}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                  >
                    <FiCheck size={12} /> Passwords match
                  </motion.p>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {errors.confirmPassword && (
                  <motion.p
                    className="auth-field-error"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                  >
                    <FiAlertCircle size={12} /> {errors.confirmPassword}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Terms Checkbox */}
            <motion.div
              custom={4}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="auth-checkbox-row">
                <input
                  id="signup-terms"
                  type="checkbox"
                  name="terms"
                  checked={form.terms}
                  onChange={handleChange}
                  className="auth-checkbox"
                />
                <label htmlFor="signup-terms" className="auth-checkbox-label">
                  I agree to LuxeMart&apos;s{' '}
                  <a
                    href="#terms"
                    onClick={(e) => { e.preventDefault(); toast('Terms & Conditions coming soon!'); }}
                  >
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a
                    href="#privacy"
                    onClick={(e) => { e.preventDefault(); toast('Privacy Policy coming soon!'); }}
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>
              <AnimatePresence>
                {errors.terms && (
                  <motion.p
                    className="auth-field-error"
                    style={{ marginTop: '-0.5rem', marginBottom: '0.75rem' }}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                  >
                    <FiAlertCircle size={12} /> {errors.terms}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Submit */}
            <motion.button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              custom={5}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
            >
              {loading ? (
                <>
                  <span className="auth-spinner" />
                  Creating Account…
                </>
              ) : (
                <>
                  Create Account
                  <FiArrowRight size={17} />
                </>
              )}
            </motion.button>
          </form>

          {/* Bottom link */}
          <p className="auth-bottom-link" style={{ marginTop: '1.25rem' }}>
            Already have an account?
            <Link to="/login">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

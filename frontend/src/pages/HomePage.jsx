import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getFeaturedProducts, getTrendingProducts } from '../services/api';
import ProductCard from '../components/ui/ProductCard';
import { ProductGridSkeleton } from '../components/ui/Skeleton';
import { FiArrowRight, FiShoppingBag, FiStar, FiShield, FiTruck, FiRefreshCw, FiHeadphones, FiSmartphone, FiHome, FiActivity, FiZap } from 'react-icons/fi';
import './HomePage.css';

const CATEGORIES = [
  { name: 'Electronics', icon: FiSmartphone, desc: 'Cutting-edge tech', color: '#7C3AED', path: '/products?category=Electronics' },
  { name: 'Fashion', icon: FiShoppingBag, desc: 'Luxury apparel', color: '#DB2777', path: '/products?category=Fashion' },
  { name: 'Beauty', icon: FiStar, desc: 'Premium skincare', color: '#F59E0B', path: '/products?category=Beauty' },
  { name: 'Home', icon: FiHome, desc: 'Modern living', color: '#10B981', path: '/products?category=Home' },
  { name: 'Sports', icon: FiActivity, desc: 'Performance gear', color: '#3B82F6', path: '/products?category=Sports' },
];

const FEATURES = [
  { icon: FiTruck, title: 'Free Shipping', desc: 'On orders over $99' },
  { icon: FiShield, title: 'Secure Payment', desc: '256-bit SSL encryption' },
  { icon: FiRefreshCw, title: 'Easy Returns', desc: '30-day return policy' },
  { icon: FiHeadphones, title: '24/7 Support', desc: 'Always here for you' },
];

const PROMOS = [
  { label: 'Flash Sale', title: 'Up to 40% Off Electronics', sub: 'Limited time — ends Sunday midnight', cta: 'Grab the Deal', path: '/products?category=Electronics', color: 'var(--grad-primary)' },
  { label: 'New Season', title: 'Luxury Fashion Arrivals', sub: 'The latest collections from top brands', cta: 'Explore Fashion', path: '/products?category=Fashion', color: 'linear-gradient(135deg, #DB2777, #F59E0B)' },
];

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [f, t] = await Promise.all([getFeaturedProducts(), getTrendingProducts()]);
        setFeatured(f.data);
        setTrending(t.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="home page-enter">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero__bg">
          <div className="hero__orb hero__orb--1" />
          <div className="hero__orb hero__orb--2" />
          <div className="hero__orb hero__orb--3" />
          <div className="hero__grid" />
        </div>
        <div className="container hero__inner">
          <motion.div className="hero__content"
            initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="hero__eyebrow">
              <span className="hero__eyebrow-dot" />
              <FiZap className="hero__eyebrow-icon" /> New Season Arrivals — Up to 40% Off
            </div>
            <h1 className="hero__title">
              <span className="display-serif">Shop the</span><br />
              <span className="text-gradient">Future of</span><br />
              <span className="display-serif">Luxury.</span>
            </h1>
            <p className="hero__sub">
              Discover cutting-edge collections designed for those who live beyond ordinary.
              Explore luxury, innovation, and timeless style — all in one destination.
            </p>
            <div className="hero__actions">
              <Link to="/products" className="btn btn-primary btn-lg hero__btn-main">
                <FiShoppingBag /> Shop Now
                <FiArrowRight />
              </Link>
              <Link to="/products?category=Electronics" className="btn btn-outline btn-lg">
                Explore Tech
              </Link>
            </div>
            <div className="hero__stats">
              {[['50K+', 'Happy Customers'], ['5K+', 'Products'], ['4.9★', 'Avg Rating']].map(([val, label]) => (
                <div key={label} className="hero__stat">
                  <span className="hero__stat-val">{val}</span>
                  <span className="hero__stat-label">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div className="hero__visual"
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <div className="hero__card-stack">
              <div className="hero__floating-card hero__floating-card--main glass">
                <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500" alt="Featured" className="hero__card-img" onError={e => e.target.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'} />
                <div className="hero__card-info">
                  <span className="hero__card-label">🔥 Trending Now</span>
                  <span className="hero__card-name">ProSound ANC Elite</span>
                  <span className="hero__card-price">$299.99</span>
                </div>
              </div>
              <motion.div className="hero__floating-card hero__floating-card--mini glass"
                animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}>
                <FiStar style={{ color: 'var(--accent)', fontSize: '1.2rem' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>4.9 Rating</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>234 reviews</div>
                </div>
              </motion.div>
              <motion.div className="hero__floating-card hero__floating-card--badge glass"
                animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 0.5 }}>
                <FiTruck style={{ marginRight: '6px' }} /> Free Delivery
              </motion.div>
            </div>
          </motion.div>
        </div>
        <div className="hero__scroll-hint">
          <div className="hero__scroll-mouse"><div className="hero__scroll-wheel" /></div>
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="features-bar">
        <div className="container features-bar__inner">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <motion.div key={title} className="feature-item" {...fadeUp}>
              <div className="feature-item__icon"><Icon /></div>
              <div><div className="feature-item__title">{title}</div><div className="feature-item__desc">{desc}</div></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────── */}
      <section className="section categories-section">
        <div className="container">
          <motion.div className="section-header text-center" {...fadeUp}>
            <div className="section-eyebrow">Browse</div>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>Explore our curated collections across every lifestyle</p>
          </motion.div>
          <div className="categories-grid">
            {CATEGORIES.map((cat, i) => (
              <motion.div key={cat.name} {...fadeUp} transition={{ delay: i * 0.1 }}>
                <Link to={cat.path} className="category-card" style={{ '--cat-color': cat.color }}>
                  <div className="category-card__icon"><cat.icon /></div>
                  <div className="category-card__name">{cat.name}</div>
                  <div className="category-card__desc">{cat.desc}</div>
                  <div className="category-card__arrow"><FiArrowRight /></div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────── */}
      <section className="section">
        <div className="container">
          <motion.div className="section-header flex justify-between items-center" {...fadeUp}>
            <div>
              <div className="section-eyebrow">Curated</div>
              <h2 className="section-title">Featured Products</h2>
            </div>
            <Link to="/products?featured=true" className="btn btn-outline btn-sm">
              View All <FiArrowRight />
            </Link>
          </motion.div>
          {loading ? <ProductGridSkeleton count={8} /> : (
            <div className="product-grid">
              {featured.slice(0, 8).map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── Promo Banners ─────────────────────────────────── */}
      <section className="section">
        <div className="container promos-grid">
          {PROMOS.map((promo, i) => (
            <motion.div key={i} className="promo-card" style={{ '--promo-color': promo.color }} {...fadeUp} transition={{ delay: i * 0.15 }}>
              <div className="promo-card__glow" />
              <span className="promo-card__label">{promo.label}</span>
              <h3 className="promo-card__title">{promo.title}</h3>
              <p className="promo-card__sub">{promo.sub}</p>
              <Link to={promo.path} className="btn btn-primary promo-card__cta">
                {promo.cta} <FiArrowRight />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Trending ─────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <motion.div className="section-header flex justify-between items-center" {...fadeUp}>
            <div>
              <div className="section-eyebrow">Hot Right Now</div>
              <h2 className="section-title">Trending Products</h2>
            </div>
            <Link to="/products?trending=true" className="btn btn-outline btn-sm">
              See All <FiArrowRight />
            </Link>
          </motion.div>
          {loading ? <ProductGridSkeleton count={8} /> : (
            <div className="product-grid">
              {trending.slice(0, 8).map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────── */}
      <section className="section cta-section">
        <div className="container">
          <motion.div className="cta-banner glass" {...fadeUp}>
            <div className="cta-banner__orb" />
            <div className="cta-banner__content">
              <h2 className="cta-banner__title display-serif">Join 50,000+ Luxury Shoppers</h2>
              <p className="cta-banner__sub">Create a free account to unlock exclusive deals, track orders, and enjoy a personalized shopping experience.</p>
              <div className="hero__actions" style={{ justifyContent: 'center' }}>
                <Link to="/signup" className="btn btn-primary btn-lg">Get Started Free</Link>
                <Link to="/products" className="btn btn-outline btn-lg">Browse Products</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

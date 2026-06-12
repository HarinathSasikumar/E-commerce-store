import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import {
  FiShoppingCart, FiSearch, FiUser, FiMenu, FiX,
  FiLogOut, FiPackage, FiChevronDown, FiZap
} from 'react-icons/fi';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Products', path: '/products' },
  {
    label: 'Categories', path: '#',
    sub: [
      { label: 'Electronics', path: '/products?category=Electronics' },
      { label: 'Fashion', path: '/products?category=Fashion' },
      { label: 'Beauty', path: '/products?category=Beauty' },
      { label: 'Home', path: '/products?category=Home' },
      { label: 'Sports', path: '/products?category=Sports' },
    ]
  },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [userDropOpen, setUserDropOpen] = useState(false);
  const [catDropOpen, setCatDropOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setCatDropOpen(false); }, [location]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal('');
      setSearchOpen(false);
    }
  };

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <FiZap className="navbar__logo-icon" />
          <span>Luxe<strong>Mart</strong></span>
        </Link>

        {/* Desktop nav */}
        <nav className="navbar__links">
          {NAV_LINKS.map(link => (
            link.sub ? (
              <div key={link.label} className="navbar__dropdown" onMouseEnter={() => setCatDropOpen(true)} onMouseLeave={() => setCatDropOpen(false)}>
                <button className={`navbar__link ${catDropOpen ? 'navbar__link--active' : ''}`}>
                  {link.label} <FiChevronDown className={`navbar__chevron ${catDropOpen ? 'navbar__chevron--open' : ''}`} />
                </button>
                <AnimatePresence>
                  {catDropOpen && (
                    <motion.div className="navbar__submenu glass"
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}>
                      {link.sub.map(s => (
                        <Link key={s.label} to={s.path} className="navbar__submenu-item">{s.label}</Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link key={link.label} to={link.path}
                className={`navbar__link ${location.pathname === link.path ? 'navbar__link--active' : ''}`}>
                {link.label}
              </Link>
            )
          ))}
        </nav>

        {/* Actions */}
        <div className="navbar__actions">
          {/* Search */}
          <button className="navbar__icon-btn" onClick={() => setSearchOpen(s => !s)} aria-label="Search">
            <FiSearch />
          </button>

          {/* Cart */}
          <Link to="/cart" className="navbar__icon-btn navbar__cart-btn" aria-label="Cart">
            <FiShoppingCart />
            {totalItems > 0 && (
              <motion.span className="navbar__cart-badge"
                initial={{ scale: 0 }} animate={{ scale: 1 }} key={totalItems}>
                {totalItems > 99 ? '99+' : totalItems}
              </motion.span>
            )}
          </Link>

          {/* User */}
          {user ? (
            <div className="navbar__dropdown" onMouseEnter={() => setUserDropOpen(true)} onMouseLeave={() => setUserDropOpen(false)}>
              <button className="navbar__avatar-btn">
                <div className="navbar__avatar">{user.name.charAt(0).toUpperCase()}</div>
              </button>
              <AnimatePresence>
                {userDropOpen && (
                  <motion.div className="navbar__submenu navbar__submenu--right glass"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
                    <div className="navbar__submenu-header">
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                    </div>
                    <div className="divider" style={{ margin: '0.5rem 0' }} />
                    <Link to="/profile" className="navbar__submenu-item"><FiUser /> Profile</Link>
                    <Link to="/profile?tab=orders" className="navbar__submenu-item"><FiPackage /> Orders</Link>
                    <div className="divider" style={{ margin: '0.5rem 0' }} />
                    <button className="navbar__submenu-item navbar__submenu-item--danger" onClick={logout}>
                      <FiLogOut /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">Sign In</Link>
          )}

          {/* Mobile menu toggle */}
          <button className="navbar__icon-btn navbar__mobile-toggle" onClick={() => setMenuOpen(s => !s)}>
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div className="navbar__search-overlay glass"
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <form className="navbar__search-form" onSubmit={handleSearch}>
              <FiSearch className="navbar__search-icon" />
              <input ref={searchRef} type="text" value={searchVal} onChange={e => setSearchVal(e.target.value)}
                placeholder="Search products..." className="navbar__search-input" />
              <button type="submit" className="navbar__search-submit" aria-label="Submit Search">
                <FiSearch />
              </button>
              <button type="button" className="navbar__icon-btn navbar__search-close" onClick={() => setSearchOpen(false)} aria-label="Close Search">
                <FiX />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div className="navbar__mobile-menu glass"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}>
            <div className="navbar__mobile-inner">
              {NAV_LINKS.map(link => (
                link.sub ? (
                  <div key={link.label}>
                    <span className="navbar__mobile-label">{link.label}</span>
                    {link.sub.map(s => (
                      <Link key={s.label} to={s.path} className="navbar__mobile-link">{s.label}</Link>
                    ))}
                  </div>
                ) : (
                  <Link key={link.label} to={link.path} className="navbar__mobile-link">{link.label}</Link>
                )
              ))}
              <div className="divider" />
              {user ? (
                <button className="btn btn-outline w-full" onClick={logout}>Sign Out</button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <Link to="/login" className="btn btn-primary w-full">Sign In</Link>
                  <Link to="/signup" className="btn btn-outline w-full">Create Account</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

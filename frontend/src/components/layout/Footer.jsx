import { Link } from 'react-router-dom';
import { FiZap, FiInstagram, FiTwitter, FiYoutube, FiGithub, FiArrowRight } from 'react-icons/fi';
import './Footer.css';

const LINKS = {
  Shop: ['Electronics', 'Fashion', 'Beauty', 'Home', 'Sports'],
  Company: ['About Us', 'Careers', 'Press', 'Blog', 'Sustainability'],
  Support: ['Help Center', 'Returns', 'Shipping Info', 'Size Guide', 'Contact'],
};

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__glow" />
      <div className="container">
        {/* Top */}
        <div className="footer__top">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <FiZap className="footer__logo-icon" />
              <span>Luxe<strong>Mart</strong></span>
            </Link>
            <p className="footer__tagline">
              Redefining luxury shopping with premium products, <br />
              seamless experience, and unmatched quality.
            </p>
            <div className="footer__socials">
              {[FiInstagram, FiTwitter, FiYoutube, FiGithub].map((Icon, i) => (
                <a key={i} href="#" className="footer__social-btn" aria-label="social"><Icon /></a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group} className="footer__col">
              <h4 className="footer__col-title">{group}</h4>
              {items.map(item => (
                <Link key={item}
                  to={group === 'Shop' ? `/products?category=${item}` : '#'}
                  className="footer__link">
                  {item}
                </Link>
              ))}
            </div>
          ))}

          {/* Newsletter */}
          <div className="footer__col footer__newsletter">
            <h4 className="footer__col-title">Stay in the loop</h4>
            <p className="footer__newsletter-text">Get exclusive offers, new arrivals & VIP deals delivered to your inbox.</p>
            <form className="footer__newsletter-form" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" className="footer__newsletter-input" />
              <button type="submit" className="footer__newsletter-btn"><FiArrowRight /></button>
            </form>
          </div>
        </div>

        <div className="footer__divider" />

        {/* Bottom */}
        <div className="footer__bottom">
          <p className="footer__copyright">© 2024 LuxeMart. All rights reserved. Built with ❤️ for the modern shopper.</p>
          <div className="footer__legal">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(t => (
              <a key={t} href="#" className="footer__legal-link">{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

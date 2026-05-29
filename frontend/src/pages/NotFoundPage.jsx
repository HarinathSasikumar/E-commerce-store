import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiSearch } from 'react-icons/fi';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <div className="not-found__bg">
        <div className="not-found__orb not-found__orb--1" />
        <div className="not-found__orb not-found__orb--2" />
      </div>
      <div className="container not-found__inner">
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="not-found__content">
          <div className="not-found__code text-gradient">404</div>
          <h1 className="not-found__title display-serif">Page Not Found</h1>
          <p className="not-found__sub">
            Looks like this page went out of stock! The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="not-found__actions">
            <Link to="/" className="btn btn-primary btn-lg"><FiArrowLeft /> Back to Home</Link>
            <Link to="/products" className="btn btn-outline btn-lg"><FiSearch /> Browse Products</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheck, FiPackage, FiArrowRight, FiHome } from 'react-icons/fi';
import './OrderSuccessPage.css';

export default function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  useEffect(() => {
    if (!order) navigate('/');
  }, [order]);

  if (!order) return null;

  return (
    <div className="order-success page-enter">
      <div className="container order-success__inner">
        <motion.div className="order-success__card glass"
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, type: 'spring' }}>

          {/* Success icon */}
          <motion.div className="order-success__icon"
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}>
            <div className="order-success__check"><FiCheck /></div>
            <div className="order-success__ripple" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <h1 className="order-success__title">Order Confirmed!</h1>
            <p className="order-success__sub">Thank you for shopping with LuxeMart. Your order has been placed successfully!</p>
          </motion.div>

          {/* Order details */}
          <motion.div className="order-success__details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            <div className="order-success__detail-row">
              <span className="order-success__detail-label">Order ID</span>
              <span className="order-success__detail-val">#{order._id?.slice(-8).toUpperCase()}</span>
            </div>
            <div className="order-success__detail-row">
              <span className="order-success__detail-label">Total Paid</span>
              <span className="order-success__detail-val text-primary-color">${order.totalPrice?.toFixed(2)}</span>
            </div>
            <div className="order-success__detail-row">
              <span className="order-success__detail-label">Status</span>
              <span className="order-success__status">{order.status}</span>
            </div>
            <div className="order-success__detail-row">
              <span className="order-success__detail-label">Shipping To</span>
              <span className="order-success__detail-val">{order.shippingAddress?.city}, {order.shippingAddress?.country}</span>
            </div>
          </motion.div>

          {/* Progress */}
          <div className="order-success__timeline">
            {['Order Placed', 'Confirmed', 'Processing', 'Shipped', 'Delivered'].map((s, i) => (
              <div key={s} className={`order-success__timeline-step ${i <= 1 ? 'order-success__timeline-step--done' : ''}`}>
                <div className="order-success__timeline-dot">
                  {i <= 1 ? <FiCheck /> : <FiPackage />}
                </div>
                <span>{s}</span>
              </div>
            ))}
          </div>

          <div className="order-success__actions">
            <Link to="/profile?tab=orders" className="btn btn-primary btn-lg">
              <FiPackage /> Track Order
            </Link>
            <Link to="/products" className="btn btn-outline btn-lg">
              <FiHome /> Continue Shopping <FiArrowRight />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

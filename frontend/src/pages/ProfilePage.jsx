import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getMyOrders, updateProfile } from '../services/api';
import { FiUser, FiPackage, FiEdit2, FiCheck, FiCalendar, FiMapPin, FiShoppingCart } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './ProfilePage.css';

const STATUS_COLORS = { Processing: 'var(--warning)', Confirmed: 'var(--info)', Shipped: 'var(--primary-light)', Delivered: 'var(--success)', Cancelled: 'var(--danger)' };

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') || 'profile');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (tab === 'orders') {
      setOrdersLoading(true);
      getMyOrders().then(r => setOrders(r.data)).catch(() => {}).finally(() => setOrdersLoading(false));
    }
  }, [tab]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form);
      toast.success('Profile updated!');
      setEditing(false);
    } catch (e) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile page-enter">
      {/* Premium Background Orbs */}
      <div className="profile__bg-orbs">
        <div className="profile__bg-orb profile__bg-orb--1"></div>
        <div className="profile__bg-orb profile__bg-orb--2"></div>
      </div>

      <div className="container profile__inner" style={{ position: 'relative', zIndex: 1 }}>
        {/* Sidebar */}
        <div className="profile__sidebar glass">
          <div className="profile__avatar-wrap">
            <div className="profile__avatar-container">
              <div className="profile__avatar-glow"></div>
              <div className="profile__avatar">{user?.name?.charAt(0)?.toUpperCase()}</div>
            </div>
            <div>
              <div className="profile__name">{user?.name}</div>
              <div className="profile__email">{user?.email}</div>
            </div>
          </div>
          <div className="divider" />
          {[
            { id: 'profile', label: 'Profile', icon: FiUser },
            { id: 'orders', label: 'My Orders', icon: FiPackage },
          ].map(({ id, label, icon: Icon }) => (
            <button key={id} className={`profile__tab-btn ${tab === id ? 'profile__tab-btn--active' : ''}`} onClick={() => setTab(id)}>
              <Icon /> {label}
            </button>
          ))}
          <div className="divider" />
          <button className="profile__tab-btn profile__tab-btn--danger" onClick={logout}>Sign Out</button>
        </div>

        {/* Content */}
        <div className="profile__content">
          {tab === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="profile__panel glass">
              <div className="profile__panel-header" style={{ alignItems: 'flex-start' }}>
                <div>
                  <h2 className="profile__panel-title">My Profile</h2>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '0.5rem', fontWeight: '500' }}>
                    Experience premium products crafted for a bold and modern lifestyle.
                  </p>
                </div>
                <button className="btn btn-outline btn-sm" onClick={() => setEditing(e => !e)}>
                  {editing ? <><FiCheck /> Done</> : <><FiEdit2 /> Edit</>}
                </button>
              </div>
              <form onSubmit={handleSave} className="profile__form">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div className="input-with-icon profile__input-wrap">
                    <input className="form-input has-icon profile__input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} disabled={!editing} placeholder="Tell us who you are ✨" />
                    <FiUser className="input-icon" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className="input-with-icon profile__input-wrap">
                    <input className="form-input has-icon profile__input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} disabled={!editing} placeholder="Your professional email here" />
                    <FiMapPin className="input-icon" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <div className="input-with-icon profile__input-wrap">
                    <input className="form-input has-icon profile__input" value={user?.role} disabled placeholder="Your identity starts here" />
                    <FiCheck className="input-icon" />
                  </div>
                </div>
                {editing && (
                  <button type="submit" className="btn btn-primary" disabled={saving} style={{ marginTop: '0.5rem', padding: '0.9rem' }}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                )}
              </form>
            </motion.div>
          )}

          {tab === 'orders' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="profile__panel">
              <div style={{ marginBottom: '2rem' }}>
                <h2 className="profile__panel-title">My Orders</h2>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '0.5rem', fontWeight: '500' }}>
                  A premium destination where style, technology, and elegance come together.
                </p>
              </div>
              {ordersLoading ? (
                <div className="profile__orders-loading">Loading orders...</div>
              ) : orders.length === 0 ? (
                <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="profile__orders-empty">
                  <div className="profile__orders-empty-icon-wrapper">
                    <div className="profile__orders-empty-icon-glow"></div>
                    <div className="profile__orders-empty-icon"><FiPackage /></div>
                  </div>
                  <h3>Your collection is waiting</h3>
                  <p>
                    Elevate your everyday lifestyle with exclusive premium experiences. Start shopping to build your collection.
                  </p>
                  <Link to="/products" className="btn btn-primary btn-lg" style={{ padding: '0.8rem 2.5rem', fontSize: '1.05rem', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)' }}>
                    Start Shopping
                  </Link>
                </motion.div>
              ) : (
                <div className="profile__orders-list">
                  {orders.map(order => (
                    <div key={order._id} className="order-card glass">
                      <div className="order-card__header">
                        <div>
                          <div className="order-card__id">Order #{order._id.slice(-8).toUpperCase()}</div>
                          <div className="order-card__date"><FiCalendar /> {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                          <span className="order-card__status" style={{ color: STATUS_COLORS[order.status] || 'var(--text-primary)', background: `${STATUS_COLORS[order.status]}22` }}>
                            {order.status}
                          </span>
                          <span className="order-card__total">${order.totalPrice?.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="order-card__items">
                        {order.orderItems?.slice(0, 3).map((item, i) => (
                          <div key={i} className="order-card__item">
                            <img src={item.image || 'https://via.placeholder.com/40'} alt={item.name} className="order-card__item-img" onError={e => e.target.src='https://via.placeholder.com/40'} />
                            <span className="order-card__item-name">{item.name}</span>
                            <span className="order-card__item-qty">x{item.quantity}</span>
                          </div>
                        ))}
                        {order.orderItems?.length > 3 && <span className="order-card__more">+{order.orderItems.length - 3} more items</span>}
                      </div>
                      <div className="order-card__shipping"><FiMapPin /> {order.shippingAddress?.city}, {order.shippingAddress?.country}</div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

import Order from '../models/Order.js';

// @desc Create order
export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
    if (!orderItems || orderItems.length === 0) return res.status(400).json({ message: 'No order items' });
    console.log('orderItems:', orderItems);
    console.log('req.user:', req.user);
    if (!req.user) console.log('req.user is null/undefined!');
    
    const order = await Order.create({
      user: req.user._id, orderItems, shippingAddress, paymentMethod,
      itemsPrice, taxPrice, shippingPrice, totalPrice,
      isPaid: true, paidAt: new Date(),
      paymentResult: { id: `PAY_${Date.now()}`, status: 'COMPLETED', updateTime: new Date().toISOString(), email: req.user.email },
    });
    res.status(201).json(order);
  } catch (err) {
    console.error('Order creation error:', err.stack);
    res.status(500).json({ message: err.message });
  }
};

// @desc Get my orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

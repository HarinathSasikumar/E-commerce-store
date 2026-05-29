import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  avatar: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  originalPrice: { type: Number },
  images: [{ type: String }],
  category: { type: String, required: true, enum: ['Electronics', 'Fashion', 'Beauty', 'Home', 'Sports'] },
  brand: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  reviews: [reviewSchema],
  isFeatured: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  tags: [{ type: String }],
  badge: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);

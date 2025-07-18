import mongoose from 'mongoose';

const providerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: String,
  nit: { type: String, unique: true, sparse: true },
  description: String,
  categories: [String],
  location: String,
  rating: { type: Number, default: 0 },
  phone: String,
  address: String,
  city: String,
  website: String,
  reviewCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
});

export default mongoose.model('Provider', providerSchema);
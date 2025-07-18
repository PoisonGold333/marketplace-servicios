import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: Number,
  comment: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Review', reviewSchema);
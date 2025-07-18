import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
  title: String,
  description: String,
  category: String,
  price: Number,
});

export default mongoose.model('Service', serviceSchema);
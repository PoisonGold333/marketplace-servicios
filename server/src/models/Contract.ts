import mongoose from 'mongoose';

const contractSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  content: String,
  signedByProvider: { type: Boolean, default: false },
  signedByClient: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'signed', 'completed'], default: 'pending' },
});

export default mongoose.model('Contract', contractSchema);
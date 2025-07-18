import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
  dayOfWeek: Number, // 0=Domingo, 1=Lunes, ...
  startTime: String, // '09:00'
  endTime: String,   // '12:00'
});

export default mongoose.model('Availability', availabilitySchema);
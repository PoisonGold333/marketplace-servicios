import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: String,
  name: String,
  phone: String,
  role: {
    type: String,
    enum: ['user', 'provider', 'admin', 'PROVIDER', 'CLIENT'], // agrega 'PROVIDER' y 'CLIENT' si usas esos valores
    required: true
  },
  resetPasswordToken: { type: String, select: false },
  resetPasswordExpires: { type: Date, select: false },
});

export default mongoose.model('User', userSchema);
import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  provider: mongoose.Types.ObjectId;
}

const ServiceSchema: Schema = new Schema<IService>({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  categoria: { type: String, required: true },
  precio: { type: Number, required: true },
  provider: {
    type: Schema.Types.ObjectId,
    ref: 'Provider',
    required: true
  }
});

export default mongoose.model<IService>('Service', ServiceSchema);
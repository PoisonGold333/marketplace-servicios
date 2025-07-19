import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
}

const ServiceSchema: Schema = new Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  categoria: { type: String, required: true },
  precio: { type: Number, required: true }
});

export default mongoose.model<IService>('Service', ServiceSchema);
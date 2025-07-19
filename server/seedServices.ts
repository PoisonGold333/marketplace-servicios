import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from './src/models/Service';

dotenv.config();

const services = [
  { nombre: 'Servicio de Aseo', descripcion: 'Limpieza de casas y oficinas', categoria: 'Aseo', precio: 50000 },
  { nombre: 'Asesoría Legal', descripcion: 'Consultas jurídicas y trámites legales', categoria: 'Derecho', precio: 120000 },
  { nombre: 'Soporte Técnico', descripcion: 'Reparación y mantenimiento de computadoras', categoria: 'Tecnología', precio: 80000 },
  { nombre: 'Desarrollo de Software', descripcion: 'Aplicaciones web y móviles a medida', categoria: 'Desarrollo', precio: 300000 },
  { nombre: 'Corte de Cabello', descripcion: 'Cortes modernos y clásicos', categoria: 'Belleza', precio: 25000 },
  { nombre: 'Clases de Inglés', descripcion: 'Aprende inglés con profesores certificados', categoria: 'Educación', precio: 60000 },
  { nombre: 'Fotografía Profesional', descripcion: 'Sesiones fotográficas para eventos', categoria: 'Fotografía', precio: 150000 },
  { nombre: 'Diseño Gráfico', descripcion: 'Logos, banners y material publicitario', categoria: 'Diseño', precio: 90000 },
  { nombre: 'Entrenador Personal', descripcion: 'Rutinas de ejercicio personalizadas', categoria: 'Deporte', precio: 70000 },
  { nombre: 'Electricista', descripcion: 'Instalaciones y reparaciones eléctricas', categoria: 'Hogar', precio: 50000 },
  { nombre: 'Plomería', descripcion: 'Reparación de fugas y tuberías', categoria: 'Hogar', precio: 45000 },
  { nombre: 'Clases de Matemáticas', descripcion: 'Refuerzos escolares y universitarios', categoria: 'Educación', precio: 50000 },
  { nombre: 'Paseo de Mascotas', descripcion: 'Paseo y cuidado de perros', categoria: 'Mascotas', precio: 30000 },
  { nombre: 'Maquillaje Profesional', descripcion: 'Maquillaje para eventos y fiestas', categoria: 'Belleza', precio: 80000 },
  { nombre: 'Traducción de Documentos', descripcion: 'Traducción inglés-español', categoria: 'Traducción', precio: 60000 },
  { nombre: 'Clases de Música', descripcion: 'Guitarra, piano y canto', categoria: 'Educación', precio: 70000 },
  { nombre: 'Reparación de Celulares', descripcion: 'Cambio de pantallas y baterías', categoria: 'Tecnología', precio: 40000 },
  { nombre: 'Decoración de Eventos', descripcion: 'Decoración para fiestas y bodas', categoria: 'Eventos', precio: 200000 },
  { nombre: 'Terapia Psicológica', descripcion: 'Sesiones individuales y familiares', categoria: 'Salud', precio: 100000 },
  { nombre: 'Clases de Cocina', descripcion: 'Aprende recetas nacionales e internacionales', categoria: 'Educación', precio: 60000 }
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  await Service.deleteMany({});
  await Service.insertMany(services);
  console.log('Servicios insertados correctamente');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Error al insertar servicios:', err);
  mongoose.disconnect();
});
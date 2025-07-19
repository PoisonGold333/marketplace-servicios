import { Router } from 'express';
import Service from '../models/Service';

const router = Router();

// Endpoint para categorías (debe ir antes de rutas con /:id)
router.get('/categories', (req, res) => {
  const categories = [
    'Limpieza del Hogar',
    'Reparaciones',
    'Jardinería',
    'Cuidado Personal',
    'Tecnología',
    'Educación',
    'Transporte',
    'Eventos',
    'Salud y Bienestar',
    'Otros'
  ];
  res.json({ categories });
});

// Obtener todos los servicios (público)
router.get('/', async (req, res) => {
  try {
    const servicios = await Service.find();
    const data = servicios.map((s: any) => ({
      id: s._id,
      name: s.nombre,
      description: s.descripcion,
      price: s.precio,
      duration: s.duracion ?? 60,
      category: s.categoria,
      isActive: true,
      createdAt: s.createdAt ?? new Date(),
      provider: {
        id: '',
        user: {
          id: '',
          name: '',
          email: ''
        }
      }
    }));

    res.json({
      message: 'Servicios obtenidos correctamente',
      data,
      total: data.length
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener servicios', data: [], total: 0 });
  }
});

// Crear un servicio
router.post('/', async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: 'Error creando servicio' });
  }
});

// Obtener un servicio por ID
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate({
        path: 'provider',
        populate: { path: 'user', select: 'name email' }
      });
    if (!service) return res.status(404).json({ message: 'No encontrado' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo servicio' });
  }
});

// Actualizar un servicio
router.put('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) return res.status(404).json({ message: 'No encontrado' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Error actualizando servicio' });
  }
});

// Eliminar un servicio
router.delete('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: 'No encontrado' });
    res.json({ message: 'Eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error eliminando servicio' });
  }
});

export default router;

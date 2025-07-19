import { Router } from 'express';
import Service from '../models/Service';

const router = Router();

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

export default router;
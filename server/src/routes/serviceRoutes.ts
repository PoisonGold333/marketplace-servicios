import { Router } from 'express';
import Service from '../models/Service';

const router = Router();

// Endpoint público: obtener todos los servicios TAL CUAL están en la base de datos
router.get('/', async (req, res) => {
  console.log('➡️  [API] /api/services llamado');
  try {
    const servicios = await Service.find().populate('provider');
    console.log('✅ Servicios encontrados:', servicios.length);
    if (servicios.length > 0) {
      console.log('🔎 Primer servicio:', servicios[0]);
    }
    res.json({
      message: 'Servicios obtenidos correctamente',
      data: servicios,
      total: servicios.length
    });
  } catch (err) {
    console.error('❌ Error al obtener servicios:', err);
    res.status(500).json({ message: 'Error al obtener servicios', data: [], total: 0 });
  }
});

// Endpoint público: obtener todas las categorías de servicios
router.get('/categories', async (req, res) => {
  try {
    const categorias = await Service.distinct('categoria');
    res.json({ message: 'Categorías obtenidas correctamente', data: categorias });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener categorías', data: [] });
  }
});

export default router;
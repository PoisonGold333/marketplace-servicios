import { Router } from 'express';
import Availability from '../models/Availability';

const router = Router();

// Obtener toda la disponibilidad
router.get('/', async (req, res) => {
  const availability = await Availability.find().populate('provider');
  res.json(availability);
});

// Crear disponibilidad
router.post('/', async (req, res) => {
  const availability = new Availability(req.body);
  await availability.save();
  res.status(201).json(availability);
});

// Obtener disponibilidad por ID
router.get('/:id', async (req, res) => {
  const availability = await Availability.findById(req.params.id).populate('provider');
  if (!availability) return res.status(404).json({ message: 'No encontrado' });
  res.json(availability);
});

// Actualizar disponibilidad
router.put('/:id', async (req, res) => {
  const availability = await Availability.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!availability) return res.status(404).json({ message: 'No encontrado' });
  res.json(availability);
});

// Eliminar disponibilidad
router.delete('/:id', async (req, res) => {
  const availability = await Availability.findByIdAndDelete(req.params.id);
  if (!availability) return res.status(404).json({ message: 'No encontrado' });
  res.json({ message: 'Eliminado' });
});

export default router;
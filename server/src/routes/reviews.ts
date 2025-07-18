import { Router } from 'express';
import Review from '../models/Review';

const router = Router();

// Obtener todas las reviews
router.get('/', async (req, res) => {
  const reviews = await Review.find().populate('service user');
  res.json(reviews);
});

// Crear una review
router.post('/', async (req, res) => {
  const review = new Review(req.body);
  await review.save();
  res.status(201).json(review);
});

// Obtener una review por ID
router.get('/:id', async (req, res) => {
  const review = await Review.findById(req.params.id).populate('service user');
  if (!review) return res.status(404).json({ message: 'No encontrada' });
  res.json(review);
});

// Actualizar una review
router.put('/:id', async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!review) return res.status(404).json({ message: 'No encontrada' });
  res.json(review);
});

// Eliminar una review
router.delete('/:id', async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) return res.status(404).json({ message: 'No encontrada' });
  res.json({ message: 'Eliminada' });
});

export default router;
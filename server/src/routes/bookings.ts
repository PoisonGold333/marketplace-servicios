import { Router } from 'express';
import Booking from '../models/Booking';

const router = Router();

router.get('/', async (req, res) => {
  const bookings = await Booking.find().populate('user provider service');
  res.json(bookings);
});

router.post('/', async (req, res) => {
  const booking = new Booking(req.body);
  await booking.save();
  res.status(201).json(booking);
});

router.get('/:id', async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('user provider service');
  if (!booking) return res.status(404).json({ message: 'No encontrado' });
  res.json(booking);
});

router.put('/:id', async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!booking) return res.status(404).json({ message: 'No encontrado' });
  res.json(booking);
});

router.delete('/:id', async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);
  if (!booking) return res.status(404).json({ message: 'No encontrado' });
  res.json({ message: 'Eliminado' });
});

export default router;
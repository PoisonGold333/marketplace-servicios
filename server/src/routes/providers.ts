import { Router } from 'express';
import { getProviderProfile, updateProviderProfile } from '../controllers/providerController';
import { authenticateToken } from '../middleware/auth';
import Provider from '../models/Provider';

const router = Router();

// Rutas protegidas (requieren autenticación)
router.get('/profile', authenticateToken, getProviderProfile);
router.put('/profile', authenticateToken, updateProviderProfile);

router.get('/', async (req, res) => {
  const providers = await Provider.find().populate('user');
  res.json(providers);
});

router.post('/', async (req, res) => {
  const provider = new Provider(req.body);
  await provider.save();
  res.status(201).json(provider);
});

router.get('/:id', async (req, res) => {
  const provider = await Provider.findById(req.params.id).populate('user');
  if (!provider) return res.status(404).json({ message: 'No encontrado' });
  res.json(provider);
});

router.put('/:id', async (req, res) => {
  const provider = await Provider.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!provider) return res.status(404).json({ message: 'No encontrado' });
  res.json(provider);
});

router.delete('/:id', async (req, res) => {
  const provider = await Provider.findByIdAndDelete(req.params.id);
  if (!provider) return res.status(404).json({ message: 'No encontrado' });
  res.json({ message: 'Eliminado' });
});

export default router;
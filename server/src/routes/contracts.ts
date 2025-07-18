import { Router } from 'express';
import Contract from '../models/Contract';

const router = Router();

router.get('/', async (req, res) => {
  const contracts = await Contract.find().populate('booking');
  res.json(contracts);
});

router.post('/', async (req, res) => {
  const contract = new Contract(req.body);
  await contract.save();
  res.status(201).json(contract);
});

router.get('/:id', async (req, res) => {
  const contract = await Contract.findById(req.params.id).populate('booking');
  if (!contract) return res.status(404).json({ message: 'No encontrado' });
  res.json(contract);
});

router.put('/:id', async (req, res) => {
  const contract = await Contract.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!contract) return res.status(404).json({ message: 'No encontrado' });
  res.json(contract);
});

router.delete('/:id', async (req, res) => {
  const contract = await Contract.findByIdAndDelete(req.params.id);
  if (!contract) return res.status(404).json({ message: 'No encontrado' });
  res.json({ message: 'Eliminado' });
});

export default router;
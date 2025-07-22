import { Router } from 'express';
import User from '../models/User';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, async (req, res) => {

  const userId = (req.user as any)?._id;
  if (!req.user || !userId) {
    return res.status(401).json({ message: 'No autorizado' });
  }
  try {
    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ data: user });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener perfil' });
  }
});

router.put('/', authMiddleware, async (req, res) => {
  const userId = (req.user as any)?._id;
  if (!req.user || !userId) {
    return res.status(401).json({ message: 'No autorizado' });
  }
  try {
    const user = await User.findByIdAndUpdate(userId, req.body, { new: true });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Perfil actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar perfil' });
  }
});

export default router;
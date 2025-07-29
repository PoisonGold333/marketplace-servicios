import { Router, Request, Response } from 'express';
import Provider from '../models/Provider';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Obtener perfil del proveedor
router.get('/my-profile', authMiddleware, async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (!userId) return res.status(401).json({ message: 'No autorizado' });

  const provider = await Provider.findOne({ user: userId }).lean();
  if (!provider) return res.status(404).json({ message: 'Proveedor no encontrado' });

  const response = {
    ...provider,
    nombreEmpresa: provider.companyName,
    direccion: provider.address,
    telefono: provider.phone,
    descripcion: provider.description,
    ciudad: provider.city
    // nit: provider.nit // quita esta línea si no existe en tu documento
  };

  console.log('Provider response:', response); // <-- Agrega este log

  res.json(response);
});

// Actualizar perfil del proveedor
router.put('/my-profile', authMiddleware, async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (!userId) return res.status(401).json({ message: 'No autorizado' });

  const updated = await Provider.findOneAndUpdate(
    { user: userId },
    req.body,
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: 'Proveedor no encontrado' });

  res.json({ message: 'Perfil actualizado correctamente' });
});

export default router;
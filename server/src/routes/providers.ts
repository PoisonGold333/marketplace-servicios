import { Router } from 'express';
import { getProviderProfile, updateProviderProfile } from '../controllers/providerController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Rutas protegidas (requieren autenticación)
router.get('/profile', authenticateToken, getProviderProfile);
router.put('/profile', authenticateToken, updateProviderProfile);

export default router;
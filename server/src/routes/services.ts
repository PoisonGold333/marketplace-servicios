import { Router } from 'express';
import { 
  getServices, 
  getServiceById,    
  getCategories,
  createService
} from '../controllers/serviceController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Rutas públicas
router.get('/', getServices);
router.get('/categories', getCategories);
router.get('/:id', getServiceById);  

// Rutas protegidas
router.post('/', authenticateToken, createService);

export default router;

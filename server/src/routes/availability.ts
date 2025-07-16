import { Router } from 'express';
import { getAvailability, setAvailability } from '../controllers/availabilityController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/:providerId', getAvailability);
router.post('/:providerId', authenticateToken, setAvailability);

export default router;
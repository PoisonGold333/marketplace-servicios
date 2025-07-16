import { Router } from 'express';
import { createContract, getContractByBooking, signContract } from '../controllers/contractController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, createContract);
router.get('/booking/:bookingId', authenticateToken, getContractByBooking);
router.put('/:contractId/sign', authenticateToken, signContract);

export default router;
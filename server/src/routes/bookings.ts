import { Router } from 'express';
import { getAvailabilityByProviderAndDate } from '../controllers/bookingController';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Bookings endpoint' });
});

// Consulta disponibilidad de un proveedor por fecha
router.get('/:providerId/disponibilidad', getAvailabilityByProviderAndDate);

export default router;
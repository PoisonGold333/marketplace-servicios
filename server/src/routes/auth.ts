import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

// Debug route
router.get('/', (req, res) => {
  res.json({ message: 'Auth routes funcionando!' });
});

router.post('/register', register);
router.post('/login', login);

export default router;
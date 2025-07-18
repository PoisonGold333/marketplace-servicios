import { Router } from 'express';
import { login, forgotPassword, resetPassword, register } from '../controllers/authController';

const router = Router();

// Ruta de prueba (elimina en producción)
router.get('/', (req, res) => {
  res.json({ message: 'Auth routes funcionando!' });
});

// Recuperación de contraseña
router.post('/forgot-password', forgotPassword);

// Restablecimiento de contraseña
router.post('/reset-password/:token', resetPassword);

// Registro de usuario
router.post('/register', register);

// Login de usuario
router.post('/login', login);

export default router;
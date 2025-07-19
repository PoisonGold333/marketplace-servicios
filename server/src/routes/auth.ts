import express from 'express';
import passport from 'passport';
import { login, forgotPassword, resetPassword, register } from '../controllers/authController';

const router = express.Router();

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

// Rutas de autenticación con Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    // Aquí puedes generar un JWT y redirigir al frontend con el token
    // Ejemplo:
    // const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET);
    // res.redirect(`${process.env.CLIENT_URL}/login?token=${token}`);
    res.redirect(process.env.CLIENT_URL || '/');
  }
);

export default router;
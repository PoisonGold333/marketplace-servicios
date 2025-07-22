import { Request, Response } from 'express';
import User from '../models/User';
import Provider from '../models/Provider';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

// Solicitar recuperación de contraseña (versión simplificada)
export const forgotPassword = async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ error: 'Email y nueva contraseña requeridos' });
  }

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: 'Contraseña restablecida correctamente' });
};

// Restablecer contraseña
export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() }
  });

  if (!user) return res.status(400).json({ error: 'Token inválido o expirado' });

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: 'Contraseña restablecida correctamente' });
};

// Registro de usuario
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, companyName, nit, address, city, phone, website, description } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await user.save();

    // Si el usuario es proveedor, crea el documento Provider
    if (user.role === 'PROVIDER') {
      if (!companyName || !nit || !address || !city || !phone || !description) {
        return res.status(400).json({ error: 'Todos los campos de proveedor son obligatorios' });
      }
      await Provider.create({
        user: user._id,
        companyName,
        nit,
        address,
        city,
        phone,
        website,
        description
      });
    }

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// Login de usuario
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }
    if (!user.password) {
      return res.status(400).json({ error: 'El usuario no tiene contraseña establecida' });
    }
    const isMatch = await bcrypt.compare(password, user.password as string);
    if (!isMatch) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }
    // Genera un token JWT (ajusta tu secret)
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.json({
      message: 'Login exitoso',
      user,
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el login' });
  }
};
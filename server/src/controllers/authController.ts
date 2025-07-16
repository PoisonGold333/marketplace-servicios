import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    console.log('🔄 Procesando registro con datos:', req.body);
    
    const { name, email, password, role, phone } = req.body;

    // Validar datos requeridos
    if (!name || !email || !password || !role) {
      console.log('❌ Datos faltantes:', { name, email, password: !!password, role });
      return res.status(400).json({
        error: 'Todos los campos son requeridos: name, email, password, role'
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log('❌ Usuario ya existe:', email);
      return res.status(409).json({
        error: 'El usuario ya existe con este email'
      });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('✅ Contraseña encriptada');

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role as 'CLIENT' | 'PROVIDER',
        phone: phone || null
      }
    });

    console.log('✅ Usuario creado:', user.id);

    // Si es PROVIDER, crear registro de provider
    if (role === 'PROVIDER') {
      await prisma.provider.create({
        data: {
          userId: String(user.id),
          description: `Proveedor de servicios: ${name}`
        }
      });
      console.log('✅ Registro de provider creado');
    }

    // Generar JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '7d' }
    );

    console.log('✅ Token generado');

    // Respuesta sin contraseña
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone
    };

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('❌ Error en register:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    console.log('\n🔄 === PROCESANDO LOGIN ===');
    console.log('Body recibido:', req.body);
    console.log('Headers:', req.headers);
    
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('❌ Faltan datos:', { email: !!email, password: !!password });
      return res.status(400).json({
        error: 'Email y contraseña son requeridos'
      });
    }

    console.log('🔍 Buscando usuario con email:', email);

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        provider: true
      }
    });

    console.log('👤 Usuario encontrado:', user ? 'SÍ' : 'NO');
    if (user) {
      console.log('👤 Datos del usuario:', {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        hasProvider: !!user.provider
      });
    }

    if (!user) {
      console.log('❌ Usuario no encontrado:', email);
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    console.log('🔒 Verificando contraseña...');
    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    console.log('🔒 Contraseña válida:', validPassword);
    
    if (!validPassword) {
      console.log('❌ Contraseña incorrecta para:', email);
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    console.log('🎫 Generando JWT...');
    // Generar JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '7d' }
    );

    console.log('✅ JWT generado exitosamente');

    // Respuesta sin contraseña
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      provider: user.provider
    };

    console.log('✅ Enviando respuesta exitosa');
    
    res.json({
      message: 'Login exitoso',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('❌ ERROR CRÍTICO EN LOGIN:', error);
    
    // Verificar si error es una instancia de Error
    if (error instanceof Error) {
      console.error('❌ Stack trace:', error.stack);
    }
    
    res.status(500).json({
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
    });
  }
};
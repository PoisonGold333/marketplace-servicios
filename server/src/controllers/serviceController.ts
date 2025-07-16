import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/services - Obtener todos los servicios
export const getServices = async (req: Request, res: Response) => {
  try {
    console.log('📋 Obteniendo todos los servicios...');
    
    const { category, search, providerId } = req.query;
    
    // Construir filtros dinámicos
    const where: any = {
      isActive: true
    };
    
    if (category) {
      where.category = category;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }
    
    if (providerId) {
      where.providerId = providerId;
    }
    
    const services = await prisma.service.findMany({
      where,
      include: {
        provider: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`✅ Encontrados ${services.length} servicios`);
    
    res.json({
      message: 'Servicios obtenidos exitosamente',
      data: services,
      total: services.length
    });
    
  } catch (error) {
    console.error('❌ Error obteniendo servicios:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
    });
  }
};

// POST /api/services - Crear nuevo servicio (solo proveedores)
export const createService = async (req: Request, res: Response) => {
  try {
    console.log('🆕 Creando nuevo servicio...');
    console.log('Datos recibidos:', req.body);
    
    const { name, description, price, duration, category } = req.body;
    
    // Validaciones básicas
    if (!name || !price || !duration || !category) {
      return res.status(400).json({
        error: 'Campos requeridos: name, price, duration, category'
      });
    }
    
    // Por ahora crear servicios sin autenticación (para testing)
    // Usaremos el primer proveedor que exista
    const firstProvider = await prisma.provider.findFirst();
    
    if (!firstProvider) {
      return res.status(400).json({
        error: 'No hay proveedores disponibles. Crea un usuario con rol PROVIDER primero.'
      });
    }
    
    const service = await prisma.service.create({
      data: {
        name,
        description: description || '',
        price: parseFloat(price),
        duration: parseInt(duration),
        category,
        providerId: firstProvider.id
      },
      include: {
        provider: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });
    
    console.log('✅ Servicio creado:', service.id);
    
    res.status(201).json({
      message: 'Servicio creado exitosamente',
      data: service
    });
    
  } catch (error) {
    console.error('❌ Error creando servicio:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
    });
  }
};

// GET /api/services/categories - Obtener categorías disponibles
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = [
      'Limpieza del Hogar',
      'Reparaciones',
      'Jardinería',
      'Cuidado Personal',
      'Tecnología',
      'Educación',
      'Transporte',
      'Eventos',
      'Salud y Bienestar',
      'Otros'
    ];
    
    res.json({
      message: 'Categorías obtenidas exitosamente',
      data: categories
    });
    
  } catch (error) {
    console.error('❌ Error obteniendo categorías:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ✨ AGREGAR ESTE MÉTODO AL FINAL DEL ARCHIVO
// GET /api/services/:id - Obtener servicio por ID
export const getServiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    console.log('🔍 Obteniendo servicio por ID:', id);

    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        provider: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                phone: true
              }
            }
          }
        }
      }
    });

    if (!service) {
      return res.status(404).json({
        error: 'Servicio no encontrado'
      });
    }

    console.log('✅ Servicio encontrado:', service.name);

    res.json({
      message: 'Servicio obtenido exitosamente',
      data: service
    });

  } catch (error) {
    console.error('❌ Error obteniendo servicio:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
    });
  }
};
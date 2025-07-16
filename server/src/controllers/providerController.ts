/// <reference path="../types/express/index.d.ts" />
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Obtener perfil de proveedor
export const getProviderProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    console.log('📋 Obteniendo perfil del proveedor:', userId);

    const provider = await prisma.provider.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        services: {
          select: {
            id: true,
            name: true,
            category: true,
            price: true,
            isActive: true
          }
        },
        _count: {
          select: {
            services: true,
            bookings: true
          }
        }
      }
    });

    if (!provider) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    console.log('✅ Perfil obtenido exitosamente');
    
    res.json({
      message: 'Perfil obtenido exitosamente',
      data: provider
    });

  } catch (error) {
    console.error('❌ Error obteniendo perfil:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
    });
  }
};

// Actualizar perfil de proveedor
export const updateProviderProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const {
      companyName,
      nit,
      address,
      city,
      phone,
      website,
      description
    } = req.body;

    console.log('📝 Actualizando perfil empresarial:', userId);
    console.log('Datos recibidos:', req.body);

    // Verificar que el proveedor existe
    const existingProvider = await prisma.provider.findUnique({
      where: { userId }
    });

    if (!existingProvider) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    // Verificar NIT único si se proporciona y es diferente al actual
    if (nit && nit !== existingProvider.nit) {
      const nitExists = await prisma.provider.findUnique({
        where: { nit }
      });
      
      if (nitExists) {
        return res.status(400).json({ 
          error: 'El NIT ya está registrado por otro proveedor' 
        });
      }
    }

    // Preparar datos para actualización (solo campos que se enviaron)
    const updateData: any = {};
    if (companyName !== undefined) updateData.companyName = companyName;
    if (nit !== undefined) updateData.nit = nit;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (phone !== undefined) updateData.phone = phone;
    if (website !== undefined) updateData.website = website;
    if (description !== undefined) updateData.description = description;

    const updatedProvider = await prisma.provider.update({
      where: { userId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    console.log('✅ Perfil actualizado exitosamente');
    
    res.json({
      message: 'Perfil empresarial actualizado exitosamente',
      data: updatedProvider
    });

  } catch (error) {
    console.error('❌ Error actualizando perfil:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
    });
  }
};

// GET /api/providers/public/:id - Obtener perfil público de un proveedor
export const getPublicProviderProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    console.log('🔍 Obteniendo perfil público del proveedor:', id);

    const provider = await prisma.provider.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        services: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            duration: true,
            category: true
          }
        },
        _count: {
          select: {
            services: true,
            bookings: true
          }
        }
      }
    });

    if (!provider) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    // Ocultar información sensible para perfil público
    const publicProfile = {
      id: provider.id,
      companyName: provider.companyName,
      city: provider.city,
      description: provider.description,
      website: provider.website,
      rating: provider.rating,
      reviewCount: provider.reviewCount,
      isActive: provider.isActive,
      user: {
        name: provider.user.name
      },
      services: provider.services,
      stats: {
        totalServices: provider._count.services,
        totalBookings: provider._count.bookings
      }
    };

    console.log('✅ Perfil público obtenido');
    
    res.json({
      message: 'Perfil público obtenido exitosamente',
      data: publicProfile
    });

  } catch (error) {
    console.error('❌ Error obteniendo perfil público:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
    });
  }
};
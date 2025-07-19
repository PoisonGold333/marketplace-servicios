/// <reference path="../types/express/index.d.ts" />
import { Request, Response } from 'express';
import Provider from '../models/Provider';
import Service from '../models/Service';
import User from '../models/User';

// Obtener perfil de proveedor (privado)
export const getProviderProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autorizado' });
    }
    const userId = (req.user as any).id;

    const provider = await Provider.findOne({ user: userId })
      .populate({
        path: 'user',
        select: 'id name email phone'
      });

    if (!provider) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    const services = await Service.find({ provider: provider._id });
    const totalServices = services.length;

    res.json({
      message: 'Perfil obtenido exitosamente',
      data: {
        ...provider.toObject(),
        services,
        stats: {
          totalServices
        }
      }
    });

  } catch (error: any) {
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
    if (!req.user) {
      return res.status(401).json({ message: 'No autorizado' });
    }
    const userId = (req.user as any).id;
    const {
      companyName,
      nit,
      address,
      city,
      phone,
      website,
      description
    } = req.body;

    const existingProvider = await Provider.findOne({ user: userId });

    if (!existingProvider) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    // Verificar NIT único si se proporciona y es diferente al actual
    if (nit && nit !== existingProvider.nit) {
      const nitExists = await Provider.findOne({ nit });
      if (nitExists) {
        return res.status(400).json({
          error: 'El NIT ya está registrado por otro proveedor'
        });
      }
    }

    // Actualizar campos solo si existen en el body
    if (companyName !== undefined) existingProvider.companyName = companyName;
    if (nit !== undefined) existingProvider.nit = nit;
    if (address !== undefined) existingProvider.address = address;
    if (city !== undefined) existingProvider.city = city;
    if (phone !== undefined) existingProvider.phone = phone;
    if (website !== undefined) existingProvider.website = website;
    if (description !== undefined) existingProvider.description = description;

    await existingProvider.save();

    // Actualizar también el teléfono en el usuario si se envía
    if (phone !== undefined) {
      await User.findByIdAndUpdate(userId, { phone });
    }

    res.json({
      message: 'Perfil empresarial actualizado exitosamente',
      data: existingProvider
    });

  } catch (error: any) {
    console.error('❌ Error actualizando perfil:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
    });
  }
};

// Obtener perfil público de un proveedor
export const getPublicProviderProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const provider = await Provider.findById(id)
      .populate({
        path: 'user',
        select: 'name email'
      });

    if (!provider) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    // Obtener servicios activos
    const services = await Service.find({ provider: provider._id, isActive: true });

    // Manejar posibles undefined en provider.user
    const userName = (provider.user && typeof provider.user === 'object' && 'name' in provider.user)
      ? (provider.user as any).name
      : undefined;

    const publicProfile = {
      id: provider._id,
      companyName: provider.companyName,
      city: provider.city,
      description: provider.description,
      website: provider.website,
      rating: provider.rating,
      reviewCount: provider.reviewCount,
      isActive: provider.isActive,
      user: {
        name: userName
      },
      services,
      stats: {
        totalServices: services.length,
        // totalBookings: bookingsCount
      }
    };

    res.json({
      message: 'Perfil público obtenido exitosamente',
      data: publicProfile
    });

  } catch (error: any) {
    console.error('❌ Error obteniendo perfil público:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
    });
  }
};
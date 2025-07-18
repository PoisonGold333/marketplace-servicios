import { Request, Response } from 'express';
import Service from '../models/Service';
import Provider from '../models/Provider';

// GET /api/services - Obtener todos los servicios
export const getServices = async (req: Request, res: Response) => {
  try {
    console.log('📋 Obteniendo todos los servicios...');

    const { category, search, providerId } = req.query;

    // Construir filtros dinámicos
    const filter: any = { isActive: true };

    if (category) filter.category = category;
    if (providerId) filter.provider = providerId;

    if (search) {
      filter.$or = [
        { title: { $regex: search as string, $options: 'i' } },
        { description: { $regex: search as string, $options: 'i' } }
      ];
    }

    const services = await Service.find(filter)
      .populate({
        path: 'provider',
        populate: { path: 'user', select: 'id name email' }
      })
      .sort({ createdAt: -1 });

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

    const { title, description, price, category, providerId } = req.body;

    // Validaciones básicas
    if (!title || !price || !category || !providerId) {
      return res.status(400).json({
        error: 'Campos requeridos: title, price, category, providerId'
      });
    }

    // Verifica que el proveedor exista
    const provider = await Provider.findById(providerId).populate('user');
    if (!provider) {
      return res.status(400).json({
        error: 'Proveedor no encontrado. Crea un usuario con rol PROVIDER primero.'
      });
    }

    const service = new Service({
      title,
      description: description || '',
      price: parseFloat(price),
      category,
      provider: provider._id
    });

    await service.save();

    // Vuelve a buscar el servicio para hacer populate
    const servicePopulated = await Service.findById(service._id)
      .populate({
        path: 'provider',
        populate: { path: 'user', select: 'id name email' }
      });

    console.log('✅ Servicio creado:', service._id);

    res.status(201).json({
      message: 'Servicio creado exitosamente',
      data: servicePopulated
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

// GET /api/services/:id - Obtener servicio por ID
export const getServiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    console.log('🔍 Obteniendo servicio por ID:', id);

    const service = await Service.findById(id)
      .populate({
        path: 'provider',
        populate: { path: 'user', select: 'name email phone' }
      });

    if (!service) {
      return res.status(404).json({
        error: 'Servicio no encontrado'
      });
    }

    console.log('✅ Servicio encontrado:', service.title);

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
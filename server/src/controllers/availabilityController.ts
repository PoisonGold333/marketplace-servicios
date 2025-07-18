import { Request, Response } from 'express';
import Availability from '../models/Availability';

// Obtener disponibilidad del proveedor
export const getAvailability = async (req: Request, res: Response) => {
  try {
    const providerId = req.params.providerId;
    const availability = await Availability.find({ provider: providerId });
    res.json({ data: availability });
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo disponibilidad' });
  }
};

// Guardar/actualizar disponibilidad
export const setAvailability = async (req: Request, res: Response) => {
  try {
    const providerId = req.params.providerId;
    const { slots } = req.body; // [{dayOfWeek, startTime, endTime}, ...]

    // Borra la anterior
    await Availability.deleteMany({ provider: providerId });

    // Crea la nueva
    const newSlots = slots.map((slot: any) => ({ ...slot, provider: providerId }));
    await Availability.insertMany(newSlots);

    res.json({ message: 'Disponibilidad actualizada' });
  } catch (error) {
    res.status(500).json({ error: 'Error actualizando disponibilidad' });
  }
};
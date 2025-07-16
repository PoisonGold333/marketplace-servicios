import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Obtener disponibilidad del proveedor
export const getAvailability = async (req: Request, res: Response) => {
  const providerId = req.params.providerId;
  const availability = await prisma.availability.findMany({ where: { providerId } });
  res.json({ data: availability });
};

// Guardar/actualizar disponibilidad
export const setAvailability = async (req: Request, res: Response) => {
  const providerId = req.params.providerId;
  const { slots } = req.body; // [{dayOfWeek, startTime, endTime}, ...]
  // Borra la anterior
  await prisma.availability.deleteMany({ where: { providerId } });
  // Crea la nueva
  await prisma.availability.createMany({
    data: slots.map((slot: any) => ({ ...slot, providerId }))
  });
  res.json({ message: 'Disponibilidad actualizada' });
};
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Consulta disponibilidad de un proveedor por fecha
export const getAvailabilityByProviderAndDate = async (req: Request, res: Response) => {
  const { providerId } = req.params;
  const { date } = req.query; // date en formato 'YYYY-MM-DD'

  if (!providerId || !date) {
    return res.status(400).json({ error: 'providerId y date son requeridos' });
  }

  // Cálculo correcto del día de la semana (local, no UTC)
  const [year, month, day] = (date as string).split('-').map(Number);
  const localDate = new Date(year, month - 1, day);
  const dayOfWeek = localDate.getDay(); // 0=Domingo, 1=Lunes, ..., 6=Sábado

  console.log('🟢 providerId recibido:', providerId);
  console.log('🟢 dayOfWeek calculado:', dayOfWeek);

  const slots = await prisma.availability.findMany({
    where: {
      providerId,
      dayOfWeek,
    },
  });
  console.log('Consulta disponibilidad:', { providerId, dayOfWeek, slots });

  res.json({ data: slots });
};
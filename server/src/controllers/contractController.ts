import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Crear contrato
export const createContract = async (req: Request, res: Response) => {
  const { bookingId, clientId, providerId, terms, conditions, totalAmount } = req.body;
  const contract = await prisma.contract.create({
    data: { bookingId, clientId, providerId, terms, conditions, totalAmount }
  });
  res.json({ message: 'Contrato creado', data: contract });
};

// Obtener contrato por bookingId
export const getContractByBooking = async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const contract = await prisma.contract.findFirst({ where: { bookingId } });
  res.json({ data: contract });
};

// Firmar contrato (cliente o proveedor)
export const signContract = async (req: Request, res: Response) => {
  const { contractId } = req.params;
  const { role } = req.body; // 'client' o 'provider'
  let data: any = {};
  if (role === 'client') {
    data = { clientSigned: true, clientSignedAt: new Date(), status: 'SIGNED' };
  } else if (role === 'provider') {
    data = { providerSigned: true, providerSignedAt: new Date(), status: 'SIGNED' };
  }
  const contract = await prisma.contract.update({
    where: { id: contractId },
    data
  });
  res.json({ message: 'Contrato firmado', data: contract });
};
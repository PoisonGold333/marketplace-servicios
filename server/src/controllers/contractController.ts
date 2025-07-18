import { Request, Response } from 'express';
import Contract from '../models/Contract';

// Crear contrato
export const createContract = async (req: Request, res: Response) => {
  try {
    const { booking, terms, conditions, totalAmount } = req.body;
    const contract = new Contract({
      booking,
      terms,
      conditions,
      totalAmount,
      status: 'pending',
      signedByProvider: false,
      signedByClient: false
    });
    await contract.save();
    res.json({ message: 'Contrato creado', data: contract });
  } catch (error) {
    res.status(500).json({ error: 'Error creando contrato' });
  }
};

// Obtener contrato por bookingId
export const getContractByBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const contract = await Contract.findOne({ booking: bookingId });
    res.json({ data: contract });
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo contrato' });
  }
};

// Firmar contrato (cliente o proveedor)
export const signContract = async (req: Request, res: Response) => {
  try {
    const { contractId } = req.params;
    const { role } = req.body; // 'client' o 'provider'
    let update: any = {};
    if (role === 'client') {
      update = { signedByClient: true, status: 'signed' };
    } else if (role === 'provider') {
      update = { signedByProvider: true, status: 'signed' };
    }
    const contract = await Contract.findByIdAndUpdate(contractId, update, { new: true });
    res.json({ message: 'Contrato firmado', data: contract });
  } catch (error) {
    res.status(500).json({ error: 'Error firmando contrato' });
  }
};
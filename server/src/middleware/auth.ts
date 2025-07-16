import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  console.log('🔑 Header de autorización:', authHeader);
  console.log('🎫 Token extraído:', token);

  if (!token) {
    console.log('❌ No se proporcionó token');
    return res.status(401).json({ error: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    console.log('✅ Token decodificado:', decoded);
    
    req.userId = decoded.userId;
    console.log('✅ UserId asignado a request:', req.userId);
    
    next();
  } catch (error) {
    console.log('❌ Error verificando token:', error);
    return res.status(401).json({ error: 'Token inválido' });
  }
};
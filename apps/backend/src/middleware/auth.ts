import express, { Request, Response, NextFunction } from 'express';  // Import types
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export const authenticateToken = async (
  req: Request,  // Now typed correctly
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'] as string;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    req.user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!req.user) return res.status(401).json({ error: 'Invalid token' });
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

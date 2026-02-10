import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient, Prisma } from '@prisma/client';
import { z } from 'zod';
import { authenticateToken } from '../../middleware/auth.js'; 

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

router.get('/me', async (req, res) => {
  // Protected by authenticateToken middleware
  console.log('User:', req.user);
  res.json(req.user);
});



export default router;
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { PrismaClient, Prisma } from '@prisma/client';
import { z } from 'zod';
import { authenticateToken } from '../../middleware/auth.js'; 

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/documents/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },  // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/', 'application/pdf'];
    if (allowedTypes.some(type => file.mimetype.startsWith(type))) {
      cb(null, true);  // Accept
    } else {
      cb(new Error('Only images/PDFs allowed'));  // Reject with error (no boolean)
    }
  }
});

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// Protected CRUD
// Search Document 
router.get('/', authenticateToken, async (req, res) => {
  const { q, topic, category, type, page = 1, limit = 10 } = req.query;
  const userId = req.user!.id;
  const documents = await prisma.document.findMany({
    where: {
      createdBy: userId,
      OR: q ? [{ title: { contains: q as string } }, { topic: { contains: q as string } }] : {},
      topic, category, type
    },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
    orderBy: { createdAt: 'desc' }
  });
  res.json(documents);
});

// Create Document 
router.post('/', authenticateToken, upload.single('file'), async (req, res) => {
  // Save file to storage (MinIO/S3 impl later), get fileKey
  const fileKey = 'docs/' + req.file?.filename;
  const doc = await prisma.document.create({
    data: { ...req.body, fileKey, createdBy: req.user!.id }
  });
  res.json(doc);
});

// Share Document 
router.post('/:id/share', authenticateToken, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, message } = req.body;
  
  const doc = await prisma.document.findFirst({
    where: { id: Number(id), createdBy: req.user!.id }
  });
  if (!doc) return res.status(404).json({ error: 'Document not found' });

  // Email service (SMTP/SendGrid stub)
  await sendShareEmail({
    to: email,
    subject: `Document: ${doc.title}`,
    html: `
      <p>${message || 'Sharing document'}</p>
      <a href="${doc.fileUrl || 'http://localhost:3001/uploads/' + doc.fileKey}">Download</a>
    `
  });

  // Audit log
  await prisma.auditEvent.create({
    data: {
      userId: req.user!.id,
      entityType: 'DOCUMENT',
      entityId: id,
      action: 'SHARE',
      metadata: { to: email }
    }
  });

  res.json({ message: 'Shared successfully' });
});




export default router;
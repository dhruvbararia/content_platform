import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { fileURLToPath } from 'url';
import authRouter from './routes/auth.js';
import protectedRoutesRouter from './routes/protected/protectedRoutes.js'
import documentsRouter from './routes/protected/documents.js'
import { authenticateToken } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', authRouter);

// Protected test route
app.use('/api/protected', authenticateToken, protectedRoutesRouter);

app.use('/api/documents', authenticateToken, documentsRouter);

// Health
app.get('/health', async (req: express.Request, res: express.Response) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ status: 'ok' });
});

// Frontend static (production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
  });
}

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend: http://localhost:${PORT}/health`);
});

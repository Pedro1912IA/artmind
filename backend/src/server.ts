import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { router as artRouter } from './routes/art';
import { router as testRouter } from './routes/test';

const app = express();
const port = process.env.PORT || 3001;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Middleware
app.use(cors({
  origin: ['https://main.d3cwtmj2n19m0s.amplifyapp.com', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Disposition'],
  credentials: true
}));
app.use(express.json());

// Servir archivos estáticos con headers apropiados para descarga
app.use('/uploads', express.static('uploads', {
  setHeaders: (res, path) => {
    res.setHeader('Content-Disposition', 'attachment');
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
}));
app.use('/generated', express.static('uploads/generated', {
  setHeaders: (res, path) => {
    res.setHeader('Content-Disposition', 'attachment');
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
}));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Art Mind API',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      api: '/api',
      test: '/test',
      health: '/health'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.use('/api', artRouter);
app.use('/test', testRouter);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Aumentar el timeout del servidor para operaciones largas como generación de imágenes
// 5 minutos (300000ms) para permitir la generación de múltiples imágenes
server.timeout = 300000;
server.keepAliveTimeout = 310000; // Debe ser mayor que timeout

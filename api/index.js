import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB } from './db.js';
import apiRouter from './routes/api.js';

dotenv.config();

const app = express();

// Initialize CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), database: 'turso' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), database: 'turso' });
});

// Mount API router on both /api and / so it works seamlessly under Vercel rewrites or direct proxy
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.stack || err);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

// Auto initialize DB
initDB().catch(console.error);

// If run standalone (local development)
const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Kisan Sahayak API] Running locally on port ${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`[Server Error]: Port ${PORT} is already in use.`);
    } else {
      console.error('[Server Error]:', err);
    }
  });
}

export default app;

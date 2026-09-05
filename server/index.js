import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB } from './db.js';
import apiRouter from './routes/api.js';

dotenv.config();

// Initialize SQLite database and seed 9 schemes
initDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Mount API routes
app.use('/api', apiRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.stack || err);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

const server = app.listen(PORT, () => {
  console.log(`[Kisan Sahayak Backend] Running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[Server Error]: Port ${PORT} is already in use. Please terminate existing process.`);
  } else {
    console.error('[Server Error]:', err);
  }
});


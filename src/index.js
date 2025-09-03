import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';
import projectsRouter from './routes/projects.js';
import cvRouter from './routes/cv.js';
import metadataRouter from './routes/metadata.js';
import uploadsRouter from './routes/uploads.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({ 
  origin: true, 
  allowedHeaders: ['Content-Type', 'x-cv-password', 'x-project-password'] 
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (_req, res) => res.json({ ok: true }));

// API Routes
app.use('/projects', projectsRouter);
app.use('/cv', cvRouter);
app.use('/meta', metadataRouter);

// File uploads
app.use('/uploads', express.static(path.join(__dirname,"..", 'uploads')));
app.use('/upload', uploadsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Only start the server if not in a serverless environment
const isServerless = process.env.VERCEL === '1';

if (!isServerless) {
  const PORT = process.env.PORT || 4000;
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error('MONGODB_URI environment variable is required');
    process.exit(1);
  }

  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('MongoDB connected');
      app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    })
    .catch(err => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    });
}

// Export the Express app for serverless environments
export default app;
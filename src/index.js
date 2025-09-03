import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';
import projectsRouter from './routes/projects.js';
import cvRouter from './routes/cv.js';
import metadataRouter from './routes/metadata.js';
import uploadsRouter from './routes/uploads.js';
import path from 'path';

const app = express();
app.use(cors({ origin: true, allowedHeaders: ['Content-Type', 'x-cv-password', 'x-project-password'] })); // adjust origin if needed
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/projects', projectsRouter);
app.use('/cv', cvRouter);
app.use('/meta', metadataRouter);
// Serve uploaded files statically
const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');
app.use('/uploads', express.static(UPLOAD_DIR));
// Upload endpoints
app.use('/upload', uploadsRouter);

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
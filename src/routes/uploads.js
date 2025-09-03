import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.bin';
    const base = path.basename(file.originalname, ext).replace(/[^a-z0-9-_]/gi, '_');
    const unique = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    cb(null, `${base}_${unique}${ext}`);
  }
});

const upload = multer({ storage });

router.post('/image', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  // Public URL served by express static at /uploads
  const publicUrl = `/uploads/${req.file.filename}`;
  res.json({ url: publicUrl, filename: req.file.filename });
});

export default router;

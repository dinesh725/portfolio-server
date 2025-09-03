import { Router } from 'express';
import multer from 'multer';
import CV from '../models/CV.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 7 * 1024 * 1024 } });
const router = Router();

// GET /cv -> returns the latest CV file
router.get('/', async (_req, res) => {
  const cv = await CV.findOne({}, {}, { sort: { createdAt: -1 } });
  if (!cv) return res.status(404).json({ error: 'No CV uploaded yet' });
  res.setHeader('Content-Type', cv.contentType);
  res.setHeader('Content-Disposition', `attachment; filename="${cv.filename}"`);
  return res.send(cv.data);
});

// POST /cv -> upload/replace CV (protected by password)
router.post('/', upload.single('file'), async (req, res) => {
  const pwd = req.header('x-cv-password') || req.body.password;
  if (!pwd || pwd !== process.env.CV_UPLOAD_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!req.file) return res.status(400).json({ error: 'File is required' });

  // Remove old docs to keep only the latest
  await CV.deleteMany({});

  const doc = await CV.create({
    filename: req.file.originalname,
    contentType: req.file.mimetype,
    data: req.file.buffer,
  });
  return res.status(201).json({ ok: true, id: String(doc._id) });
});

export default router;

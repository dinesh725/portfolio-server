import { Router } from 'express';
import Project from '../models/Project.js';

const router = Router();

// GET /projects
router.get('/', async (_req, res) => {
  const items = await Project.find().sort({ createdAt: -1 });
  res.json(items.map(it => ({ ...it.toObject(), id: String(it._id) })));
});

// POST /projects (protected)
router.post('/', async (req, res) => {
  if (!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' });
  const body = normalize(req.body);
  const doc = await Project.create(body);
  res.status(201).json({ ...doc.toObject(), id: String(doc._id) });
});

// PUT /projects/:id (protected)
router.put('/:id', async (req, res) => {
  if (!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' });
  const { id } = req.params;
  const body = normalize(req.body);
  const doc = await Project.findByIdAndUpdate(id, body, { new: true });
  if (!doc) return res.status(404).json({ error: 'Not found' });
  res.json({ ...doc.toObject(), id: String(doc._id) });
});

// DELETE /projects/:id (protected)
router.delete('/:id', async (req, res) => {
  if (!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' });
  const { id } = req.params;
  const doc = await Project.findByIdAndDelete(id);
  if (!doc) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true, id });
});

function isAuthorized(req) {
  const pwd = req.header('x-project-password') || req.body?.password;
  return !!pwd && pwd === process.env.PROJECT_PASSWORD;
}

function normalize(p) {
  // Ensure arrays are arrays (when a comma-separated string comes from a form)
  return {
    ...p,
    technologies: toArray(p.technologies),
    features: toArray(p.features),
  };
}
function toArray(v) {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') return v.split(',').map(s => s.trim()).filter(Boolean);
  return [];
}

export default router;
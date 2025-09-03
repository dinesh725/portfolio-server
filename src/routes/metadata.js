import express from 'express';
const router = express.Router();

// Static list of supported technologies for icon mapping
// Use these exact labels to guarantee icons on the frontend
const TECHNOLOGIES = [
  'React',
  'Node',
  'JavaScript',
  'TypeScript',
  'HTML',
  'CSS',
  'Tailwind',
  'Bootstrap',
  'Express',
  'MongoDB',
];

// Keep this as /technologies because the router is mounted at /meta in index.js
router.get('/technologies', (_req, res) => {
  res.json({ items: TECHNOLOGIES });
});

export default router;

const express = require('express');
const router = express.Router();
const { db } = require('../../db/db');
const { nanoid } = require('nanoid');
const { authenticate } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/roles');

// All /api/jobs routes require authentication (as per requirement)
router.use(authenticate);

// GET /api/jobs - list (authenticated users)
router.get('/', async (req, res) => {
  await db.read();
  res.json(db.data.jobs);
});

// GET /api/jobs/:id - detail (authenticated users, details require member or admin)
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  await db.read();
  const job = db.data.jobs.find(j => j.id === id);
  if (!job) return res.status(404).json({ error: 'not found' });
  res.json(job);
});

// POST /api/jobs - admin only
router.post('/', requireRole('admin'), async (req, res) => {
  const { title, company, description, location } = req.body;
  if (!title || !company) return res.status(400).json({ error: 'title and company required' });
  const job = { id: nanoid(), title, company, description: description || '', location: location || '', applications: [] };
  await db.read();
  db.data.jobs.push(job);
  await db.write();
  res.status(201).json(job);
});

// PUT /api/jobs/:id - admin only
router.put('/:id', requireRole('admin'), async (req, res) => {
  const id = req.params.id;
  const { title, company, description, location } = req.body;
  await db.read();
  const job = db.data.jobs.find(j => j.id === id);
  if (!job) return res.status(404).json({ error: 'not found' });
  job.title = title ?? job.title;
  job.company = company ?? job.company;
  job.description = description ?? job.description;
  job.location = location ?? job.location;
  await db.write();
  res.json(job);
});

// DELETE /api/jobs/:id - admin only
router.delete('/:id', requireRole('admin'), async (req, res) => {
  const id = req.params.id;
  await db.read();
  const idx = db.data.jobs.findIndex(j => j.id === id);
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  db.data.jobs.splice(idx, 1);
  await db.write();
  res.status(204).end();
});

// POST /api/jobs/:id/apply - member only
router.post('/:id/apply', (req, res, next) => {
  // middleware to ensure member role
  if (!req.user) return res.status(401).json({ error: 'not authenticated' });
  if (req.user.role !== 'member') return res.status(403).json({ error: 'only members can apply' });
  next();
}, async (req, res) => {
  const id = req.params.id;
  const { coverLetter } = req.body;
  await db.read();
  const job = db.data.jobs.find(j => j.id === id);
  if (!job) return res.status(404).json({ error: 'not found' });
  job.applications.push({ id: nanoid(), userId: req.user.id, username: req.user.username, coverLetter: coverLetter || '', appliedAt: new Date().toISOString() });
  await db.write();
  res.status(201).json({ message: 'applied' });
});

module.exports = router;

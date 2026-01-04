const express = require('express');
const router = express.Router();
const { db } = require('../../db/db');
const { authenticate } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/roles');

// admin-only users management
router.use(authenticate);
router.use(requireRole('admin'));

// GET /api/users
router.get('/', async (req, res) => {
  await db.read();
  res.json(db.data.users.map(u => ({ id: u.id, username: u.username, role: u.role })));
});

// DELETE /api/users/:id
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  await db.read();
  const idx = db.data.users.findIndex(u => u.id === id);
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  db.data.users.splice(idx, 1);
  await db.write();
  res.status(204).end();
});

module.exports = router;

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../db/db');
const { nanoid } = require('nanoid');

const JWT_SECRET = process.env.JWT_SECRET || 'change_me_to_a_random_secret';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '1h';

// Register: default role is 'member'; creating admin requires admin token
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  await db.read();
  if (db.data.users.find(u => u.username === username)) return res.status(409).json({ error: 'username taken' });

  let assignedRole = 'member';
  if (role === 'admin') {
    // Only allow creating admin if caller has admin token
    const auth = req.headers.authorization?.split(' ')[1];
    if (!auth) return res.status(403).json({ error: 'cannot create admin without existing admin authentication' });
    try {
      const payload = jwt.verify(auth, JWT_SECRET);
      if (payload.role !== 'admin') return res.status(403).json({ error: 'only admin can create admin users' });
      assignedRole = 'admin';
    } catch (e) {
      return res.status(403).json({ error: 'invalid token' });
    }
  }

  const hash = await bcrypt.hash(password, 10);
  const user = { id: nanoid(), username, password: hash, role: assignedRole };
  db.data.users.push(user);
  await db.write();
  res.status(201).json({ id: user.id, username: user.username, role: user.role });
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  await db.read();
  const user = db.data.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: 'invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'invalid credentials' });

  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

module.exports = router;

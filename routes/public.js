const express = require('express');
const router = express.Router();
const { db, init } = require('../db/db');

// Root redirects to /jobs
router.get('/', (req, res) => {
  res.redirect('/jobs');
});

// Public job list (HTML or JSON) - accessible without authentication
router.get('/jobs', async (req, res) => {
  await db.read();
  res.json(db.data.jobs.map(j => ({ id: j.id, title: j.title, company: j.company, location: j.location })));
});

module.exports = router;

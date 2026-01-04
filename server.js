require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// DB init
const { init } = require('./db/db');

// Routes
const authRoutes = require('./routes/auth');
const publicRoutes = require('./routes/public');
const apiJobs = require('./routes/api/jobs');
const apiUsers = require('./routes/api/users');

app.use('/auth', authRoutes);
app.use('/', publicRoutes);
app.use('/api/jobs', apiJobs);
app.use('/api/users', apiUsers);

init().then(() => {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}).catch(err => {
  console.error('Failed to initialize DB', err);
  process.exit(1);
});

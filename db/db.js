const { Low, JSONFile } = require('lowdb');
const path = require('path');
const fs = require('fs');

const file = path.join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

async function init() {
  await db.read();
  db.data ||= { users: [], jobs: [] };

  // ensure an initial admin exists for convenience
  if (!db.data.users.find(u => u.username === 'admin')) {
    const bcrypt = require('bcrypt');
    const { nanoid } = require('nanoid');
    const pwHash = bcrypt.hashSync('admin123', 10);
    db.data.users.push({ id: nanoid(), username: 'admin', password: pwHash, role: 'admin' });
    await db.write();
    console.log('Created default admin user -> username: admin, password: admin123');
  }
}

module.exports = { db, init };

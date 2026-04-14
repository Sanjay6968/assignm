const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.VERCEL ? '/tmp/notes.db' : path.resolve(__dirname, 'notes.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run(
      `CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        content TEXT,
        category TEXT DEFAULT 'Uncategorized',
        is_favorite INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      (err) => {
        if (err) {
          console.error('Error creating table', err.message);
        } else {
          console.log('Notes table is ready.');
        }
      }
    );

    // Create users table
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT
      )`,
      (err) => {
        if (err) {
          console.error('Error creating users table', err.message);
        } else {
          // Seed dummy users
          const users = [
            ['monu@gmail.com', 'pass@4647'],
            ['sanjay@gmail.com', 'pass@777'],
            ['manij@gmail.com', 'pass@7878']
          ];
          users.forEach(([email, password]) => {
            db.run('INSERT OR IGNORE INTO users (email, password) VALUES (?, ?)', [email, password]);
          });
          console.log('Users table is ready and seeded.');
        }
      }
    );
  }
});

module.exports = db;

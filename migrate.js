const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'backend', 'notes.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run("ALTER TABLE notes ADD COLUMN category TEXT DEFAULT 'Uncategorized'", (err) => {
    if (err) console.log('Column category might already exist or error:', err.message);
    else console.log('Added column category');
  });

  db.run("ALTER TABLE notes ADD COLUMN is_favorite INTEGER DEFAULT 0", (err) => {
    if (err) console.log('Column is_favorite might already exist or error:', err.message);
    else console.log('Added column is_favorite');
  });

  db.close();
});

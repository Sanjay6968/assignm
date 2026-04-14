const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.get(sql, [email, password], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({
      message: 'Login successful',
      data: { id: row.id, email: row.email }
    });
  });
});

// Get all notes
app.get('/notes', (req, res) => {
  const sql = 'SELECT * FROM notes ORDER BY updated_at DESC';
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ data: rows });
  });
});
// Get note by id
app.get('/notes/:id', (req, res) => {
  const sql = 'SELECT * FROM notes WHERE id = ?';
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ data: row });
  });
});


app.post('/notes', (req, res) => {
  const { title, content, category, is_favorite } = req.body;
  const sql = 'INSERT INTO notes (title, content, category, is_favorite, created_at, updated_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)';
  const params = [title, content, category || 'Uncategorized', is_favorite || 0];
  db.run(sql, params, function (err) {
    if (err) {
      console.error('Error in POST /notes:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({
      message: 'Note created successfully',
      data: { id: this.lastID, title, content, category: category || 'Uncategorized', is_favorite: is_favorite || 0 }
    });
  });
});


app.put('/notes/:id', (req, res) => {
  const { title, content, category, is_favorite } = req.body;
  const sql = `
    UPDATE notes 
    SET title = coalesce(?, title), 
        content = coalesce(?, content), 
        category = coalesce(?, category), 
        is_favorite = coalesce(?, is_favorite), 
        updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?`;
  db.run(sql, [title, content, category, is_favorite, req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({
      message: 'Note updated successfully',
      data: { id: req.params.id, title, content, category, is_favorite }
    });
  });
});

app.delete('/notes/:id', (req, res) => {
  const sql = 'DELETE FROM notes WHERE id = ?';
  db.run(sql, [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ message: 'Note deleted successfully', changes: this.changes });
  });
});


const frontendPath = fs.existsSync(path.join(__dirname, 'public'))
  ? path.join(__dirname, 'public')
  : path.join(__dirname, '../frontend/dist');

app.use(express.static(frontendPath));


app.get('*', (req, res) => {
  const indexPath = path.join(frontendPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: 'Frontend build not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

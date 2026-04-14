import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import debounce from 'lodash.debounce';
import { format } from 'date-fns';
import { Loader2, Plus, PenLine, FileText, ChevronLeft, Save, Trash2, Check, SplitSquareHorizontal } from 'lucide-react';
import 'github-markdown-css';
import './index.css';

// Use relative path in production (since backend serves frontend), and localhost during development.
const isProd = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const API_URL = isProd ? '' : 'http://localhost:5000';

// Global mock auth state
let isAuthenticated = false;

// 1. Auth Page (Mocking the exact NotesHub login screen)
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      isAuthenticated = true;
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed', error);
      alert(error.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'white', color: '#1a1717', width: '32px', height: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '6px', fontSize: '14px' }}>
            N
          </div>
          NotesHub
        </h1>
        <div className="login-quote">
          "Capture your brilliance. Organize your world.<br />
          Build your digital second brain with confidence."
        </div>
        <div className="login-stats">
          <div className="stat-item">
            <h3>2,400+</h3>
            <p>users</p>
          </div>
          <div className="stat-item">
            <h3>15k</h3>
            <p>notes</p>
          </div>
          <div className="stat-item">
            <h3>4.9★</h3>
            <p>Rating</p>
          </div>
        </div>
      </div>
      <div className="login-right">
        <div className="login-card-container">
          <h2 className="login-title">Welcome back</h2>
          <p className="login-subtitle">Sign in to continue your writing journey</p>

          <div className="login-card">
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="alice@example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <button type="submit" className="btn-primary-brown" disabled={loading}>
                {loading ? <span className="loader" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></span> : 'Sign In'}
              </button>
            </form>

            <div className="demo-accounts">
              <h4>Demo Accounts</h4>
              <p>monu@gmail.com / pass@4647</p>
              <p>sanjay@gmail.com / pass@777</p>
              <p>manij@gmail.com / pass@7878</p>
            </div>
          </div>
          <div className="login-footer">
            Don't have an account? <a href="#">Sign up</a>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Dashboard Page (Mimicking NotesHub Dashboard)
function Dashboard() {
  const navigate = useNavigate();
  const [notes, setNotes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState('All');

  React.useEffect(() => {
    if (!isAuthenticated) {

      isAuthenticated = true;
    }
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${API_URL}/notes`);
      setNotes(response.data.data);
    } catch (error) {
      console.error('Error fetching notes', error);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async () => {
    try {
      const response = await axios.post(`${API_URL}/notes`, {
        title: 'Untitled Note',
        content: ''
      });
      navigate(`/note/${response.data.data.id}`);
    } catch (error) {
      console.error('Error creating note', error);
    }
  };

  const deleteNote = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this note?')) return;
    try {
      await axios.delete(`${API_URL}/notes/${id}`);
      setNotes(notes.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error deleting note', error);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' ? note.category !== 'Archive' :
      activeFilter === 'Favorites' ? note.is_favorite === 1 :
        note.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav className="navbar">
        <div className="nav-logo">
          <div className="nav-logo-icon">NH</div>
          NotesHub
        </div>
        <div className="nav-links">
          <span
            className={`nav-link ${activeFilter === 'All' ? 'active' : ''}`}
            onClick={() => setActiveFilter('All')}
          >
            All Notes
          </span>
          <span
            className={`nav-link ${activeFilter === 'Favorites' ? 'active' : ''}`}
            onClick={() => setActiveFilter('Favorites')}
          >
            Favorites
          </span>
        </div>
        <div className="nav-actions">
          <button onClick={() => navigate('/')}>Logout</button>
        </div>
      </nav>

      <section className="hero-section">
        <div className="promo-badge">
          PRO TIPS <span>USE MARKDOWN</span> for better formatting
        </div>
        <h1 className="hero-title">
          Write <span>anything</span> at your own pace
        </h1>
        <p className="hero-subtitle">
          Explore powerful markdown features securely backed by SQLite. Auto-saving seamlessly
          as you type so you never lose your thoughts.
        </p>
        <div className="hero-stats">
          <p><strong>{notes.length}</strong> Notes</p>
          <p><strong>100%</strong> Free</p>
        </div>
      </section>

      <main className="dashboard-content">
        <div className="dashboard-controls">
          <div className="filters">
            {['All', 'Personal', 'Work', 'Archive'].map(f => (
              <button
                key={f}
                className={`filter-btn ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px' }}>
            <span className="loader"></span>
          </div>
        ) : (
          <div className="notes-grid">
            <div className="note-card new-note-card" onClick={createNote}>
              <Plus size={40} style={{ marginBottom: '10px' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Create New Note</h3>
            </div>
            {filteredNotes.map(note => (
              <div key={note.id} className="note-card" onClick={() => navigate(`/note/${note.id}`)}>
                <div className="note-card-bg"></div>
                <div className="note-card-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'auto' }}>
                    <div className="note-category-badge">{note.category || 'Uncategorized'}</div>
                    {note.is_favorite === 1 && <div className="favorite-star">★</div>}
                  </div>
                  <div style={{ marginTop: '20px' }}>
                    <h3 className="note-card-title">{note.title || 'Untitled'}</h3>
                    <p className="note-card-excerpt">
                      {note.content?.replace(/[#*`~_\[\]()]/g, '').substring(0, 100) || 'Empty note...'}
                    </p>
                    <div className="note-card-footer">
                      <span>{note.updated_at ? format(new Date(note.updated_at), 'MMM dd, yyyy') : ''}</span>
                      <button onClick={(e) => deleteNote(note.id, e)}><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}


function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = React.useState({ title: '', content: '' });
  const [saveStatus, setSaveStatus] = React.useState('saved');

  React.useEffect(() => {
    fetchNote();
  }, [id]);

  const fetchNote = async () => {
    try {
      const response = await axios.get(`${API_URL}/notes/${id}`);
      setNote(response.data.data);
    } catch (error) {
      console.error('Error fetching note', error);
      navigate('/dashboard');
    }
  };

  const debouncedSave = React.useCallback(
    debounce(async (updatedNote) => {
      setSaveStatus('saving');
      try {

        const payload = {
          ...updatedNote,
          is_favorite: updatedNote.is_favorite ? 1 : 0
        };
        await axios.put(`${API_URL}/notes/${id}`, payload);
        setSaveStatus('saved');
      } catch (error) {
        console.error('Error saving note', error);
        setSaveStatus('error');
      }
    }, 1000),
    [id]
  );

  const handleChange = (field, value) => {
    const updatedNote = { ...note, [field]: value };
    setNote(updatedNote);
    setSaveStatus('typing');
    debouncedSave(updatedNote);
  };

  return (
    <div className="editor-page">
      <header className="editor-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button className="btn-outline" onClick={() => navigate('/dashboard')} style={{ padding: '8px' }}>
            <ChevronLeft size={20} />
          </button>
          <input
            className="editor-title-input"
            value={note.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Note Title"
          />
          <select
            className="category-select"
            value={note.category || 'Uncategorized'}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            {['Uncategorized', 'Personal', 'Work', 'Archive'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="editor-actions">
          <button
            className={`btn-favorite ${note.is_favorite === 1 ? 'active' : ''}`}
            onClick={() => handleChange('is_favorite', note.is_favorite === 1 ? 0 : 1)}
          >
            {note.is_favorite === 1 ? '★ Favorited' : '☆ Favorite'}
          </button>
          <div className="status-text">
            {saveStatus === 'typing' && 'Typing...'}
            {saveStatus === 'saving' && <><Loader2 size={14} className="animate-spin" /> Saving</>}
            {saveStatus === 'saved' && <><Check size={14} color="#10b981" /> Saved</>}
            {saveStatus === 'error' && <span style={{ color: 'red' }}>Error</span>}
          </div>
        </div>
      </header>

      <div className="workspace">
        <div className="pane pane-left">
          <div className="pane-title">
            <PenLine size={16} /> Markdown Editor
          </div>
          <textarea
            className="md-textarea"
            value={note.content}
            onChange={(e) => handleChange('content', e.target.value)}
            placeholder="# Start writing..."
          />
        </div>
        <div className="pane pane-right">
          <div className="pane-title" style={{ color: '#4b5563' }}>
            <SplitSquareHorizontal size={16} /> Live Preview
          </div>
          <div className="markdown-body">
            <ReactMarkdown>{note.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App Router
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/note/:id" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

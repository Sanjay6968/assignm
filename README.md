# NotesHub - Markdown Notes Application

NotesHub is a premium, full-stack Markdown note-taking application designed for speed, organization, and a professional user experience. Capture your brilliant ideas, organize them with categories, and mark your favorites—all in a beautiful, dark-themed interface.

## Features

- **Full Markdown Support**: Write in markdown and see a real-time live preview.
- **Smart Categorization**: Organize your thoughts into `Personal`, `Work`, or `Archive` categories.
- **Favorites**: Toggle a "Starred" status for your most important notes.
- **Live Search**: Instantly find any note by title or content.
- **Auto-Save**: Never lose your progress with seamless, real-time background saving.
- **Premium UI**: Modern dark aesthetics with glassmorphism effects and responsive design.
- **Secure Backend**: Full-stack architecture with a Node.js/Express API and SQLite storage.
- **Authenticated Access**: Secure login verification through a dedicated backend users table.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Sanjay6968/assignm.git
   cd assignm
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   ```

3. **Setup Frontend**:
   ```bash
   cd ../frontend
   npm install
   ```

### Running Locally

To run the application in development mode (split-port):

1. **Start the Backend** (Port 5000):
   ```bash
   cd backend
   node server.js
   ```

2. **Start the Frontend** (Port 5001):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open the App**:
   Navigate to [http://localhost:5001](http://localhost:5001) in your browser.

## Demo Credentials

Use any of the following accounts to sign in:

| Email | Password |
| :--- | :--- |
| `monu@gmail.com` | `pass@4647` |
| `sanjay@gmail.com` | `pass@777` |
| `manij@gmail.com` | `pass@7878` |

## Built With

- **Frontend**: React, Vite, Axios, React Markdown, Lucide React, GitHub Markdown CSS.
- **Backend**: Node.js, Express, SQLite3, CORS, Body-Parser.
- **Styling**: Vanilla CSS (Premium Custom Design).
- **Deployment**: Vercel ready.

## License

This project is for assignment purposes.

---
*Built by Sanjay*

# BYD Content Marketing AI Po

A full-stack application with React frontend and Node.js/Express backend, configured for deployment on Vercel.

## Environment Variables

### Backend (.env)
Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Required: Google Gemini API Key (for AI image generation)
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Optional: Add other environment variables as needed
# DATABASE_URL=your_database_connection_string
# JWT_SECRET=your_jwt_secret_key
```

**Important:** Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Frontend (.env)
Create a `.env` file in the `frontend/` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:4000

# For production (Vercel), this will be /api automatically
# VITE_API_URL=/api
```

**Note:** Environment variables in the frontend must be prefixed with `VITE_` to be accessible in your React components.

## Local Development

### Prerequisites
- Node.js (v16 or higher)
- npm

### Production Mode
```bash
# Build frontend and start both in production mode
npm run build
npm run start
```
- Frontend: Served via preview on a random port
- Backend: http://localhost:4000

### Running the Application

#### Option 1: Single Command (Recommended)
```bash
# Install all dependencies
npm run install:all

# Start both frontend and backend in development mode
npm run dev
```
- Frontend: http://localhost:5173
- Backend: http://localhost:4000

#### Option 2: Manual Setup
```bash
# Install dependencies for all parts
npm run install:all

# Or install individually:
cd backend && npm install
cd ../frontend && npm install

# Start services separately
npm run dev:backend  # Backend on port 4000
npm run dev:frontend # Frontend on port 5173
```

## Vercel Deployment

This project is configured for monorepo deployment on Vercel with both frontend and backend in a single project.

### Deployment Steps

1. **Connect your repository to Vercel**
   - Import your GitHub/GitLab repository on Vercel
   - Vercel will automatically detect the monorepo configuration

2. **Configure build settings (if needed)**
   - **Root Directory:** Leave empty (root of repo)
   - **Build Command:** Leave default (npm run build)
   - **Output Directory:** `frontend/dist` (configured in vercel.json)

3. **Environment Variables**
   - Add any environment variables your backend needs
   - The frontend will automatically use `/api` as the API base URL in production

### API Routes

- **Health Check:** `GET /api/health`
- All API routes are prefixed with `/api/` and handled by the backend

### Architecture

- **Frontend:** React + TypeScript + Vite (served as static files)
- **Backend:** Node.js + Express (deployed as serverless functions)
- **Routing:** API calls (`/api/*`) route to backend, everything else serves frontend

## Project Structure

```
├── backend/          # Node.js/Express server
│   ├── src/
│   │   └── index.js  # Main server file
│   └── package.json
├── frontend/         # React application
│   ├── src/
│   ├── dist/         # Build output (generated)
│   └── package.json
├── vercel.json       # Vercel configuration
└── README.md
```

## Development Notes

- The backend is configured to work as both a traditional server (for local dev) and serverless functions (for Vercel)
- Frontend API calls should use `/api` as the base URL in production
- For local development, use `http://localhost:4000` for API calls
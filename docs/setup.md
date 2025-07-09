# TasteTrip AI Project Setup Guide

This project uses a modular monorepo structure with separate frontend and backend apps.

---

## 🏗️ Project Structure
```
QlooHackathon/
├── backend/                # Node.js + Express API
│   ├── ...
│   ├── package.json        # Backend dependencies/scripts
│   └── .env                # Backend environment variables
├── frontend/               # Next.js 14 App Router frontend
│   ├── ...
│   ├── package.json        # Frontend dependencies/scripts
│   └── .env.local          # Frontend environment variables
├── docs/                   # Documentation
│   ├── ...
├── package.json            # Root (docs/scripts only, no app deps)
└── .gitignore
```

---

## 1. Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Create `.env` file:**
   - Copy from `.env.example` if present, or create manually.
   - Fill in all required keys (see below).
4. **Run the backend server:**
   ```bash
   npm run dev   # For development (nodemon)
   npm start     # For production
   ```
5. **Backend will start on port 4000 by default.**

### Backend Environment Variables
```
OPENAI_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_JWT_SECRET=
QLOO_API_KEY=
GOOGLE_MAPS_API_KEY=
```

---

## 2. Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Create `.env.local` file:**
   - Copy from `.env.local.example` if present, or create manually.
   - Fill in all required keys (see below).
4. **Run the frontend dev server:**
   ```bash
   npm run dev
   ```
5. **Frontend will start on port 3000 by default.**

### Frontend Environment Variables
```
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## 3. General Notes
- **Each app manages its own dependencies and env files.**
- **Root `package.json` is for documentation/scripts only.**
- **`.gitignore` excludes all `node_modules` and env files.**
- **See `docs/checklist.md` for integration steps and `docs/PRD.md` for architecture.**

--- 
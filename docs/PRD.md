TasteTrip AI — Product Requirement Prompt (PRP)
Project Overview
You are building TasteTrip AI, a next-gen AI-powered cultural assistant that integrates:
Qloo Taste AI API — to get cross-domain cultural recommendations based on user tastes in music, film, food, fashion, and travel.


OpenAI GPT-4 (or alternative LLM) — to interpret user inputs, generate natural language explanations, and narrate recommendations.


Retrieval-Augmented Generation (RAG) system — implemented with Supabase + pgvector, allowing the AI to remember user preferences over time by storing and retrieving vector embeddings of past inputs.


Google Maps API — to simulate booking landmarks like restaurants, concerts, and travel destinations with real-world geographic data.


Node.js + Express backend to orchestrate API calls, business logic, and RAG.


Next.js + Tailwind frontend for responsive UI with chat interface, taste input forms, recommendation cards, maps, and booking flows.



Architecture & Data Flow
Frontend (Next.js + Tailwind UI) → Backend (Node.js + Express API Server) →
Generate embeddings → OpenAI GPT-4 API


Store embeddings → Supabase with pgvector


Retrieve similar tastes → Supabase


Query recommendations → Qloo Taste AI API


Generate explanation → OpenAI GPT-4 API


Get location info → Google Maps API
→ Frontend



Technology Stack
Layer
Technology
Frontend
Next.js + TailwindCSS
Backend API
Node.js + Express
Embeddings
OpenAI text-embedding-3-small
Vector DB / Memory
Supabase (Postgres + pgvector)
Taste Recommendation
Qloo Taste AI API
Location Data
Google Maps API
LLM Reasoning
OpenAI GPT-4 API
Authentication (optional)
Supabase Auth


Proposed File / Folder Structure
/taste-trip-ai
├── /frontend
│ ├── /components
│ │ ├── ChatInput.tsx (Input box for taste or queries)
│ │ ├── RecommendationCard.tsx (Display recommendations & explanations)
│ │ ├── MapView.tsx (Google Maps integration component)
│ │ └── TasteHistory.tsx (Show past user tastes/memories)
│ ├── /pages
│ │ ├── index.tsx (Main app page)
│ │ ├── api (Next.js API routes - optional)
│ ├── styles/
│ │ └── globals.css (Tailwind base styles)
│ └── utils/
│ └── fetcher.ts (Helper for API calls)
├── /backend
│ ├── /controllers
│ │ ├── tasteController.js (Embedding create & memory store logic)
│ │ ├── recommendationController.js (Qloo + GPT recommendation logic)
│ │ ├── bookingController.js (Google Maps booking simulation)
│ ├── /routes
│ │ ├── tasteRoutes.js (Routes for taste input & retrieval)
│ │ ├── recommendationRoutes.js
│ │ ├── bookingRoutes.js
│ ├── /services
│ │ ├── openaiService.js (Wrappers for OpenAI API calls)
│ │ ├── qlooService.js (Wrappers for Qloo API calls)
│ │ ├── supabaseService.js (DB vector store operations)
│ │ ├── googleMapsService.js (Google Maps integration)
│ ├── /utils
│ │ └── vectorUtils.js (Vector search helpers like similarity)
│ ├── app.js (Express app initialization)
│ └── server.js (Server start and config)
├── README.md (Project overview, setup instructions)
├── .env (Environment variables - API keys etc.)
└── package.json (Dependencies and scripts)

Documentation & Developer Notes
Your README.md should include:
Project Overview: What TasteTrip AI does, key features


Tech Stack: List all major tech and APIs used


Setup Instructions: How to install dependencies, run frontend/backend locally


Environment Variables: What keys you need (OpenAI, Supabase, Qloo, Google Maps)


API Routes Overview:


POST /taste — Submit taste input (embedding + store)


GET /taste/similar — Query similar past tastes (RAG search)


POST /recommend — Generate recommendations & explanations


POST /booking — Simulate booking landmarks


Vector Workflow Explanation: Brief on embeddings + RAG


Future Work / Stretch Goals



Core Functional Workflows
Taste Input + Memory Store
User enters taste description


Backend creates embedding (OpenAI)


Embedding + raw input stored in Supabase vector table


Similar Taste Retrieval
User asks a question / new input


Backend creates embedding for query


Supabase vector similarity search finds closest past inputs


Past inputs added as context to GPT prompt


Recommendation Generation
Query Qloo API with user taste(s)


Use GPT-4 to generate human-friendly explanations + suggestions


Return combined cultural suggestions + explanations to frontend


Booking Simulation
Use Google Maps API to find real landmarks


Display locations + booking info on frontend



Success Criteria
Taste memory works: user tastes are stored and recalled semantically


Recommendations reflect cross-domain cultural matches from Qloo


GPT generates coherent, explainable suggestions


Maps and booking simulated with real location data


Clean, intuitive UI with Next.js + Tailwind


Code organized and documented for easy teamwork



Next Steps (Optional)
Sample API contracts (request/response payloads)


Sample prompt templates for GPT


Starter repo scaffold with Next.js + Express integration

---

## 🔒 Backend Authentication & Security (Update)

- **All backend API endpoints are now protected by Supabase JWT authentication.**
- Every request to `/api/taste`, `/api/taste/similar`, `/api/recommend`, and `/api/booking` must include a valid Supabase JWT in the `Authorization` header:
  
  ```http
  Authorization: Bearer <supabase-jwt>
  ```
- The backend verifies the JWT using the `SUPABASE_JWT_SECRET` (set in the environment variables; see setup docs).
- If the token is missing or invalid, the backend returns a 401 Unauthorized error.
- This ensures only authenticated users (via Supabase Auth) can access the API.
- **Frontend team:** Always pass the user's Supabase session access token as a Bearer token in all API requests.

---

---

## 🏗️ Project Structure (Updated)

The project is organized as a modular monorepo with clear separation between frontend and backend:

```
QlooHackathon/
├── backend/                # Node.js + Express API
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── app.js
│   ├── server.js
│   ├── package.json        # Backend dependencies/scripts
│   └── .env                # Backend environment variables
├── frontend/               # Next.js 14 App Router frontend
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── utils/
│   ├── public/
│   ├── package.json        # Frontend dependencies/scripts
│   └── .env.local          # Frontend environment variables
├── docs/                   # Documentation
│   ├── PRD.md
│   ├── backend-api.md
│   ├── frontend.md
│   ├── checklist.md
│   └── setup.md
├── package.json            # Root (docs/scripts only, no app deps)
└── .gitignore
```

---

## 🚀 Frontend Overview (Next.js)
- **Tech:** Next.js 14, TailwindCSS, React, Axios, Google Maps, Lucide React, TypeScript
- **Structure:** All frontend code and dependencies are in `frontend/`
- **Env:** Uses `frontend/.env.local` for API keys and config (see `frontend.md`)
- **API Integration:** Calls backend endpoints, passing Supabase JWT in `Authorization` header
- **See:** `docs/frontend.md` for full details

---

## 🧰 Backend Overview (Node.js/Express)
- **Tech:** Express, Supabase, OpenAI, Qloo, Google Maps, pgvector, Axios
- **Structure:** All backend code and dependencies are in `backend/`
- **Env:** Uses `backend/.env` for secrets and config
- **API:** Exposes `/api/taste`, `/api/taste/similar`, `/api/recommend`, `/api/booking` (see `backend-api.md`)
- **Auth:** All endpoints require Supabase JWT in `Authorization` header

---

## 🗂️ Dependency & Environment Management
- **Each app (frontend/backend) has its own `package.json` and installs only what it needs.**
- **Each app has its own env file:**
  - `backend/.env` for backend secrets (never exposed to frontend)
  - `frontend/.env.local` for frontend config (only `NEXT_PUBLIC_` vars exposed to browser)
- **Root `package.json` is for documentation/scripts only.**
- **`.gitignore` excludes all `node_modules` folders and env files.**

---

## 🛠️ Deployment & CI/CD
- **Frontend and backend can be deployed independently.**
- **Each can be tested, built, and run from its own directory.**
- **See `setup.md` and `checklist.md` for onboarding and integration.**

---




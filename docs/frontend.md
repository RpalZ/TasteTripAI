# TasteTrip AI Frontend Documentation

A modern, responsive frontend for TasteTrip AI — your cultural discovery assistant powered by AI taste intelligence.

---

## 🚀 Features
- Conversational chat interface for natural taste input
- AI-powered cultural recommendations (food, music, travel, etc.)
- Taste memory/history with similarity search
- Google Maps integration for location-based results
- Responsive, mobile-first design
- Real-time loading states and smooth UX

## 🛠 Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** TailwindCSS
- **State Management:** React hooks, Context API
- **HTTP Client:** Axios
- **Maps:** Google Maps Embed API
- **Icons:** Lucide React
- **TypeScript:** Full type safety

## 🏗 Project Structure
```
frontend/
├── src/
│   ├── app/                    # Next.js App Router (layout, page, globals.css)
│   ├── components/            # Reusable UI components
│   │   ├── ChatInput.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── RecommendationCard.tsx
│   │   ├── TasteHistory.tsx
│   │   └── MapView.tsx
│   └── utils/                 # Utility functions
│       ├── fetcher.ts         # API client and functions
│       └── formatTaste.ts     # Data formatting utilities
├── public/                    # Static assets
├── next.config.js/ts          # Next.js configuration
└── tailwind.config.js         # Tailwind CSS configuration
```

## 🎨 Main Components
- **ChatInput:** User input, auto-resizing, submit on Enter
- **MessageBubble:** Displays chat messages, avatars, timestamps
- **RecommendationCard:** Shows recommendations, icons, actions
- **TasteHistory:** Sidebar with past queries, re-query, filtering
- **MapView:** Google Maps embed, fullscreen, location overlays

## 🔌 API Integration
- **Endpoints:**
  - `POST /api/taste` — Submit taste input
  - `GET /api/taste/similar` — Get similar tastes
  - `POST /api/recommend` — Get recommendations
  - `POST /api/booking` — Search bookable locations
- **Auth:** All API calls include the Supabase JWT in the `Authorization` header.
- **Error Handling:** User-friendly messages and loading states for all async operations.

## ⚙️ Environment Variables
- `NEXT_PUBLIC_API_BASE_URL`: Backend API endpoint
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Google Maps API key
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL (if using auth)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key

## 📦 Setup Instructions
1. `cd frontend`
2. `npm install`
3. Copy `.env.local.example` to `.env.local` and fill in your keys
4. `npm run dev` to start the development server
5. Open [http://localhost:3000](http://localhost:3000)

## 🧪 Testing
- Run `npm test` for tests (if present)
- Use Postman/Thunderclient for manual API testing

## 📝 Notes
- See `docs/checklist.md` for integration checklist
- See `docs/backend-api.md` for backend API details
- See `README.md` in the frontend folder for more details

--- 
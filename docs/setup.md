TasteTrip AI Backend Setup Guide
===============================

1. Prerequisites
----------------
- Node.js (v18+ recommended)
- npm (comes with Node.js)
- Supabase project with pgvector extension enabled
- OpenAI, Qloo, and Google Maps API keys

2. Clone the Repository
-----------------------
- git clone <your-repo-url>
- cd QlooHackathon

3. Install Dependencies
----------------------
- npm install

4. Environment Variables
------------------------
Create a `.env` file in the `backend/` directory with the following keys:

OPENAI_API_KEY=your-openai-key
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
QLOO_API_KEY=your-qloo-key
GOOGLE_MAPS_API_KEY=your-google-maps-key

(You can copy from `backend/.env.example`)

5. Supabase Setup
-----------------
- Enable the `pgvector` extension in your Supabase project.
- Create the `user_tastes` table and the `match_user_tastes` function. Example SQL:

```
create extension if not exists vector;

create table if not exists user_tastes (
  id uuid primary key default gen_random_uuid(),
  input text,
  embedding vector(1536),
  created_at timestamptz default now()
);

create or replace function match_user_tastes(
  query_embedding vector(1536),
  match_count int,
  exclude_id uuid
)
returns table (
  id uuid,
  input text,
  embedding vector(1536),
  created_at timestamptz,
  similarity float
) language plpgsql as $$
begin
  return query
    select id, input, embedding, created_at,
      (embedding <#> query_embedding) as similarity
    from user_tastes
    where id != exclude_id
    order by embedding <#> query_embedding
    limit match_count;
end;
$$;
```

6. Run the Backend Server
------------------------
- cd backend
- node server.js

The server will start on port 4000 by default.

7. API Endpoints
----------------
- POST   /api/taste           (store taste input)
- GET    /api/taste/similar   (find similar tastes)
- POST   /api/recommend       (get recommendations)
- POST   /api/booking         (Google Maps search)

8. Testing
----------
- Use Postman or Thunderclient to test endpoints.
- Seed test data in Supabase for similarity/recommendation flows.

9. Documentation
----------------
- See `docs/backend-api.md` for detailed API and database documentation. 

10. JWT Verification for Backend
-------------------------------
To verify Supabase JWTs in your backend, add the following to your `.env`:

SUPABASE_JWT_SECRET=your-supabase-jwt-secret

You can find this secret in your Supabase project settings under API > JWT Secret.

A utility is provided in `backend/utils/jwtVerify.js`:

```js
const { verifySupabaseJWT } = require('../utils/jwtVerify');

// Example usage in an Express middleware:
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });
  const token = authHeader.replace('Bearer ', '');
  try {
    req.user = verifySupabaseJWT(token);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
```

Add `requireAuth` as middleware to any protected route. 
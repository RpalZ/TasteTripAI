# Supabase Tables for TasteTrip AI

This document describes the main Supabase tables used in TasteTrip AI, including their schema, field descriptions, and recommended Row Level Security (RLS) policies.

---

## 1. `user_tastes` (Taste Memory / RAG)

**Purpose:** Stores user taste inputs and their vector embeddings for retrieval-augmented generation (RAG).

**Schema:**
```sql
create table if not exists user_tastes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  input text,
  embedding vector(1536),
  timestamp timestamptz default now()
);
```

**Fields:**
- `id`: Unique taste entry ID
- `user_id`: References the authenticated user (from Supabase Auth)
- `input`: Raw user taste input (e.g., "I like jazz and pizza")
- `embedding`: OpenAI vector embedding (1536 dims)
- `timestamp`: When the entry was created

**RLS Policies:**
```sql
alter table user_tastes enable row level security;

create policy "Users can view their own tastes" on user_tastes
  for select using (auth.uid() = user_id);

create policy "Users can insert their own tastes" on user_tastes
  for insert with check (auth.uid() = user_id);
```

---

## 2. `user_bookmarks` (Bookmarks / Bookings)

**Purpose:** Stores user bookmarks or booking intents for places, recommendations, or Qloo entities.

**Schema:**
```sql
create table if not exists user_bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  qloo_id text, -- Qloo entity_id for cross-referencing
  name text not null,
  lat float,
  lon float,
  address text,
  description text,
  website text,
  image_url text,
  source text, -- e.g., 'qloo', 'google_maps', etc.
  created_at timestamptz default now()
);
```

**Fields:**
- `id`: Unique bookmark ID
- `user_id`: References the authenticated user (from Supabase Auth)
- `qloo_id`: Qloo entity_id for the place (if available)
- `name`: Name of the place/bookmark
- `lat`, `lon`: Coordinates for map display
- `address`: Address of the place
- `description`: Description/details
- `website`: Link to the place or booking page
- `image_url`: Image for display
- `source`: Where the bookmark came from (e.g., 'qloo', 'google_maps')
- `created_at`: Timestamp

**RLS Policies:**
```sql
alter table user_bookmarks enable row level security;

create policy "Users can view their own bookmarks" on user_bookmarks
  for select using (auth.uid() = user_id);

create policy "Users can insert their own bookmarks" on user_bookmarks
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own bookmarks" on user_bookmarks
  for delete using (auth.uid() = user_id);
```

---

## 3. Authentication

- All tables reference `auth.users(id)` for user association.
- Supabase Auth manages user accounts and sessions.
- RLS policies ensure users can only access their own data.

---

## 4. Notes
- The `embedding` field in `user_tastes` requires the `pgvector` extension:
  ```sql
  create extension if not exists vector;
  ```
- Adjust vector dimensions if your embedding model changes.
- You can extend `user_bookmarks` with additional fields as needed (e.g., booking time, tags). 
# TasteTrip AI Backend API Documentation

## Environment Variables
Add these to your `.env` file:
```
OPENAI_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
QLOO_API_KEY=
GOOGLE_MAPS_API_KEY=
```

## Supabase Setup
- Table: `user_tastes`
  - `id` (UUID, PK)
  - `input` (TEXT)
  - `embedding` (VECTOR[1536])
  - `timestamp` (TIMESTAMP)
- Enable `pgvector` extension.
- Create the `match_user_tastes` function (see below).

## Endpoints

### 1. POST `/api/taste`
**Purpose:** Store a user’s taste input as vector + raw data
- **Input:** `{ input: "I like jazz and pizza" }`
- **Logic:**
  - Generates embedding via OpenAI
  - Stores `{ input, embedding, timestamp }` in Supabase
- **Returns:** `{ embedding_id: "abc123" }`

### 2. GET `/api/taste/similar?id=abc123`
**Purpose:** Find similar past taste entries via vector similarity
- **Logic:**
  - Gets target embedding by ID
  - Uses pgvector similarity query to return top N matches
- **Returns:** `Array` of similar taste entries

### 3. POST `/api/recommend`
**Purpose:** Get cultural recommendations and explanations
- **Input:** `{ embedding_id: "abc123" }`
- **Logic:**
  - Fetches original taste input and top 3 similar entries
  - Passes to Qloo API for raw recommendations
  - Formats and explains using OpenAI GPT prompt
- **Returns:**
```
{
  "results": [
    {
      "title": "Napoli Ristorante",
      "type": "Food",
      "description": "A classic Neapolitan pizza spot that aligns with your jazz & Italian fusion taste.",
      "location": "Doha, Qatar",
      "lat": 25.276987,
      "lng": 51.520008
    }
  ],
  "explanation": "GPT-4 formatted explanation of the recommendations."
}
```

#### Qloo + GPT Workflow
- Calls Qloo API with user and similar tastes for recommendations
- Builds a system prompt for GPT-4 to explain and format results
- Returns both raw and formatted recommendations

---

#### [NEW, July 2024] Dynamic Entity Extraction & Qloo API Conformance
> **Enhancement:** The `/api/recommend` endpoint now uses GPT-4 to dynamically extract the most relevant Qloo entity type (e.g., Movie, Book, Artist, etc.) and canonical entity names from user input and similar tastes. These names are resolved to Qloo entity IDs using the Qloo Search API. The backend then sets `filter.type` and `signal.interests.entities` dynamically in the Qloo API call, ensuring full API conformance and supporting all Qloo entity types.
>
> - If no valid entity IDs are found, a 400 error is returned.
> - This logic is implemented in `openaiService.js` and `qlooService.js`.
> - This enhancement is backward compatible: if the input is already a canonical entity name, it will be used as-is.
>
> **Example:**
> 1. User input: "I love time travel movies like Inception and Interstellar."
> 2. GPT-4 extracts:
>    ```json
>    {
>      "entity_type": "Movie",
>      "entity_names": ["Inception", "Interstellar"]
>    }
>    ```
> 3. The backend resolves these names to Qloo entity IDs (e.g., `urn:entity:movie:inception`, ...).
> 4. The Qloo API is called with:
>    - `filter.type = urn:entity:movie`
>    - `signal.interests.entities = <comma-separated entity IDs>`
> 5. Recommendations and a GPT-4 explanation are returned.
>
> **Error Handling:**
> - If no valid Qloo entity IDs are found, returns:
>   ```
>   {
>     "error": "No valid Qloo entity IDs found for input."
>   }
>   ```

---

### 4. POST `/api/booking` **(DEPRECATED)**
**Purpose:** (Deprecated) Previously generated a Google Maps link for a given location for booking/map display.

> **DEPRECATED:** Booking should now be handled directly on the frontend using Supabase. This endpoint is no longer required unless backend logic (e.g., third-party API integration, privileged actions) is needed in the future.

- **Input:**
  - `{ lat: number, lon: number, name?: string, address?: string, description?: string }`
  - (Optionally, accepts an array: `{ locations: [{ lat, lon, name?, address?, description? }, ...] }` for batch support)
- **Logic:**
  - Validates that `lat` and `lon` are present and within valid ranges.
  - Returns a Google Maps link for the provided coordinates.
  - Echoes back any provided metadata (name, address, description) for frontend display.
  - (If batch: returns an array of results.)
- **Returns:**
```
{
  name: "Al Wakrah Old Souq",
  address: "Al Wakra Rd Al Wakrah Qatar",
  description: "Set on a public beach, this longtime market has a variety of local vendors & cafes with global fare.",
  lat: 25.169367,
  lon: 51.61019,
  google_maps_link: "https://www.google.com/maps/search/?api=1&query=25.169367,51.61019"
}
```
- **Note:**
  - The backend does not call Google Maps or Qloo APIs for this endpoint.
  - The frontend is responsible for embedding the map and handling interactivity using the provided link and coordinates.

#### Booking Workflow (Deprecated)
- The frontend sends the selected place's coordinates (and optional metadata) to the backend.
- The backend validates and returns a Google Maps link for display or booking purposes.
- **Now recommended:** The frontend should handle booking logic and data storage directly with Supabase.

## User Onboarding & Profile
- After sign up, users complete onboarding:
  - Choose a unique username (stored in `user_profile` table).
  - Select interests (sent to `/api/taste` and stored as a vector).
  - Onboarding status is tracked in `user_profile.has_onboarded`.

### Table: user_profile
```sql
create table if not exists user_profile (
  id uuid primary key references auth.users(id),
  username text unique,
  has_onboarded boolean default false,
  created_at timestamptz default now()
);
```
- `id`: User UUID (from Supabase Auth)
- `username`: Unique username
- `has_onboarded`: Boolean flag for onboarding completion
- `created_at`: Timestamp

**RLS Policies:**
```sql
alter table user_profile enable row level security;
create policy "Users can view their own profile" on user_profile
  for select using (auth.uid() = id);
create policy "Users can create their own profile" on user_profile
  for insert with check (auth.uid() = id);
create policy "Users can update their own profile" on user_profile
  for update using (auth.uid() = id);
```

## Authentication
- All endpoints require a valid Supabase JWT in the `Authorization` header.
- Auth state is managed client-side and checked on every request.
- Onboarding status is checked via the `user_profile` table.

## Performance Optimizations

The recommendation system has been optimized for faster response times:

### Response Limits
- **Qloo API Results**: Limited to 8 recommendations per request
- **Entity Resolution**: Reduced to 3 entities per search term
- **Similar Tastes**: Limited to 6 similar entries for context

### Performance Benefits
- **Faster API Calls**: Reduced data transfer and processing time
- **Quicker GPT Processing**: Smaller prompts with fewer results
- **Better User Experience**: Faster response times
- **Reduced Costs**: Fewer API calls and tokens used

## Entity Name Cleaning

The system now includes intelligent entity name cleaning and contextualization:

### `cleanEntityNames()` Function
- **Purpose**: Cleans and contextualizes entity names based on user query and taste history
- **Input**: Raw entity names, user query, similar taste entries
- **Output**: Cleaned, relevant entity names optimized for recommendation systems
- **Features**:
  - Removes generic terms (e.g., "restaurant", "place")
  - Adds context from user's taste history
  - Makes names more searchable and specific
  - Ensures names are concise but descriptive

### Examples of Entity Name Cleaning:
- `["Italian restaurant"]` → `["Italian cuisine", "Italian dining"]`
- `["jazz music"]` → `["jazz", "jazz artists"]`
- `["New York"]` → `["New York City", "NYC"]`
- `["action movie"]` → `["action films", "action cinema"]`

## Next Steps
- Implement `/api/recommend` and `/api/booking` endpoints
- Integrate Qloo and Google Maps APIs

---

## Supabase SQL Setup

### Table: user_tastes
```sql
create table if not exists user_tastes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  input text,
  embedding vector(1536),
  timestamp timestamptz default now()
);
```

### Enable pgvector Extension
```sql
create extension if not exists vector;
```

### Similarity Function: match_user_tastes
```sql
-- Returns the top N most similar user_tastes entries for the same user (excluding the given id)
create or replace function match_user_tastes(
  query_embedding vector(1536),
  match_count int,
  exclude_id uuid,
  user_id uuid
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
    select 
      user_tastes.id, 
      user_tastes.input, 
      user_tastes.embedding, 
      user_tastes.timestamp,
      (user_tastes.embedding <#> query_embedding) as similarity
    from user_tastes
    where user_tastes.id != exclude_id
      and user_tastes.user_id = match_user_tastes.user_id
    order by user_tastes.embedding <#> query_embedding
    limit match_count;
end;
$$;
```

- `<#>` is the cosine distance operator in pgvector.
- Adjust `vector(1536)` if your embedding size changes. 

---

## 🎯 **Comprehensive System Summary**

### **Backend Improvements**

#### **🔐 User Authentication & Security**
- **Updated `match_user_tastes` function** to include `user_id` parameter
- **Modified recommendation controller** to filter by user ID
- **Enhanced taste controller** to ensure user ownership
- **Added user isolation** - users can only see their own taste data

#### **🚀 Performance Optimizations**
- **Limited Qloo results** to 8 recommendations per request
- **Reduced entity resolution** from 4 to 3 entities per search term
- **Added API limit parameter** (`limit: 8`) to Qloo calls
- **Faster response times** and reduced costs

#### **🧠 AI Entity Processing**
- **Enhanced `extractEntitiesWithGPT`** function with better entity extraction
- **Added `cleanEntityNames`** function for contextual entity cleaning
- **Improved entity name relevance** based on user query and taste history
- **Better entity type classification** for Qloo API compatibility

#### **📊 Enhanced Logging**
- **Added location logging** in recommendation controller
- **Debug console logs** for entity extraction and processing
- **Better error tracking** and debugging capabilities

### **Database Schema Changes**

#### **🗄️ Supabase Updates**
- **Updated `user_tastes` table** to include `user_id` field
- **Enhanced RPC function** with user filtering
- **Better data isolation** between users

### **Key Achievements**

#### **Performance**
- ⚡ **Faster API responses** (limited to 8 results)
- 💰 **Reduced costs** (fewer API calls)
- 🚀 **Better caching** and optimization

#### **Security**
- 🔒 **User data isolation** (proper user filtering)
- 🛡️ **Authentication enforcement** (JWT validation)
- 🔐 **Ownership validation** (user can only access their own data)

#### **AI Intelligence**
- 🧠 **Smarter entity extraction** and cleaning
- 🎯 **Focused recommendation scope** (9 entity types)
- 💬 **Better conversation flow** with appropriate actions
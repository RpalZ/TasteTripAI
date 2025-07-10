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

### 4. POST `/api/booking`
**Purpose:** Use Google Maps API to locate/book cultural landmarks
- **Input:** `{ query: "restaurants in Doha that match Italian jazz vibe" }`
- **Logic:**
  - Calls Google Maps Places API with the query
  - Returns real-world Google Maps results (place ID, location, link, etc)
- **Returns:**
```
{
  "results": [
    {
      "place_id": "ChIJN1t_tDeuEmsRUsoyG83frY4",
      "name": "Napoli Ristorante",
      "address": "123 Main St, Doha, Qatar",
      "location": { "lat": 25.276987, "lng": 51.520008 },
      "link": "https://www.google.com/maps/place/?q=place_id:ChIJN1t_tDeuEmsRUsoyG83frY4",
      "types": ["restaurant", "food"],
      "rating": 4.5
    }
  ]
}
```

#### Google Maps Workflow
- Calls Google Maps Places API with the user query
- Formats and returns place results with IDs, locations, and direct map links

## Next Steps
- Implement `/api/recommend` and `/api/booking` endpoints
- Integrate Qloo and Google Maps APIs

---

## Supabase SQL Setup

### Table: user_tastes
```sql
create table if not exists user_tastes (
  id uuid primary key default gen_random_uuid(),
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
-- Returns the top N most similar user_tastes entries (excluding the given id)
create or replace function match_user_tastes(
  query_embedding vector(1536),
  match_count int,
  exclude_id uuid
)
returns table (
  id uuid,
  input text,
  embedding vector(1536),
  timestamp timestamptz,
  similarity float
) language plpgsql as $$
begin
  return query
    select id, input, embedding, timestamp,
      (embedding <#> query_embedding) as similarity
    from user_tastes
    where id != exclude_id
    order by embedding <#> query_embedding
    limit match_count;
end;
$$;
```

- `<#>` is the cosine distance operator in pgvector.
- Adjust `vector(1536)` if your embedding size changes. 
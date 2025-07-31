# Backend API Documentation

## Overview
The backend provides RESTful API endpoints for the TasteTrip AI application, handling user authentication, taste analysis, and recommendation generation.

## Authentication
All endpoints require a valid Supabase JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### POST /api/taste
Analyzes user input and stores taste preferences in the database.

**Request Body:**
```json
{
  "input": "I love sushi and Japanese culture",
  "weight": 25
}
```

**Response:**
```json
{
  "message": "Taste preferences stored successfully",
  "embedding_id": "uuid",
  "weight": 25
}
```

**Weight Parameter:**
- **Range**: 1-50
- **Purpose**: Controls recommendation specificity via Qloo API `signal.interests.entities.weight`
- **Values**:
  - **1-10**: General/broad recommendations (e.g., "restaurants")
  - **11-30**: Moderately specific (e.g., "Italian restaurants") 
  - **31-50**: Very specific (e.g., "authentic Italian restaurants in downtown")

### POST /api/recommend
Generates personalized recommendations based on user tastes and input.

**Request Body:**
```json
{
  "embedding_id": "uuid",
  "weight": 25
}
```

**Response:**
```json
{
  "results": [
    {
      "entity_id": "qloo_entity_id",
      "name": "Restaurant Name",
      "subtype": "urn:entity:place",
      "properties": {
        "address": "123 Main St",
        "phone": "+1234567890",
        "business_rating": 4.5,
        "keywords": ["sushi", "japanese"],
        "images": [{"url": "image_url", "type": "photo"}],
        "price_level": 2
      },
      "popularity": 85,
      "location": {
        "lat": 35.6762,
        "lon": 139.6503,
        "geohash": "xn774c"
      }
    }
  ],
  "explanation": {
    "recommendations": [
      "This sushi restaurant is perfect for your taste preferences..."
    ]
  },
  "resultStats": {
    "totalResults": 10,
    "qlooResults": 8,
    "entityDetails": 2,
    "hasQlooResults": true,
    "hasEntityDetails": true
  }
}
```

### POST /api/booking
Handles booking-related operations (placeholder for future implementation).

## Database Schema

### user_tastes Table
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to auth.users)
- `embedding`: Vector (pgvector)
- `content`: Text
- `created_at`: Timestamp

### conversations Table
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to auth.users)
- `title`: Text
- `created_at`: Timestamp

### chats Table
- `id`: UUID (Primary Key)
- `conversation_id`: UUID (Foreign Key to conversations)
- `user_id`: UUID (Foreign Key to auth.users)
- `message`: Text
- `sender_type`: Text ('user' | 'ai')
- `created_at`: Timestamp

### user_bookmarks Table
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to auth.users)
- `qloo_id`: Text
- `created_at`: Timestamp

## Row Level Security (RLS) Policies

### user_tastes
```sql
CREATE POLICY "Users can only access their own tastes" ON user_tastes
FOR ALL USING (auth.uid() = user_id);
```

### conversations
```sql
CREATE POLICY "Users can only access their own conversations" ON conversations
FOR ALL USING (auth.uid() = user_id);
```

### chats
```sql
CREATE POLICY "Users can only access chats from their conversations" ON chats
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM conversations 
    WHERE conversations.id = chats.conversation_id 
    AND conversations.user_id = auth.uid()
  )
);
```

### user_bookmarks
```sql
CREATE POLICY "Users can only access their own bookmarks" ON user_bookmarks
FOR ALL USING (auth.uid() = user_id);
```

## Performance Optimizations

### Caching Strategy
- **OpenAI Embeddings**: Cached for 1 hour
- **Qloo Recommendations**: Cached for 30 minutes
- **Qloo Entity Details**: Cached for 2 hours
- **User Tastes**: Cached for 15 minutes
- **Entity Search**: Cached for 1 hour

### Database Optimizations
- Vector similarity search using pgvector
- Indexed foreign keys and timestamps
- Efficient RLS policies

## Location Extraction Rules

### Supported Location Types
- **Countries**: "Japan", "United States", "France"
- **Cities**: "Tokyo", "New York", "Paris"
- **States/Regions**: "California", "Île-de-France"
- **Neighborhoods**: "Shibuya", "Manhattan"
- **Continents**: "Asia", "Europe" (expanded to countries)

### Location Processing
1. **GPT Extraction**: Uses OpenAI to identify location entities
2. **Continent Expansion**: Converts continents to country arrays
3. **Qloo Integration**: Uses `filter.location.query` for geographic filtering
4. **Radius Control**: Sets `filter.location.radius = 0` for precise location filtering when location is found

### Location Filtering Logic
```javascript
// When location is found (single or multiple)
if (location || locationArray) {
  params['filter.location.query'] = location || locationArray;
  params['filter.location.radius'] = 0; // Precise location filtering
}

// When no location is found
// No radius parameter is set, allowing broader search
```

### Radius Parameter Behavior
- **Location Found**: `filter.location.radius = 0` ensures precise location-based filtering
- **No Location**: Radius parameter is omitted, allowing broader geographic search
- **Benefits**: More accurate results when location is specified, flexible search when location is unknown

## Recommendation Specificity Control

### Weight Parameter System
The system uses Qloo's `signal.interests.entities.weight` parameter to control recommendation specificity:

```javascript
// Weight ranges and their effects
1-10:   General/broad recommendations (e.g., "restaurants")
11-30:  Moderately specific (e.g., "Italian restaurants") 
31-50:  Very specific (e.g., "authentic Italian restaurants in downtown")
```

### Implementation Flow
1. **Frontend**: AI determines weight based on user query specificity
2. **Taste API**: Stores weight with embedding
3. **Recommend API**: Uses weight in Qloo API call
4. **Qloo API**: Applies weight to influence result relevance

### Qloo API Integration
```javascript
// Qloo API parameters with weight
params = {
  'filter.type': `urn:entity:${entityType}`,
  'signal.interests.entities': entityIds.join(','),
  'signal.interests.entities.weight': signalWeight, // 1-50 range
  'take': 50
}
```

## Enhanced Logging & Debugging

### Request Logging
- Full request parameters logged before API calls
- Response status and data structure validation
- Error details with context for debugging

### Qloo API Monitoring
- Request parameters logged in JSON format
- Response analysis with result type breakdown
- Error handling with specific status code checks
- Location validation for 400 errors
- Weight parameter logging for specificity control

### Entity Processing
- GPT extraction results logged
- Entity type validation and processing
- Location expansion and filtering details

## Error Handling

### Common Error Scenarios
1. **Invalid JWT**: Returns 401 Unauthorized
2. **Missing Input**: Returns 400 Bad Request
3. **Qloo API Errors**: Logged and handled gracefully
4. **Database Errors**: Proper error messages returned

### Graceful Degradation
- Qloo API failures don't break the entire flow
- Fallback to entity search when needed
- Partial results returned when possible

## System Summary

The backend orchestrates multiple services:
- **Supabase**: User authentication and data storage
- **OpenAI**: Natural language understanding and embeddings
- **Qloo API**: Cultural insights and recommendations with specificity control
- **PostgreSQL**: Vector similarity search and data persistence

The system provides a robust foundation for personalized cultural recommendations with comprehensive error handling, performance optimizations, and intelligent specificity control based on user query context.
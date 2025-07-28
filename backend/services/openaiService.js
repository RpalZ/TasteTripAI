const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate an embedding for the given text using OpenAI's API.
 * @param {string} text
 * @returns {Promise<number[]>} Embedding vector
 */
async function generateEmbedding(text) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return response.data[0].embedding;
}

/**
 * Clean and contextualize entity names based on user query and similar entries
 * @param {string[]} entityNames - Raw entity names from extraction
 * @param {string} userInput - Original user query
 * @param {string[]} similarEntries - Similar taste entries for context
 * @returns {Promise<string[]>} Cleaned and contextualized entity names
 */
async function cleanEntityNames(entityNames, userInput, similarEntries = []) {
  if (!entityNames || entityNames.length === 0) return [];
  
  const prompt = `Given the user's query and their taste history, clean and contextualize the entity names to be more relevant and specific to what they're looking for.

User Query: "${userInput}"
${similarEntries.length ? `User's Taste History: ${similarEntries.join(', ')}` : ''}
Raw Entity Names: ${entityNames.join(', ')}

Instructions:
1. Make entity names more specific and relevant to the user's query
2. Remove generic terms that don't add value (e.g., "restaurant", "place", "thing")
3. Add context from the user's taste history when relevant
4. Ensure names are searchable and meaningful for recommendation systems
5. Keep names concise but descriptive

Examples:
- Raw: ["Italian restaurant"] → Clean: ["Italian cuisine", "Italian dining"]
- Raw: ["jazz music"] → Clean: ["jazz", "jazz artists"]
- Raw: ["New York"] → Clean: ["New York City", "NYC"]
- Raw: ["action movie"] → Clean: ["action films", "action cinema"]

Return a JSON array of cleaned entity names:
["cleaned_name_1", "cleaned_name_2", ...]`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: prompt }],
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return Array.isArray(result) ? result : entityNames; // Fallback to original if parsing fails
  } catch (error) {
    console.error('Error cleaning entity names:', error);
    return entityNames; // Fallback to original names
  }
}

/**
 * Extract Qloo entity type and canonical entity names from user input using GPT-4.
 * @param {string} userInput - The main user input string
 * @param {string[]} similarEntries - Array of similar taste strings
 * @returns {Promise<{entity_type: string, entity_names: string[], location: string|null}>}
 */
async function extractEntitiesWithGPT(userInput, similarEntries = []) {
  const prompt = `Given the following user input, extract:
1. The most relevant Qloo entity type (choose from: Artist, Book, Brand, Destination, Movie, Place, Podcast, TV Show, Video Game, Location).
   - For requests about food, eating, or places to eat, use "Place"
   - For requests about countries, cities, or regions, use "Destination", "Place", or "Location" as appropriate
   - For music-related requests, use "Artist"
   - For entertainment content, use "Movie", "TV Show", "Podcast", or "Video Game" as appropriate
2. A list of specific, relevant entity names that match the user's intent
3. If the user input refers to a specific country, city, or region, extract it as a separate 'location' property

Examples:
- User input: "give me something to eat" → entity_type: "Place", entity_names: ["dining", "food"], location: null
- User input: "recommend a good Italian restaurant" → entity_type: "Place", entity_names: ["Italian cuisine", "Italian dining"], location: null
- User input: "I want to listen to jazz music" → entity_type: "Artist", entity_names: ["jazz", "jazz artists"], location: null
- User input: "suggest a movie like Inception" → entity_type: "Movie", entity_names: ["Inception", "sci-fi films"], location: null
- User input: "recommend things to do in Japan" → entity_type: "Destination", entity_names: ["Japan", "Japanese culture"], location: "Japan"
- User input: "find experiences in New York City" → entity_type: "Location", entity_names: ["New York City", "NYC attractions"], location: "New York City"

User input: "${userInput}"
${similarEntries.length ? `Similar tastes: ${similarEntries.join(', ')}` : ''}

Respond in JSON:
{
  "entity_type": "...",
  "entity_names": [...],
  "location": ...
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'system', content: prompt }],
    response_format: { type: 'json_object' }
  });

  const extraction = JSON.parse(response.choices[0].message.content);
  
  // Clean and contextualize the entity names
  const cleanedEntityNames = await cleanEntityNames(
    extraction.entity_names || [], 
    userInput, 
    similarEntries
  );
  
  return {
    ...extraction,
    entity_names: cleanedEntityNames
  };
}

module.exports = { generateEmbedding, extractEntitiesWithGPT };

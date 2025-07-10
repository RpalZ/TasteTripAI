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
 * Extract Qloo entity type and canonical entity names from user input using GPT-4.
 * @param {string} userInput - The main user input string
 * @param {string[]} similarEntries - Array of similar taste strings
 * @returns {Promise<{entity_type: string, entity_names: string[]}>}
 */
async function extractEntitiesWithGPT(userInput, similarEntries = []) {
  const prompt = `Given the following user input, extract:\n1. The most relevant Qloo entity type (choose from: Artist, Book, Brand, Destination, Movie, Place, Podcast, TV Show, Video Game, Location).\n   - For requests about food, eating, or places to eat, use \"Place\" (or \"Restaurant\" if available in your system).\n   - For requests about countries, cities, or regions, use \"Destination\", \"Place\", or \"Location\" as appropriate.\n2. A list of canonical entity names (including countries, cities, or regions) that match the user’s intent.\n3. If the user input refers to a specific country, city, or region, extract it as a separate 'location' property (string).\n\nExamples:\n- User input: \"give me something to eat\" → entity_type: \"Place\", entity_names: [], location: null\n- User input: \"recommend a good Italian restaurant\" → entity_type: \"Place\", entity_names: [\"Italian restaurant\"], location: null\n- User input: \"I want to listen to music\" → entity_type: \"Artist\", entity_names: [], location: null\n- User input: \"suggest a movie like Inception\" → entity_type: \"Movie\", entity_names: [\"Inception\"], location: null\n- User input: \"recommend things to do in Japan\" → entity_type: \"Destination\", entity_names: [\"Japan\"], location: \"Japan\"\n- User input: \"I want to visit Italy\" → entity_type: \"Destination\", entity_names: [\"Italy\"], location: \"Italy\"\n- User input: \"find experiences in New York City\" → entity_type: \"Location\", entity_names: [\"New York City\"], location: \"New York City\"\n\nUser input: \"${userInput}\"${similarEntries.length ? ` Similar tastes: ${similarEntries.join(', ')}` : ''}\n\nRespond in JSON:\n{\n  \"entity_type\": \"...\",\n  \"entity_names\": [...],\n  \"location\": ...\n}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: prompt }
    ],
    response_format: { type: 'json_object' }
  });

  console.log('response', response.choices[0].message.content);
  return JSON.parse(response.choices[0].message.content);
}

module.exports = { generateEmbedding, extractEntitiesWithGPT };

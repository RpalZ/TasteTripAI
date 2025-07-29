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
1. The most relevant Qloo entity type (choose from: Destination, Place, Location).
   - For requests about food, eating, restaurants, venues, or attractions, use "Place"
   - For requests about countries, cities, regions, or travel destinations, use "Destination" or "Location" as appropriate
   - IMPORTANT: You can analyze any cultural tastes (books, movies, music, etc.) but only recommend Destinations and Places. Use cultural preferences to suggest relevant travel experiences.
2. A list of specific, relevant entity names that match the user's intent
3. If the user input refers to a specific location, extract it as a separate 'location' property. Extract countries, cities, states, neighborhoods, or continents (like "Asia", "Europe", "Africa"). For multiple locations, return an array. Be specific and actionable.

Examples:
- User input: "give me something to eat" → entity_type: "Place", entity_names: ["dining", "food"], location: null
- User input: "recommend a good Italian restaurant" → entity_type: "Place", entity_names: ["Italian cuisine", "Italian dining"], location: null
- User input: "I love jazz music and want to travel" → entity_type: "Place", entity_names: ["jazz clubs", "music venues", "jazz culture"], location: null
- User input: "I love sci-fi movies and want to visit tech cities" → entity_type: "Destination", entity_names: ["tech cities", "futuristic attractions", "innovation hubs"], location: null
- User input: "recommend things to do in Japan" → entity_type: "Destination", entity_names: ["Japan", "Japanese culture"], location: "Japan"
- User input: "find experiences in New York City" → entity_type: "Location", entity_names: ["New York City", "NYC attractions"], location: "New York City"
- User input: "recommend places in the United States" → entity_type: "Place", entity_names: ["American dining", "US attractions"], location: "United States"
- User input: "restaurants in Los Angeles" → entity_type: "Place", entity_names: ["dining", "restaurants"], location: "Los Angeles"
- User input: "Asian food" → entity_type: "Place", entity_names: ["Asian cuisine", "Asian dining"], location: "Asia"
- User input: "Chinese restaurants in San Francisco" → entity_type: "Place", entity_names: ["Chinese cuisine", "Chinese dining"], location: "San Francisco"
- User input: "European travel" → entity_type: "Destination", entity_names: ["European travel", "European destinations"], location: "Europe"
- User input: "restaurants in Paris" → entity_type: "Place", entity_names: ["dining", "restaurants"], location: "Paris"
- User input: "food in China and Japan" → entity_type: "Place", entity_names: ["Chinese cuisine", "Japanese cuisine"], location: ["China", "Japan"]
- User input: "restaurants in New York and Los Angeles" → entity_type: "Place", entity_names: ["dining", "restaurants"], location: ["New York City", "Los Angeles"]

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
  
  // Filter out overly broad locations (continents, very broad regions)
  const broadLocations = ['asia', 'europe', 'africa', 'north america', 'south america', 'australia', 'antarctica', 'middle east', 'central america', 'caribbean'];
  
  // Define continent expansions - just countries, let Qloo handle entity types
  const continentExpansions = {
    'asia': {
      countries: ['China', 'Japan', 'Thailand', 'Korea', 'Vietnam', 'India']
    },
    'europe': {
      countries: ['France', 'Italy', 'Spain', 'Germany', 'Netherlands', 'Switzerland']
    },
    'africa': {
      countries: ['Morocco', 'Ethiopia', 'South Africa', 'Egypt']
    }
  };
  
  let location = extraction.location;
  let locationArray = null; // New array for multiple locations
  
  console.trace(location, "location in openaiservice");
  console.log('📍 Raw location from GPT:', location, 'Type:', typeof location);
  
  // Handle case where location is returned as an array
  if (Array.isArray(location)) {
    console.log('🔄 Location is an array, processing multiple locations:', location);
    
    // Clean and validate the location array
    locationArray = location
      .filter(loc => loc && typeof loc === 'string' && loc.trim().length > 0)
      .map(loc => loc.trim());
    
    console.log('✅ Cleaned location array:', locationArray);
    
    // Check if any locations in the array are continents that need expansion
    const continentLocations = locationArray.filter(loc => 
      broadLocations.includes(loc.toLowerCase())
    );
    
    if (continentLocations.length > 0) {
      console.log('🌍 Found continents in location array:', continentLocations);
      // Process continent expansion for each continent in the array
      const expandedCountries = [];
      
      continentLocations.forEach(continent => {
        const expansion = continentExpansions[continent.toLowerCase()];
        if (expansion) {
          expandedCountries.push(...expansion.countries);
        }
      });
      
      // Replace continents with expanded countries
      locationArray = locationArray.filter(loc => 
        !broadLocations.includes(loc.toLowerCase())
      ).concat(expandedCountries);
      
      console.log('🔄 Final expanded location array:', locationArray);
    }
    
    location = null; // Clear single location since we have an array
  } else if (location && broadLocations.includes(location.toLowerCase())) {
    // Expand continent to specific countries, let Qloo handle entity types
    
    const expansion = continentExpansions[location.toLowerCase()];
    if (expansion) {
      console.log('🌍 Continent detected:', location);
      console.log('🔄 Expanding to countries:', expansion.countries);
      
      // Use array of countries instead of continent
      locationArray = expansion.countries;
      location = null; // Clear the continent location
      
      console.log('✅ Continent expansion complete');
    } else {
      console.log('⚠️  Continent not found in expansion map:', location);
    }
  }
  
  return {
    ...extraction,
    entity_names: cleanedEntityNames,
    location: location,
    location_array: locationArray
  };
}

module.exports = { generateEmbedding, extractEntitiesWithGPT };

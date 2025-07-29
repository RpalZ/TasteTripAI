const axios = require('axios');

const QLOO_API_KEY = process.env.QLOO_API_KEY;
// const QLOO_API_KEY = "UxGf0g08SaZ-mXk4LBw_6qxVaxQGpu08jJnEPbHQAOY";
const QLOO_API_URL = 'https://hackathon.api.qloo.com/v2/insights/';

// Debug environment variable
console.log('🔧 Environment Check:');
console.log('  QLOO_API_KEY exists:', !!process.env.QLOO_API_KEY);
console.log('  QLOO_API_KEY length:', process.env.QLOO_API_KEY?.length || 0);
console.log('  QLOO_API_KEY starts with:', process.env.QLOO_API_KEY?.substring(0, 10) || 'undefined');

/**
 * Fetch recommendations from Qloo API based on dynamic query params
 * @param {Object} params - Qloo API query parameters (filter.type, filter.tags, signal.location.query, etc.)
 * @returns {Promise<Object[]>}
 */
async function getQlooRecommendations(params) {
  try {
    console.log('🔗 Qloo API Request URL:', QLOO_API_URL);
    console.log('🔑 Qloo API Key (first 10 chars):', QLOO_API_KEY?.substring(0, 10) + '...');
    console.log('🔑 Qloo API Key length:', QLOO_API_KEY?.length || 0);
    console.log('🔑 Qloo API Key exists:', !!QLOO_API_KEY);
    
    const response = await axios.get(QLOO_API_URL, {
      params,
      headers: {
        'x-api-key': QLOO_API_KEY,
      },
    });
    
    // Log successful response details
    console.log('✅ Qloo API Response Status:', response.status);
    console.log('📊 Qloo API Response Headers:', JSON.stringify(response.headers, null, 2));
    console.log('📄 Qloo API Response Data Structure:', {
      success: response.data.success,
      resultsCount: response.data.results?.entities?.length || 0,
      hasResults: !!response.data.results?.entities
    });
    console.log('📄 Full Qloo API Response:', JSON.stringify(response.data, null, 2));
    
    // Log detailed results if available
    if (response.data.results?.entities && response.data.results.entities.length > 0) {
      console.log('🏆 Qloo API Raw Results (first 3):');
      response.data.results.entities.slice(0, 3).forEach((entity, index) => {
        console.log(`  ${index + 1}. Entity:`, {
          name: entity.name,
          id: entity.entity_id,
          type: entity.subtype,
          properties: entity.properties ? Object.keys(entity.properties) : 'none'
        });
      });
    } else {
      console.log('⚠️  No entities in response. Full response structure:');
      console.log('  Results object:', response.data.results);
      console.log('  Results.entities:', response.data.results?.entities);
      console.log('  Results.entities length:', response.data.results?.entities?.length);
      console.log('  Raw response data keys:', Object.keys(response.data));
    }
    
    // Qloo returns results.entities array
    return response.data.results?.entities || [];
  } catch (error) {
    console.error('❌ Qloo API Error Details:');
    console.error('  Message:', error.message);
    console.error('  Status:', error.response?.status);
    console.error('  Status Text:', error.response?.statusText);
    console.error('  URL:', error.config?.url);
    console.error('  Method:', error.config?.method);
    console.error('  Headers:', JSON.stringify(error.config?.headers, null, 2));
    console.error('  Params:', JSON.stringify(error.config?.params, null, 2));
    console.error('  Response Data:', JSON.stringify(error.response?.data, null, 2));
    
    // Specific handling for 403 errors
    if (error.response?.status === 403) {
      console.error('🚨 403 FORBIDDEN ERROR - Possible causes:');
      console.error('  1. Invalid or expired API key');
      console.error('  2. API key not properly set in environment variables');
      console.error('  3. API key doesn\'t have permission for this endpoint');
      console.error('  4. Rate limiting or quota exceeded');
      console.error('  5. Wrong API endpoint URL');
      console.error('  🔍 Check your .env file for QLOO_API_KEY');
      console.error('  🔍 Verify the API key is valid in Qloo dashboard');
    }
    
    throw new Error(`Failed to fetch recommendations from Qloo: ${error.response?.status} - ${error.response?.data?.error || error.message}`);
  }
}

/**
 * Resolve an array of entity names to Qloo entity IDs using the Qloo search API.
 * @param {string[]} names - Array of entity names (e.g., movie titles)
 * @param {string} type - Entity type (e.g., 'movie')
 * @param {string} location - Location name (e.g., 'United States', 'New York City', 'Los Angeles')
 * @returns {Promise<{entityIds: string[], entityDetails: Array}>} Array of Qloo entity IDs and details
 */
async function resolveEntityIds(names, type = 'movie', location) {
  console.log('🔍 Resolving entity IDs for:', { names, type, location });
  const results = [];
  const entityDetails = [];
  
  for (const name of names) {
    try {
      const params = {
        query: name,
        type: `urn:entity:${type}`
      };
      // Add location param if provided (Qloo search API supports countries, cities, and localities)
      if (location) {
        params.location = location; // Supports countries, cities, neighborhoods (e.g., 'United States', 'New York City', 'Lower East Side')
        console.log(`    📍 Using location filter: "${location}" for entity search`);
      } else {
        console.log(`    🌍 No location filter applied for entity search`);
      }
      
      console.log(`  🔎 Searching for: "${name}" (type: ${type})${location ? ` in ${location}` : ''}`);
      
      const response = await axios.get('https://hackathon.api.qloo.com/search', {
        params,
        headers: {
          'x-api-key': QLOO_API_KEY,
        },
      });
      
      // Collect up to 3 entity_ids from the results array (reduced for better performance)
      const entities = response.data.results || [];
      console.log(`    📊 Found ${entities.length} entities for "${name}"`);
      
      for (let i = 0; i < Math.min(3, entities.length); i++) {
        const entity = entities[i]?.entity_id;
        const entityName = entities[i]?.name || 'unnamed';
        const entityLocation = entities[i]?.location || 'no location';
        
        if (entity) {
          results.push(entity);
          entityDetails.push({
            entity_id: entity,
            name: entityName,
            location: entityLocation,
            subtype: entities[i]?.subtype || `urn:entity:${type}`,
            properties: entities[i]?.properties || {}
          });
          console.log(`    ✅ Added entity ID: ${entity} (${entityName}) - Location: ${entityLocation}`);
        }
      }
    } catch (err) {
      console.log(`    ❌ Failed to resolve "${name}":`, err.message);
      // Ignore failed lookups, continue
    }
  }
  
  // Remove duplicates while preserving order
  const uniqueResults = [...new Set(results)];
  console.log('🎯 Final resolved entity IDs:', uniqueResults);
  console.log('🔄 Removed duplicates:', results.length - uniqueResults.length);
  
  // Remove duplicate entity details as well
  const uniqueEntityDetails = entityDetails.filter((detail, index) => 
    uniqueResults.indexOf(detail.entity_id) === index
  );
  
  return {
    entityIds: uniqueResults,
    entityDetails: uniqueEntityDetails
  };
}

module.exports = { getQlooRecommendations, resolveEntityIds };

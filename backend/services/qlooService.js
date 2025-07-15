const axios = require('axios');

const QLOO_API_KEY = process.env.QLOO_API_KEY;
// const QLOO_API_KEY = "UxGf0g08SaZ-mXk4LBw_6qxVaxQGpu08jJnEPbHQAOY";
const QLOO_API_URL = 'https://hackathon.api.qloo.com/v2/insights/';

/**
 * Fetch recommendations from Qloo API based on dynamic query params
 * @param {Object} params - Qloo API query parameters (filter.type, filter.tags, signal.location.query, etc.)
 * @returns {Promise<Object[]>}
 */
async function getQlooRecommendations(params) {
  try {
    const response = await axios.get(QLOO_API_URL, {
      params,
      headers: {
        'x-api-key': QLOO_API_KEY,
      },
    });
    // Qloo returns results.entities array
    return response.data.results?.entities || [];
  } catch (error) {
    console.error('Qloo API error:', error.response?.data || error.message);
    throw new Error('Failed to fetch recommendations from Qloo');
  }
}

/**
 * Resolve an array of entity names to Qloo entity IDs using the Qloo search API.
 * @param {string[]} names - Array of entity names (e.g., movie titles)
 * @param {string} type - Entity type (e.g., 'movie')
 * @returns {Promise<string[]>} Array of Qloo entity IDs
 */
async function resolveEntityIds(names, type = 'movie', location) {
  const results = [];
  for (const name of names) {
    try {
      const params = {
        query: name,
        type: `urn:entity:${type}`
      };
      // Add location/country param if provided (context7 best practice)
      if (location) {
        params.location = location;
      }
      const response = await axios.get('https://hackathon.api.qloo.com/search', {
        params,
        headers: {
          'x-api-key': QLOO_API_KEY,
        },
      });
      // Collect up to 4 entity_ids from the results array
      const entities = response.data.results || [];
      for (let i = 0; i < Math.min(4, entities.length); i++) {
        const entity = entities[i]?.entity_id;
        if (entity) results.push(entity);
      }
    } catch (err) {
      // Ignore failed lookups, continue
    }
  }
  return results;
}

module.exports = { getQlooRecommendations, resolveEntityIds };

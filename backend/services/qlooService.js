const axios = require('axios');

const QLOO_API_KEY = process.env.QLOO_API_KEY;
const QLOO_API_URL = 'https://staging.api.qloo.com/v2/insights/';

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

module.exports = { getQlooRecommendations };

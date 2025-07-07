const axios = require('axios');

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/place/textsearch/json';

/**
 * Search for places using Google Maps Places API
 * @param {string} query - The search query
 * @returns {Promise<Object[]>} - Array of place results
 */
async function searchPlaces(query) {
  try {
    const response = await axios.get(GOOGLE_MAPS_API_URL, {
      params: {
        query,
        key: GOOGLE_MAPS_API_KEY,
      },
    });
    return response.data.results || [];
  } catch (error) {
    console.error('Google Maps API error:', error.response?.data || error.message);
    throw new Error('Failed to fetch places from Google Maps');
  }
}

module.exports = { searchPlaces };

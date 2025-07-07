const { searchPlaces } = require('../services/googleMapsService');

/**
 * POST /api/booking
 * Input: { query: "restaurants in Doha that match Italian jazz vibe" }
 * Returns: Google Maps place results (id, location, link, etc)
 */
exports.book = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'query is required' });

    // Call Google Maps Places API
    const places = await searchPlaces(query);

    // Format results
    const formatted = places.map(place => ({
      place_id: place.place_id,
      name: place.name,
      address: place.formatted_address,
      location: place.geometry?.location,
      link: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
      types: place.types,
      rating: place.rating,
    }));

    return res.json({ results: formatted });
  } catch (err) {
    console.error('Error in book:', err);
    return res.status(500).json({ error: 'Failed to fetch booking results' });
  }
};

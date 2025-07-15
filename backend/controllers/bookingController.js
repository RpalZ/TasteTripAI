/**
 * POST /api/booking
 * Input: { lat: number, lon: number }
 * Returns: { google_maps_link: string }
 */
exports.book = async (req, res) => {
  try {
    const { lat, lon } = req.body;
    if (typeof lat !== 'number' || typeof lon !== 'number') {
      return res.status(400).json({ error: 'lat and lon are required and must be numbers' });
    }
    const google_maps_link = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
    return res.json({ google_maps_link });
  } catch (err) {
    console.error('Error in book:', err);
    return res.status(500).json({ error: 'Failed to generate Google Maps link' });
  }
};

const jwt = require('jsonwebtoken');

const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

/**
 * Verifies a Supabase JWT and returns the decoded payload if valid.
 * Throws an error if invalid or expired.
 * @param {string} token - The JWT to verify
 * @returns {object} - The decoded payload
 */
function verifySupabaseJWT(token) {
  if (!SUPABASE_JWT_SECRET) {
    throw new Error('SUPABASE_JWT_SECRET is not set in environment variables');
  }
  return jwt.verify(token, SUPABASE_JWT_SECRET);
}

module.exports = { verifySupabaseJWT }; 
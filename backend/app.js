const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const { verifySupabaseJWT } = require('./utils/jwtVerify');

const tasteRoutes = require('./routes/tasteRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const cacheRoutes = require('./routes/cacheRoutes');

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

// JWT Auth middleware for all API routes
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });
  const token = authHeader.replace('Bearer ', '');
  try {
    req.user = verifySupabaseJWT(token);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

app.use('/api', requireAuth);

app.use('/api/taste', tasteRoutes);
app.use('/api/recommend', recommendationRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/cache', cacheRoutes);

module.exports = app;

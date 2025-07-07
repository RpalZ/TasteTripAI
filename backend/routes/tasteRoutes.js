const express = require('express');
const router = express.Router();
const tasteController = require('../controllers/tasteController');

// POST /api/taste
router.post('/', tasteController.createTaste);
// GET /api/taste/similar
router.get('/similar', tasteController.getSimilarTastes);

module.exports = router;

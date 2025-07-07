const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// POST /api/booking
router.post('/', bookingController.book);

module.exports = router;

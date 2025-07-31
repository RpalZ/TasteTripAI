const express = require('express');
const cacheService = require('../services/cacheService');

const router = express.Router();

/**
 * GET /api/cache/stats
 * Get cache statistics and performance metrics
 */
router.get('/stats', (req, res) => {
  try {
    const stats = cacheService.getStats();
    res.json({
      success: true,
      data: {
        ...stats,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('❌ Cache stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve cache statistics'
    });
  }
});

/**
 * POST /api/cache/clear
 * Clear all cache data
 */
router.post('/clear', (req, res) => {
  try {
    const cleared = cacheService.clear();
    res.json({
      success: true,
      message: 'Cache cleared successfully',
      cleared: cleared
    });
  } catch (error) {
    console.error('❌ Cache clear error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear cache'
    });
  }
});

/**
 * POST /api/cache/cleanup
 * Manually trigger cache cleanup (remove expired items)
 */
router.post('/cleanup', (req, res) => {
  try {
    const cleaned = cacheService.cleanup();
    res.json({
      success: true,
      message: 'Cache cleanup completed',
      itemsRemoved: cleaned
    });
  } catch (error) {
    console.error('❌ Cache cleanup error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cleanup cache'
    });
  }
});

/**
 * POST /api/cache/test
 * Test cache functionality with a simple key-value pair
 */
router.post('/test', (req, res) => {
  try {
    const { key, value, ttl } = req.body;
    
    if (!key || value === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Key and value are required'
      });
    }

    // Test cache set
    const setResult = cacheService.set(key, value, ttl);
    
    // Test cache get
    const getResult = cacheService.get(key);
    
    res.json({
      success: true,
      test: {
        key,
        originalValue: value,
        cachedValue: getResult,
        setSuccess: setResult,
        cacheHit: getResult !== null,
        cacheMatch: JSON.stringify(value) === JSON.stringify(getResult)
      }
    });
  } catch (error) {
    console.error('❌ Cache test error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to test cache'
    });
  }
});

module.exports = router; 
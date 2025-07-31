/**
 * Caching Service for TasteTrip AI Backend
 * 
 * Provides in-memory caching with TTL (Time To Live) for:
 * - Qloo API responses
 * - OpenAI embeddings
 * - Recommendation data
 * - Entity resolution data
 */

class CacheService {
  constructor() {
    this.cache = new Map()
    this.ttlTimers = new Map()
    
    // Default TTL values (in milliseconds)
    this.defaultTTL = {
      qloo_recommendations: 15 * 60 * 1000, // 15 minutes
      qloo_entities: 30 * 60 * 1000,        // 30 minutes
      openai_embeddings: 60 * 60 * 1000,    // 1 hour
      user_tastes: 5 * 60 * 1000,           // 5 minutes
      entity_search: 20 * 60 * 1000         // 20 minutes
    }
    
    console.log('🗄️ Cache service initialized')
  }

  /**
   * Generate a cache key
   */
  generateKey(type, ...params) {
    // Create a more robust key generation that handles objects consistently
    const normalizedParams = params.map(param => {
      if (typeof param === 'object' && param !== null) {
        // Sort object keys to ensure consistent stringification
        return JSON.stringify(param, Object.keys(param).sort())
      }
      return param
    })
    const key = `${type}:${normalizedParams.join(':')}`
    return key
  }

  /**
   * Set a value in cache with TTL
   */
  set(key, value, ttl = null) {
    try {
      // Clear existing timer if key exists
      if (this.ttlTimers.has(key)) {
        clearTimeout(this.ttlTimers.get(key))
      }

      // Store the value
      this.cache.set(key, {
        value: value,
        timestamp: Date.now(),
        ttl: ttl
      })

      // Set TTL timer if provided
      if (ttl) {
        const timer = setTimeout(() => {
          this.delete(key)
        }, ttl)
        this.ttlTimers.set(key, timer)
      }

      console.log(`🗄️ Cached: ${key} (TTL: ${ttl ? `${ttl/1000}s` : 'none'})`)
      return true
    } catch (error) {
      console.error('❌ Cache set error:', error)
      return false
    }
  }

  /**
   * Get a value from cache
   */
  get(key) {
    try {
      const item = this.cache.get(key)
      
      if (!item) {
        console.log(`🗄️ Cache miss: ${key}`)
        return null
      }

      // Check if item has expired
      if (item.ttl && (Date.now() - item.timestamp) > item.ttl) {
        this.delete(key)
        console.log(`🗄️ Cache expired: ${key}`)
        return null
      }

      console.log(`🗄️ Cache hit: ${key}`)
      return item.value
    } catch (error) {
      console.error('❌ Cache get error:', error)
      return null
    }
  }

  /**
   * Delete a value from cache
   */
  delete(key) {
    try {
      // Clear timer
      if (this.ttlTimers.has(key)) {
        clearTimeout(this.ttlTimers.get(key))
        this.ttlTimers.delete(key)
      }

      // Remove from cache
      const deleted = this.cache.delete(key)
      if (deleted) {
        console.log(`🗄️ Cache deleted: ${key}`)
      }
      return deleted
    } catch (error) {
      console.error('❌ Cache delete error:', error)
      return false
    }
  }

  /**
   * Clear all cache
   */
  clear() {
    try {
      // Clear all timers
      for (const timer of this.ttlTimers.values()) {
        clearTimeout(timer)
      }
      this.ttlTimers.clear()

      // Clear cache
      const size = this.cache.size
      this.cache.clear()
      
      console.log(`🗄️ Cache cleared: ${size} items removed`)
      return true
    } catch (error) {
      console.error('❌ Cache clear error:', error)
      return false
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      memory: this.getMemoryUsage()
    }
  }

  /**
   * Estimate memory usage (rough calculation)
   */
  getMemoryUsage() {
    let totalSize = 0
    for (const [key, value] of this.cache.entries()) {
      totalSize += JSON.stringify({ key, value }).length * 2 // Rough bytes estimation
    }
    return `${(totalSize / 1024 / 1024).toFixed(2)} MB`
  }

  /**
   * Cache helper methods for specific data types
   */

  // Qloo recommendations caching
  cacheQlooRecommendations(query, filters, data) {
    const key = this.generateKey('qloo_recommendations', 
      JSON.stringify(query), 
      JSON.stringify(filters)
    )
    console.log('💾 Caching Qloo recommendations:', {
      key: key.substring(0, 100) + (key.length > 100 ? '...' : ''),
      dataLength: Array.isArray(data) ? data.length : 'not array',
      ttl: this.defaultTTL.qloo_recommendations
    })
    return this.set(key, data, this.defaultTTL.qloo_recommendations)
  }

  getQlooRecommendations(query, filters) {
    const key = this.generateKey('qloo_recommendations', 
      JSON.stringify(query), 
      JSON.stringify(filters)
    )
    console.log('🔍 Cache lookup for Qloo recommendations:', {
      key: key.substring(0, 100) + (key.length > 100 ? '...' : ''),
      queryKeys: Object.keys(query || {}),
      filtersKeys: Object.keys(filters || {})
    })
    return this.get(key)
  }

  // Qloo entity resolution caching
  cacheQlooEntities(entities, data) {
    const key = this.generateKey('qloo_entities', JSON.stringify(entities))
    return this.set(key, data, this.defaultTTL.qloo_entities)
  }

  getQlooEntities(entities) {
    const key = this.generateKey('qloo_entities', JSON.stringify(entities))
    return this.get(key)
  }

  // OpenAI embeddings caching
  cacheEmbedding(text, embedding) {
    const key = this.generateKey('openai_embeddings', text)
    return this.set(key, embedding, this.defaultTTL.openai_embeddings)
  }

  getEmbedding(text) {
    const key = this.generateKey('openai_embeddings', text)
    return this.get(key)
  }

  // User tastes caching
  cacheUserTastes(userId, embedding, data) {
    const key = this.generateKey('user_tastes', userId, JSON.stringify(embedding))
    return this.set(key, data, this.defaultTTL.user_tastes)
  }

  getUserTastes(userId, embedding) {
    const key = this.generateKey('user_tastes', userId, JSON.stringify(embedding))
    return this.get(key)
  }

  // Entity search caching
  cacheEntitySearch(query, location, data) {
    const key = this.generateKey('entity_search', query, location || 'global')
    return this.set(key, data, this.defaultTTL.entity_search)
  }

  getEntitySearch(query, location) {
    const key = this.generateKey('entity_search', query, location || 'global')
    return this.get(key)
  }

  /**
   * Cache cleanup - remove expired items
   */
  cleanup() {
    let cleaned = 0
    const now = Date.now()
    
    for (const [key, item] of this.cache.entries()) {
      if (item.ttl && (now - item.timestamp) > item.ttl) {
        this.delete(key)
        cleaned++
      }
    }
    
    if (cleaned > 0) {
      console.log(`🗄️ Cache cleanup: ${cleaned} expired items removed`)
    }
    
    return cleaned
  }

  /**
   * Start periodic cleanup
   */
  startPeriodicCleanup(intervalMs = 5 * 60 * 1000) { // Default: 5 minutes
    setInterval(() => {
      this.cleanup()
    }, intervalMs)
    
    console.log(`🗄️ Periodic cache cleanup started (${intervalMs/1000}s interval)`)
  }
}

// Create singleton instance
const cacheService = new CacheService()

// Start periodic cleanup
cacheService.startPeriodicCleanup()

module.exports = cacheService 
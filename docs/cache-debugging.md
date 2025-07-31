# Cache Debugging Guide

## 🔍 **Cache Issues Identified & Fixed**

### **Problem 1: Inconsistent Cache Key Generation**
**Issue**: The `generateKey` method was using `JSON.stringify()` on objects without sorting keys, causing inconsistent cache keys.

**Fix Applied**: 
```javascript
// BEFORE (Inconsistent)
generateKey(type, ...params) {
  const key = `${type}:${params.join(':')}`
  return key
}

// AFTER (Consistent)
generateKey(type, ...params) {
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
```

### **Problem 2: Missing Debug Logging**
**Issue**: No visibility into cache operations to identify issues.

**Fix Applied**: Added detailed logging for cache operations:
- Cache lookup attempts with key previews
- Cache hit/miss logging
- Cache storage operations with data length

## 🧪 **Testing the Cache**

### **1. Check Cache Stats**
```bash
curl http://localhost:3001/api/cache/stats
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "size": 0,
    "hits": 0,
    "misses": 0,
    "hitRate": 0,
    "memoryUsage": "0 MB",
    "uptime": 123.45,
    "timestamp": "2024-01-01T12:00:00.000Z"
  }
}
```

### **2. Test Basic Cache Functionality**
```bash
curl -X POST http://localhost:3001/api/cache/test \
  -H "Content-Type: application/json" \
  -d '{
    "key": "test:key",
    "value": {"test": "data"},
    "ttl": 60000
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "test": {
    "key": "test:key",
    "originalValue": {"test": "data"},
    "cachedValue": {"test": "data"},
    "setSuccess": true,
    "cacheHit": true,
    "cacheMatch": true
  }
}
```

### **3. Test Cache Hit**
```bash
# Same request again should hit cache
curl -X POST http://localhost:3001/api/cache/test \
  -H "Content-Type: application/json" \
  -d '{
    "key": "test:key",
    "value": {"test": "data"},
    "ttl": 60000
  }'
```

### **4. Clear Cache**
```bash
curl -X POST http://localhost:3001/api/cache/clear
```

## 🔍 **Debugging Steps**

### **Step 1: Check Console Logs**
Look for these log messages in your backend console:

**Cache Operations**:
```
🗄️ Cache service initialized
🔍 Cache lookup for Qloo recommendations: { key: "qloo_recommendations:...", queryKeys: [...], filtersKeys: [...] }
🗄️ Cache miss: qloo_recommendations:...
💾 Caching Qloo recommendations: { key: "qloo_recommendations:...", dataLength: 5, ttl: 900000 }
🗄️ Cached: qloo_recommendations:... (TTL: 900s)
🗄️ Cache hit: qloo_recommendations:...
```

**Missing Logs Indicate**:
- Cache service not initialized
- Cache methods not being called
- Import issues

### **Step 2: Check Cache Integration**
Verify these files have cache imports:

**✅ Required Imports**:
```javascript
// qlooService.js
const cacheService = require('./cacheService');

// openaiService.js  
const cacheService = require('./cacheService');

// recommendationController.js
const cacheService = require('../services/cacheService');
```

### **Step 3: Test Qloo API Caching**
Make a recommendation request and check logs:

1. **First Request**: Should show cache miss and API call
2. **Second Request**: Should show cache hit (if within TTL)

**Expected Log Sequence**:
```
🔍 Cache lookup for Qloo recommendations: {...}
🗄️ Cache miss: qloo_recommendations:...
🔗 Qloo API Request URL: https://api.qloo.com/...
✅ Qloo API Response Status: 200
💾 Caching Qloo recommendations: {...}
🗄️ Cached: qloo_recommendations:... (TTL: 900s)
```

## 🚨 **Common Issues & Solutions**

### **Issue 1: No Cache Logs**
**Symptoms**: No cache-related console logs
**Cause**: Cache service not imported or not being called
**Solution**: Check imports and ensure cache methods are called

### **Issue 2: Cache Misses Every Time**
**Symptoms**: Always shows "Cache miss" even for identical requests
**Cause**: Inconsistent cache key generation
**Solution**: ✅ Fixed with normalized key generation

### **Issue 3: Cache Expires Too Quickly**
**Symptoms**: Cache hits briefly, then misses
**Cause**: TTL too short or cleanup too aggressive
**Solution**: Check TTL values (currently 15 minutes for Qloo recommendations)

### **Issue 4: Memory Issues**
**Symptoms**: High memory usage or crashes
**Cause**: Cache not cleaning up expired items
**Solution**: Check cleanup interval (currently 5 minutes)

## 📊 **Cache Performance Metrics**

### **TTL Values**:
- **Qloo Recommendations**: 15 minutes
- **Qloo Entities**: 30 minutes  
- **OpenAI Embeddings**: 1 hour
- **User Tastes**: 5 minutes
- **Entity Search**: 20 minutes

### **Cleanup Interval**: 5 minutes

### **Expected Performance**:
- **First Request**: API call + cache storage
- **Subsequent Requests**: Cache hit (within TTL)
- **After TTL**: Cache miss + new API call

## 🔧 **Manual Cache Testing**

### **Test Cache with Real Data**:
```bash
# Test Qloo recommendations caching
curl -X POST http://localhost:3001/api/cache/test \
  -H "Content-Type: application/json" \
  -d '{
    "key": "qloo_recommendations:test",
    "value": [{"name": "Test Restaurant", "type": "place"}],
    "ttl": 900000
  }'
```

### **Check Cache Stats After Testing**:
```bash
curl http://localhost:3001/api/cache/stats
```

## 🎯 **Next Steps**

1. **Test Basic Cache**: Use the `/api/cache/test` endpoint
2. **Check Console Logs**: Look for cache operation logs
3. **Test Real Requests**: Make recommendation requests and observe caching
4. **Monitor Performance**: Check cache stats for hit rates

If cache is still not working after these fixes, the issue might be:
- Cache service not properly initialized
- Import/require issues
- Environment-specific problems

---

**Status**: ✅ **FIXED** - Cache key generation improved and debugging added! 
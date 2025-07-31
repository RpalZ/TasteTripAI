# localStorage Recommendation Storage Debugging

## 🔍 **Potential Issues & Solutions**

### **Issue 1: SSR (Server-Side Rendering)**
**Problem**: localStorage is not available during server-side rendering
**Solution**: ✅ Added SSR checks in ChatContext

### **Issue 2: Missing conversationId**
**Problem**: conversationId might be null/undefined when trying to save
**Solution**: ✅ Added conversationId validation and logging

### **Issue 3: localStorage Disabled**
**Problem**: Browser localStorage might be disabled
**Solution**: ✅ Added localStorage availability checks

### **Issue 4: Data Size Too Large**
**Problem**: localStorage has size limits (~5-10MB)
**Solution**: ✅ Added data size logging

## 🧪 **Testing Steps**

### **Step 1: Check Browser Console**
Look for these log messages:

**When Saving**:
```
💾 Saving recommendations to localStorage: { conversationId: "...", recommendationCount: 5, hasConversationId: true }
💾 Attempting to save recommendations: { conversationId: "...", count: 5, key: "tastetrip_recommendations_...", dataSize: 1234 }
✅ Successfully saved recommendations to storage
```

**When Loading**:
```
🔍 Loading recommendations from localStorage for conversation: ...
🔍 Looking for stored recommendations: tastetrip_recommendations_...
📄 Found stored data, parsing...
📚 Successfully loaded recommendations from storage: { conversationId: "...", count: 5, age: "5 minutes" }
🔄 Restoring recommendations from storage: 5
```

**Error Messages**:
```
⚠️ localStorage not available (SSR or disabled)
⚠️ No conversationId available, skipping localStorage save
❌ Failed to save recommendations to storage: [error]
```

### **Step 2: Check Browser DevTools**
1. **Open DevTools** → Application → Storage → Local Storage
2. **Look for keys** starting with `tastetrip_recommendations_`
3. **Check data structure** - should contain:
   ```json
   {
     "recommendations": [...],
     "timestamp": 1234567890,
     "conversationId": "..."
   }
   ```

### **Step 3: Test localStorage Manually**
Add this to your browser console:
```javascript
// Test basic localStorage
localStorage.setItem('test', 'hello')
console.log('localStorage test:', localStorage.getItem('test'))

// Test recommendation storage
const testData = {
  recommendations: [{title: 'Test', type: 'place'}],
  timestamp: Date.now(),
  conversationId: 'test'
}
localStorage.setItem('tastetrip_recommendations_test', JSON.stringify(testData))
console.log('Recommendation test:', localStorage.getItem('tastetrip_recommendations_test'))
```

## 🔧 **Debugging Checklist**

### **✅ Environment Checks**
- [ ] Browser supports localStorage
- [ ] localStorage not disabled in browser settings
- [ ] Not in incognito/private mode (limited storage)
- [ ] Not hitting storage quota limits

### **✅ Code Flow Checks**
- [ ] ChatProvider is wrapping the app
- [ ] useChatContext is being called
- [ ] conversationId is not null/undefined
- [ ] recommendations array is not empty
- [ ] No JavaScript errors in console

### **✅ Storage Checks**
- [ ] localStorage.setItem() succeeds
- [ ] localStorage.getItem() returns data
- [ ] JSON.parse() works on stored data
- [ ] Data structure matches expected format

## 🚨 **Common Problems**

### **Problem 1: "localStorage not available"**
**Cause**: SSR or browser doesn't support localStorage
**Solution**: Check if you're in a browser environment

### **Problem 2: "No conversationId available"**
**Cause**: New conversation hasn't been created yet
**Solution**: Wait for conversation to be created, then try again

### **Problem 3: "Failed to save recommendations"**
**Cause**: Data too large or localStorage quota exceeded
**Solution**: Check data size and browser storage limits

### **Problem 4: "No stored recommendations found"**
**Cause**: Data was never saved or expired
**Solution**: Check if save operation succeeded, verify TTL

## 📊 **Expected Behavior**

### **New Conversation Flow**:
1. User asks for recommendations
2. Backend returns recommendations
3. Frontend saves to localStorage ✅
4. User navigates to detail page
5. User returns to chat
6. Frontend loads from localStorage ✅
7. Recommendations appear instantly

### **Console Log Sequence**:
```
💾 Saving recommendations to localStorage: {...}
💾 Attempting to save recommendations: {...}
✅ Successfully saved recommendations to storage

🔍 Loading recommendations from localStorage for conversation: ...
🔍 Looking for stored recommendations: tastetrip_recommendations_...
📄 Found stored data, parsing...
📚 Successfully loaded recommendations from storage: {...}
🔄 Restoring recommendations from storage: 5
```

## 🎯 **Quick Fixes**

### **If localStorage is disabled**:
- Enable localStorage in browser settings
- Check if in incognito mode
- Try different browser

### **If conversationId is missing**:
- Ensure conversation is created before saving
- Check conversation creation flow

### **If data is too large**:
- Reduce recommendation data size
- Store only essential fields
- Implement data compression

### **If SSR issues**:
- Ensure all localStorage calls are client-side only
- Use useEffect for localStorage operations

## 🔍 **Manual Testing**

### **Test Component**:
Add `<LocalStorageTest />` to any page to test localStorage functionality:

```tsx
import LocalStorageTest from '@/components/LocalStorageTest'

// In your component
<LocalStorageTest />
```

### **Browser Console Test**:
```javascript
// Check localStorage availability
console.log('localStorage available:', typeof localStorage !== 'undefined')

// Check existing data
Object.keys(localStorage).filter(key => key.startsWith('tastetrip_recommendations_'))

// Test storage
localStorage.setItem('test', 'value')
console.log('Test result:', localStorage.getItem('test'))
```

---

**Status**: 🔧 **DEBUGGING** - Enhanced logging and error handling added! 
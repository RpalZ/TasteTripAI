# TasteTrip AI Frontend Documentation

A modern, responsive frontend for TasteTrip AI — your cultural discovery assistant powered by AI taste intelligence.

---

## 🚀 **Phase 5: Multi-Stop Itinerary Planning (Latest Feature)**

### **Complete Trip Planning System**
- **ItineraryPlanner Component**: Full-featured interface for planning multi-destination trips
- **Drag & Drop Interface**: Reorder destinations with intuitive drag-and-drop functionality
- **Google Directions Integration**: Multi-waypoint route calculation with real-time optimization
- **Travel Mode Support**: Driving 🚗, Walking 🚶, Cycling 🚴, Public Transit 🚌
- **Interactive Split-Screen**: Map visualization with destination management sidebar
- **Smart Route Optimization**: Google's waypoint optimization for efficient travel paths
- **Destination Management**: Add via Google Places Autocomplete, set visit duration, add personal notes
- **Export & Share**: Export itineraries as JSON, native Web Share API integration
- **Seamless Integration**: Accessible from recommendation cards and detail pages
- **Auto-Open Functionality**: Direct navigation from recommendation cards to itinerary planner

### **Key Features**
1. **Destination Management**
   - Google Places Autocomplete for easy location search
   - Drag-and-drop reordering of destinations
   - Custom time estimates and personal notes for each stop
   - Remove destinations with one click

2. **Route Calculation & Optimization**
   - Real-time route calculation using Google Directions API
   - Multiple travel modes with instant recalculation
   - Google's intelligent waypoint optimization
   - Detailed route breakdown with distance and time for each leg

3. **Interactive Map Experience**
   - Custom markers for each destination (numbered for sequence)
   - User location marker (green circle)
   - Route visualization with styled polylines
   - Zoom and pan controls with full map interaction

4. **Export & Sharing**
   - Export complete itinerary data as JSON
   - Native Web Share API for social sharing
   - Fallback clipboard copy for older browsers

---

## 🚀 **Original Features**
- Conversational chat interface for natural taste input
- AI-powered cultural recommendations (food, music, travel, etc.)
- Taste memory/history with similarity search
- Google Maps integration for location-based results
- Responsive, mobile-first design
- Real-time loading states and smooth UX

## 🛠 **Tech Stack**
- **Framework:** Next.js 14 (App Router)
- **Styling:** TailwindCSS
- **State Management:** React hooks, Context API
- **HTTP Client:** Axios
- **Maps:** Google Maps Embed API
- **Icons:** Lucide React
- **TypeScript:** Full type safety

## 🏗 **Project Structure**
```
frontend/
├── src/
│   ├── app/                    # Next.js App Router (layout, page, globals.css)
│   ├── components/            # Reusable UI components
│   │   ├── ChatInput.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── RecommendationCard.tsx
│   │   ├── TasteHistory.tsx
│   │   └── MapView.tsx
│   └── utils/                 # Utility functions
│       ├── fetcher.ts         # API client and functions
│       └── formatTaste.ts     # Data formatting utilities
├── public/                    # Static assets
├── next.config.js/ts          # Next.js configuration
└── tailwind.config.js         # Tailwind CSS configuration
```

## 🎨 **Main Components**
- **ChatInput:** User input, auto-resizing, submit on Enter
- **MessageBubble:** Displays chat messages, avatars, timestamps
- **RecommendationCard:** Shows recommendations, icons, actions
- **TasteHistory:** Sidebar with past queries, re-query, filtering
- **MapView:** Google Maps embed, fullscreen, location overlays

## 🔌 **API Integration**
- **Endpoints:**
  - `POST /api/taste` — Submit taste input
  - `GET /api/taste/similar` — Get similar tastes
  - `POST /api/recommend` — Get recommendations
  - `POST /api/booking` — Search bookable locations
- **Auth:** All API calls include the Supabase JWT in the `Authorization` header.
- **Error Handling:** User-friendly messages and loading states for all async operations.

## 🧑‍🚀 **Onboarding Flow**
- After sign up, users are guided through onboarding:
  1. Choose a unique username (stored in Supabase `user_profile` table).
  2. Select interests from a list of topics (e.g., Gaming, Music, Films, etc.).
  3. Preferences are sent to the backend `/api/taste` endpoint and stored as a vector.
  4. On completion, users are redirected to the chat page.

## 🔐 **Authentication**
- Uses Supabase Auth for sign up, sign in, and session management.
- All API calls include the Supabase JWT in the `Authorization` header.
- Auth state is managed with React state and Supabase's `onAuthStateChange` listener for real-time updates.
- Onboarding is only shown after successful sign up and before the user has completed onboarding.
- User profile (username, onboarding status) is stored in the `user_profile` table in Supabase.

## ⚙️ **Environment Variables**
- `NEXT_PUBLIC_API_BASE_URL`: Backend API endpoint
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Google Maps API key
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL (if using auth)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key

## 📦 **Setup Instructions**
1. `cd frontend`
2. `npm install`
3. Copy `.env.local.example` to `.env.local` and fill in your keys
4. `npm run dev` to start the development server
5. Open [http://localhost:3000](http://localhost:3000)

## 🧪 **Testing**
- Run `npm test` for tests (if present)
- Use Postman/Thunderclient for manual API testing

## 📝 **Notes**
- See `docs/checklist.md` for integration checklist
- See `docs/backend-api.md` for backend API details
- See `README.md` in the frontend folder for more details

--- 

## 🎨 **Frontend Enhancements Summary**

### **Phase 3: Enhanced Bookmarking System** ✅

#### **New Components:**
- **`SaveBookmarkButton.tsx`**: Comprehensive bookmark component with multiple variants
  - **Variants**: `icon`, `button`, `full` for different UI contexts
  - **Sizes**: `sm`, `md`, `lg` for different display sizes
  - **States**: Loading, success, error with visual feedback
  - **Features**: Auto-check bookmark status, real-time updates, duplicate handling

- **`BookmarkIndicator.tsx`**: Lightweight indicator for showing bookmark status
  - **Usage**: Display small heart icon when item is bookmarked
  - **Performance**: Only shows when bookmarked, reduces UI clutter

#### **Enhanced User Experience:**
- **Visual Feedback**: Success/error states with auto-dismissing messages
- **Loading States**: Spinner animations during save/remove operations
- **Real-time Updates**: Bookmark status updates immediately across components
- **Error Handling**: Graceful fallbacks for network issues and auth problems
- **Responsive Design**: Works seamlessly across all screen sizes

#### **Integration Points:**
- **Detail Page**: Header icon button + full-width action button
- **Recommendation Cards**: Small icon button in card header
- **Future**: Can be easily added to any component that needs bookmarking

#### **Technical Features:**
- **Supabase Integration**: Uses existing `user_bookmarks` table schema
- **Type Safety**: Full TypeScript support with proper interfaces
- **Performance**: Efficient queries with proper error handling
- **Accessibility**: Proper ARIA labels and keyboard navigation

### **Phase 4.2: Navigation Flow** ✅

#### **Chat State Preservation:**
- **`ChatContext.tsx`**: Global context for preserving chat state across navigation
  - **Session Storage**: Maintains chat state during page refreshes
  - **Scroll Position**: Saves and restores scroll position when navigating
  - **Message History**: Preserves messages and recommendations
  - **Conversation ID**: Tracks current conversation across pages

#### **Smooth Page Transitions:**
- **`PageTransition.tsx`**: Comprehensive transition system
  - **Page Transitions**: Fade and slide effects between routes
  - **Modal Transitions**: Scale and fade for detail pages
  - **Back Button**: Enhanced with exit animations
  - **Performance**: Optimized timing and easing functions

#### **Error Boundaries:**
- **`ErrorBoundary.tsx`**: Comprehensive error handling system
  - **Error Catching**: Catches JavaScript errors in component tree
  - **Fallback UI**: Beautiful error screens with recovery options
  - **Development Mode**: Shows detailed error information for debugging
  - **Specialized Fallbacks**: Chat-specific and page-specific error handling
  - **Async Error Hook**: Handles errors in async operations

#### **Enhanced User Experience:**
- **Navigation Preservation**: Chat state persists when viewing details and returning
- **Smooth Transitions**: Polished animations between all page changes
- **Error Recovery**: Graceful error handling with multiple recovery options
- **Scroll Restoration**: Returns to exact scroll position after navigation
- **Performance**: Optimized with proper cleanup and memory management

### **Animation Improvements**

#### **🎭 CSS Keyframes Added**
```css
@keyframes slideInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-50px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(50px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
```

#### **🎬 Animation Types**
- **Message Animations**: Slide-in from bottom with staggered timing (150ms delays)
- **Recommendation Animations**: Slide-in from right with 200ms delays
- **Container Animations**: Fade-in and slide-up on page load
- **Interactive Animations**: Hover effects with scale, shadow, and movement
- **Loading Animations**: Pulsing effects for recommendation loading

### **State Management**

#### **🔄 New State Variables**
```typescript
const [isRecommending, setIsRecommending] = useState(false)
const [recommendations, setRecommendations] = useState<Recommendation[]>([])
```

#### **📊 State Flow**
1. **User Input** → `isLoading: true`
2. **AI Analysis** → Determine action type
3. **Action Handling** → Switch case execution
4. **UI Updates** → State changes and animations
5. **Completion** → `isLoading: false`, `isRecommending: false`

### **Switch Case Implementation**

#### **🎯 Three Action States**

**1. "recommend" State:**
```javascript
case "recommend":
  setIsRecommending(true)
  // Create taste embedding
  const response = await axios.post('/api/taste', {input: recommendQuery}, header)
  // Get recommendations
  const recommendResponse = await axios.post('/api/recommend', embed, header)
  // Format and display results
  setRecommendations(recommendationArr)
  setIsRecommending(false)
  break;
```

**2. "analyze" State:**
```javascript
case "analyze":
  // Store user preferences in vector database
  const response1 = await axios.post('/api/taste', {input}, header)
  break;
```

**3. "idle" State (default):**
```javascript
default:
  // General conversation - no backend API calls
  console.trace('idling')
  break;
```

#### **🔧 Technical Implementation**

**Recommendation Flow:**
1. **Set loading state**: `setIsRecommending(true)`
2. **Create embedding**: POST to `/api/taste` with `recommendQuery`
3. **Get recommendations**: POST to `/api/recommend` with embedding
4. **Format results**: Map API response to recommendation cards
5. **Update UI**: `setRecommendations(recommendationArr)`
6. **Clear loading**: `setIsRecommending(false)`

**Data Structure:**
```typescript
interface Recommendation {
  title: string
  type: string
  description: string
  location?: string
  lat?: number
  lng?: number
}
```

### **UI Components**

#### **💬 Chat Interface**
- **Message Bubbles**: Animated slide-in with staggered timing
- **Loading States**: "Thinking" message for general loading
- **Recommendation Loading**: "Finding recommendations..." with pulse animation
- **Input Handling**: Disabled during loading states

#### **🎯 Recommendations Panel**
- **Empty State**: "Recommendations will appear here" with fade-in
- **Loading State**: "Finding recommendations..." with pulsing animation
- **Results State**: Recommendation cards with slide-in from right
- **Responsive Design**: Adapts to different screen sizes

#### **🔘 Interactive Elements**
- **Back Button**: Hover effects with scale and left movement
- **New Conversation Button**: Hover effects with scale and upward movement
- **Smooth Transitions**: 300ms duration with ease-in-out timing

### **Loading State Management**

#### **🎭 Loading States**
```javascript
// General chat loading
{isLoading && (
  <MessageBubble
    message={{
      id: 'loading',
      type: 'ai',
      content: 'Thinking',
      timestamp: new Date()
    }}
    isLoading={true}
  />
)}

// Recommendation-specific loading
{isRecommending ? (
  <div className="pulse-animation">
    Finding recommendations for you...
  </div>
) : recommendations.length > 0 ? (
  // Show recommendations
) : (
  // Show empty state
)}
```

#### **🔄 State Reset Logic**
- **Error handling**: Resets all loading states on errors
- **New conversation**: Clears recommendations and loading states
- **Completion**: Proper cleanup after API calls

### **System Prompt Integration**

#### **🎯 TasteTrip AI Concept**
The system prompt now bridges cultural tastes with travel experiences:

**Taste Analysis Categories** (for understanding user preferences):
- **Artists** (musicians, bands, singers)
- **Books** (fiction, non-fiction, genres)
- **Brands** (companies, products, services)
- **Movies** (films, cinema, genres)
- **TV Shows** (television series, streaming content)
- **Podcasts** (audio content, shows, series)
- **Video Games** (gaming, interactive entertainment)

**Recommendation Categories** (what can be recommended):
- **Destinations** (cities, countries, travel locations, regions)
- **Places** (restaurants, venues, attractions, hotels, points of interest)

**Concept**: Analyze cultural tastes → Recommend relevant travel experiences

#### **📝 Response Format**
```typescript
interface gptResponse {
  message: string,
  action: {
    toolcall: "recommend" | "idle" | "analyze",
    recommendQuery?: string,
    toAnalyze?: string
  }
}
```

**Action Properties:**
- **recommendQuery**: Concise summary of what the user wants recommended (for "recommend" action)
- **toAnalyze**: Concise summary of user's cultural preferences to be analyzed (for "analyze" action)

### **Error Handling**

#### **🛡️ Error Management**
- **API Errors**: Graceful fallback with user-friendly messages
- **Network Issues**: Proper error logging and user notification
- **State Recovery**: Automatic cleanup of loading states
- **User Feedback**: Clear error messages in chat interface

### **Performance Optimizations**

#### **⚡ Frontend Performance**
- **Hardware Acceleration**: Using `transform` properties for animations
- **Efficient Re-renders**: Proper state management to minimize updates
- **Smooth 60fps**: Optimized animation timing functions
- **Reduced Layout Thrashing**: Proper animation properties

### **User Experience Improvements**

#### **🎨 Visual Enhancements**
- **Polished Animations**: Professional, smooth transitions
- **Visual Feedback**: Clear indication of loading states
- **Engaging Interactions**: Responsive hover effects
- **Staggered Timing**: Natural, flowing appearance

#### **📱 Responsive Design**
- **Mobile Friendly**: Adapts to different screen sizes
- **Touch Optimized**: Proper touch targets and interactions
- **Accessibility**: Proper ARIA labels and keyboard navigation

### **Debugging Features**

#### **🔍 Development Tools**
- **Console Logging**: Comprehensive state change tracking
- **Error Tracking**: Detailed error logging for debugging
- **State Monitoring**: useEffect hooks for state debugging
- **Performance Monitoring**: Animation performance tracking

### **Key Benefits**

#### **🚀 Performance**
- **Smooth Animations**: 60fps performance with hardware acceleration
- **Efficient State Management**: Minimal re-renders and updates
- **Fast Loading**: Optimized loading states and transitions

#### **🎯 User Experience**
- **Engaging Interface**: Smooth animations and interactions
- **Clear Feedback**: Appropriate loading states for each action
- **Intuitive Flow**: Natural conversation and recommendation flow
- **Professional Feel**: Polished, modern interface design

#### **🔧 Developer Experience**
- **Clean Code**: Well-structured component architecture
- **Easy Debugging**: Comprehensive logging and error handling
- **Maintainable**: Clear separation of concerns and state management
- **Scalable**: Easy to add new features and animations

### **Future Enhancements**

#### **🔄 Planned Improvements**
- **Advanced Animations**: More sophisticated animation sequences
- **Real-time Updates**: WebSocket integration for live updates
- **Offline Support**: Service worker for offline functionality
- **Accessibility**: Enhanced screen reader and keyboard support 

---

# Frontend Architecture Documentation

## Core Components

### Chat System
- **ChatWelcome**: Initial landing interface for new conversations
- **ChatInterface**: Main chat component with message handling and recommendations
- **MessageBubble**: Individual message display component
- **ChatInput**: User input component with submission handling

### Recommendation System
- **RecommendationCard**: Displays individual recommendations with actions
- **GoogleMap**: Interactive map component with multiple view modes
- **DirectionsMap**: Specialized map for showing directions between points

### Navigation & UX
- **Navigation**: App-wide navigation component
- **ThemeContext**: Dark/light mode management
- **ChatContext**: Global state management for chat sessions
- **PageTransition**: Smooth transitions between pages

### Data Management
- **supabaseClient**: Database and authentication
- **openaiClient**: AI conversation management
- **fetcher**: API request utilities

## Recent Enhancements

### Phase 3: Bookmarking System
- **SaveBookmarkButton**: Handles bookmark save/remove with visual feedback
- **BookmarkIndicator**: Shows bookmark status with real-time updates
- **Integration**: Connected to Supabase `user_bookmarks` table
- **Real-time**: Supabase subscriptions for live bookmark updates

### Phase 4: Recommendation Detail Pages

#### 4.1 Enhanced UI Components
- **PhotoGallery**: Interactive image gallery with modal view
- **LoadingSkeleton**: Various loading states (text, card, image, etc.)
- **DetailPageSkeleton**: Full-page loading for recommendation details
- **WeatherOverlay**: Weather information display on maps

#### 4.2 Navigation Flow
- **ChatContext**: Preserves chat state across navigation
- **ModalPageTransition**: Smooth page transitions for detail views
- **TransitionBackButton**: Animated back navigation
- **useScrollPreservation**: Maintains scroll position when returning

### Phase 5: Performance & UX

#### 5.1 Recommendation Storage System ✨
- **LocalStorage Persistence**: Recommendations saved per conversation
- **Automatic Restoration**: Instant reload when returning from detail pages
- **Smart Expiration**: 24-hour automatic cleanup
- **Memory Management**: Auto-cleanup on conversation deletion

#### 5.2 Error Handling & Reliability
- **ErrorBoundary**: Comprehensive error catching and recovery
- **Graceful Fallbacks**: Robust handling of API failures
- **Async Error Handling**: useAsyncError hook for async operations

### Latest Fix: Recommendation Response Error Handling 🔧

#### **Problem Identified**:
```javascript
// Error: Cannot read properties of undefined (reading '0')
description: recommendResponse.data.explanation?.recommendations[i]
```

#### **Root Cause**:
- Backend `explanation` field can be either:
  - **JSON Object** (when GPT response parses successfully): `{ recommendations: [...] }`
  - **Raw String** (when GPT response parsing fails): `"Here are your recommendations..."`
- Frontend code assumed `explanation.recommendations` would always exist as an array

#### **Solution Implemented**:

1. **Enhanced Error Detection**:
```javascript
// Check if results exist and is an array
if (!recommendResponse.data.results || !Array.isArray(recommendResponse.data.results)) {
  console.error('❌ Invalid results structure:', recommendResponse.data.results);
  aiContent = "I encountered an issue processing the recommendations. Please try your request again.";
  setRecommendations([]);
  setIsRecommending(false);
  break;
}
```

2. **Safe Description Access**:
```javascript
// Safely access the description with fallback
const description = recommendResponse.data.explanation?.recommendations?.[i] || 
                   `${m.name || 'Unknown Place'} - A great place to visit based on your preferences.`;
```

3. **Comprehensive Null Checks**:
```javascript
return {
  title: m.name || 'Unknown Place',
  type: m.subtype?.split(':').pop() || 'place',
  description: description,
  location: m.properties?.address || m.address || 'Location not specified',
  lat: m.location?.lat || null,
  lng: m.location?.lon || null,
  entity_id: m.entity_id || `unknown_${i}`,
  // ... more fields with fallbacks
}
```

4. **Individual Item Error Handling**:
```javascript
try {
  // Process recommendation item
  return { /* recommendation object */ }
} catch (itemError) {
  console.error('❌ Error processing recommendation item:', itemError, m);
  return {
    title: 'Error Loading Recommendation',
    type: 'place',
    description: 'This recommendation could not be loaded properly.',
    // ... error fallback object
  }
}
```

5. **Enhanced Debug Logging**:
```javascript
console.log('🔍 Full recommendation response:', recommendResponse.data);
console.log('📊 Results array:', recommendResponse.data.results);
console.log('📝 Explanation object:', recommendResponse.data.explanation);
console.log('📋 Recommendations array:', recommendResponse.data.explanation?.recommendations);
```

#### **Benefits**:
- **🛡️ Crash Prevention**: No more undefined property errors
- **🔄 Graceful Degradation**: Always shows recommendations, even with missing data
- **🔍 Better Debugging**: Comprehensive logging for troubleshooting
- **📱 Improved UX**: Users see helpful messages instead of crashes
- **🏗️ Robust Architecture**: Handles all backend response variations

#### **Testing Recommendations**:
1. Test with normal "sushi places" query → Should work perfectly
2. Test with edge cases that might cause backend parsing failures
3. Check browser console for detailed logging information
4. Verify fallback descriptions appear when explanation array is missing

---

**Status**: ✅ **FIXED** - Recommendation processing now handles all response variations robustly! 
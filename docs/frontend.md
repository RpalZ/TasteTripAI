# TasteTrip AI Frontend Documentation

A modern, responsive frontend for TasteTrip AI — your cultural discovery assistant powered by AI taste intelligence.

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
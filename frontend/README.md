# TasteTrip AI Frontend

A modern, responsive frontend for TasteTrip AI - your cultural discovery assistant powered by AI taste intelligence.

## 🚀 Features

- **Conversational Interface**: Chat-style interaction for natural taste input
- **Smart Recommendations**: AI-powered cultural suggestions across food, music, travel, and more
- **Taste Memory**: Persistent history of user preferences with similarity search
- **Interactive Maps**: Google Maps integration for location-based recommendations
- **Responsive Design**: Mobile-first design that scales beautifully to desktop
- **Real-time Updates**: Loading states and smooth transitions for better UX

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: TailwindCSS with custom components
- **State Management**: React hooks and Context API
- **HTTP Client**: Axios with interceptors
- **Maps**: Google Maps Embed API
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## 📦 Installation

1. **Clone and navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your environment variables:
   - `NEXT_PUBLIC_API_BASE_URL`: Your backend API URL
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Google Maps API key

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css        # Global styles and Tailwind
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Main application page
│   ├── components/            # Reusable UI components
│   │   ├── ChatInput.tsx      # User input interface
│   │   ├── MessageBubble.tsx  # Chat message display
│   │   ├── RecommendationCard.tsx # Cultural recommendation cards
│   │   ├── TasteHistory.tsx   # Sidebar with taste history
│   │   └── MapView.tsx        # Google Maps integration
│   └── utils/                 # Utility functions
│       ├── fetcher.ts         # API client and functions
│       └── formatTaste.ts     # Data formatting utilities
├── public/                    # Static assets
├── next.config.js            # Next.js configuration
└── tailwind.config.js        # Tailwind CSS configuration
```

## 🎨 Component Overview

### ChatInput
- Auto-resizing textarea for user input
- Submit on Enter, disabled state during loading
- Voice input button (UI ready for future implementation)

### MessageBubble
- Displays user and AI messages with avatars
- Supports loading states with animated dots
- Timestamps and responsive layout

### RecommendationCard
- Beautiful cards for cultural recommendations
- Category icons and color coding
- Like/save functionality and map integration
- Action buttons for booking and learning more

### TasteHistory
- Searchable sidebar with past taste queries
- Re-query functionality for previous tastes
- Category filtering and management options

### MapView
- Google Maps embed with fullscreen support
- Direct links to Google Maps for navigation
- Location overlay with recommendation details

## 🔌 API Integration

The frontend integrates with the TasteTrip AI backend through these endpoints:

- `POST /api/taste` - Submit taste input
- `GET /api/taste/similar` - Get similar past tastes
- `POST /api/recommend` - Get AI recommendations
- `POST /api/booking` - Search bookable locations

All API calls include proper error handling, loading states, and authentication headers.

## 🎯 Key Features

### Responsive Design
- Mobile-first approach with breakpoints for tablet and desktop
- Collapsible sidebar on mobile with hamburger menu
- Touch-friendly interactions and proper spacing

### User Experience
- Smooth animations and transitions
- Loading states for all async operations
- Error handling with user-friendly messages
- Keyboard shortcuts and accessibility features

### Performance
- Optimized bundle size with proper code splitting
- Lazy loading for maps and heavy components
- Efficient state management and re-renders

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
npx vercel --prod
```

### Netlify
```bash
npm run build
# Deploy the `out` directory
```

### Docker
```bash
docker build -t tastetrip-frontend .
docker run -p 3000:3000 tastetrip-frontend
```

## 🔧 Configuration

### Environment Variables
- `NEXT_PUBLIC_API_BASE_URL`: Backend API endpoint
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Google Maps API key
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL (if using auth)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key

### Tailwind Configuration
Custom design system with:
- Color palette optimized for cultural content
- Typography scale for readability
- Component classes for consistency
- Responsive breakpoints

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🆘 Support

For support and questions:
- Check the [backend API documentation](../docs/backend-api.md)
- Review the [setup guide](../docs/setup.md)
- Open an issue on GitHub

---

Built with ❤️ for cultural discovery and AI-powered recommendations.
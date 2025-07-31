# Google Maps Platform API Integration

## 🗺️ **Overview**

The enhanced GoogleMap component now integrates with real Google Maps Platform APIs to provide live data for:

- **Air Quality** - Real-time air quality index and health recommendations
- **Weather Radar** - Current weather conditions, temperature, humidity, and wind speed
- **Traffic** - Real-time traffic conditions (simulated with fallback)
- **Nearby Places** - Points of interest around the recommendation location
- **Elevation** - Terrain elevation data

## 🎨 **Dark Mode Support**

The component now uses CSS variables for consistent theming:

- **Background Colors**: `var(--color-card-bg)` for panels and overlays
- **Text Colors**: `var(--color-text-secondary)` for secondary text
- **Border Colors**: `var(--color-card-border)` for borders
- **Secondary Backgrounds**: `var(--color-bg-secondary)` for button backgrounds

This ensures seamless integration with the app's theme system and automatic dark/light mode switching.

## 🔑 **API Setup**

### **1. Enable Required APIs**

In your Google Cloud Console, enable these APIs:

#### **Core APIs:**
- **Maps JavaScript API** - For the base map functionality
- **Places API** - For nearby places search
- **Geocoding API** - For address lookups
- **Elevation API** - For terrain elevation data

#### **Environment APIs:**
- **Air Quality API** - For real-time air quality data
- **Weather API (Preview)** - For weather conditions

### **2. API Key Configuration**

Add your Google Maps API key to your environment variables:

```env
# .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### **3. API Quotas & Billing**

Ensure your Google Cloud project has:
- **Billing enabled** (required for most APIs)
- **Sufficient quotas** for your expected usage
- **API restrictions** configured for security

## 🚀 **Features**

### **Air Quality API** 🌬️
```typescript
// Fetches real-time air quality data
const airQualityData = await getAirQuality(lat, lng);
```

**Returns:**
- AQI (Air Quality Index) - Over 70 local indexes available
- Category (Good, Moderate, Unhealthy, etc.)
- Color-coded indicators
- Health recommendations for different population groups
- Pollutant concentrations (CO, NO2, O3, PM10, PM2.5, SO2)

**Coverage:** Over 100 countries with 500x500 meter resolution

### **Weather API (Preview)** ☁️
```typescript
// Fetches current weather conditions
const weatherData = await getWeather(lat, lng);
```

**Returns:**
- Temperature (Celsius)
- Weather condition
- Humidity percentage
- Wind speed
- Weather icon

### **Places API** 🏪
```typescript
// Fetches nearby points of interest
const nearbyPlaces = await getNearbyPlaces(lat, lng, radius);
```

**Returns:**
- Place names and types
- Distance from location
- Ratings (if available)
- Coordinates for markers

### **Elevation API** ⛰️
```typescript
// Fetches terrain elevation
const elevationData = await getElevation(lat, lng);
```

**Returns:**
- Elevation in meters
- Unit specification

## 🔧 **Implementation Details**

### **API Service Functions**

All API calls are centralized in `frontend/src/utils/googleMapsApi.ts`:

```typescript
// Air Quality
export const getAirQuality = async (lat: number, lng: number)

// Weather
export const getWeather = async (lat: number, lng: number)

// Nearby Places
export const getNearbyPlaces = async (lat: number, lng: number, radius?: number)

// Elevation
export const getElevation = async (lat: number, lng: number)

// Traffic (simulated)
export const getTrafficData = async (lat: number, lng: number)
```

### **Data Formatting**

Each API has a corresponding formatter function:

```typescript
// Format raw API responses into usable data
export const formatAirQualityData = (data: any) => AirQualityData
export const formatWeatherData = (data: any) => WeatherData
export const formatNearbyPlacesData = (data: any) => NearbyPlace[]
export const formatElevationData = (data: any) => ElevationData
```

### **Error Handling**

All API calls include:
- **Try-catch blocks** for error handling
- **Fallback to mock data** when APIs fail
- **Loading states** for user feedback
- **Console logging** for debugging

## 🎯 **User Experience**

### **Loading States**
- Buttons show "Loading..." during API calls
- Buttons are disabled during requests
- Visual feedback with opacity changes

### **Fallback Behavior**
- If APIs fail, mock data is displayed
- Users see "data temporarily unavailable" messages
- App continues to function normally

### **Real-time Data**
- Air quality updates based on location
- Weather conditions reflect current time
- Nearby places sorted by distance
- Elevation data for terrain context

## 📊 **API Response Examples**

### **Air Quality Response**
```json
{
  "indexes": [{
    "code": "uaqi",
    "displayName": "Universal AQI",
    "aqi": 45,
    "category": "Good",
    "dominantPollutant": "PM2.5"
  }],
  "pollutants": [{
    "code": "pm25",
    "displayName": "PM2.5",
    "concentration": {
      "value": 2.83,
      "units": "MICROGRAMS_PER_CUBIC_METER"
    }
  }],
  "healthRecommendations": {
    "generalPopulation": "Air quality is good. Enjoy outdoor activities.",
    "elderly": "Air quality is good for elderly individuals."
  }
}
```

### **Weather Response**
```json
{
  "currentConditions": [{
    "temperature": 22.5,
    "condition": "Partly Cloudy",
    "humidity": 65,
    "windSpeed": 12.3,
    "iconCode": "partly_cloudy"
  }]
}
```

### **Places Response**
```json
{
  "places": [{
    "displayName": {
      "text": "Starbucks Coffee"
    },
    "types": ["cafe", "food", "establishment"],
    "location": {
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "rating": 4.2
  }]
}
```

## 🔒 **Security Considerations**

### **API Key Protection**
- Use environment variables for API keys
- Set up API key restrictions in Google Cloud Console
- Limit API key to specific domains/IPs
- Monitor API usage for unusual activity

### **Rate Limiting**
- Implement client-side rate limiting
- Handle API quota exceeded errors
- Provide fallback data when limits are reached

## 🚀 **Next Steps**

### **Potential Enhancements**
1. **Caching** - Cache API responses to reduce calls
2. **Real-time Updates** - Poll APIs for live updates
3. **Historical Data** - Show trends over time
4. **Advanced Traffic** - Integrate with Maps JavaScript API traffic layer
5. **Custom Markers** - Enhanced POI markers with photos

### **Performance Optimization**
1. **Lazy Loading** - Only fetch data when features are enabled
2. **Request Batching** - Combine multiple API calls
3. **Response Compression** - Optimize data transfer
4. **CDN Integration** - Use Google's CDN for faster responses

## 📝 **Troubleshooting**

### **Common Issues**

**API Key Errors:**
- Verify API key is correct
- Check API key restrictions
- Ensure billing is enabled

**CORS Errors:**
- Configure allowed origins in Google Cloud Console
- Use server-side proxy if needed

**Rate Limit Errors:**
- Implement exponential backoff
- Add request queuing
- Monitor API quotas

**Data Format Issues:**
- Check API response structure
- Update formatter functions
- Handle missing data gracefully

---

**Status**: ✅ **LIVE** - Real Google Maps Platform APIs integrated with comprehensive dark mode support! 
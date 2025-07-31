# Google Maps Platform API Troubleshooting Guide

This guide helps you troubleshoot common issues with Google Maps Platform APIs in the TasteTrip AI application.

## Common Issues

### 1. "Failed to fetch" Error

**Symptoms:**
- Weather Radar or Air Quality buttons show "Failed to fetch" in console
- Network errors in browser developer tools

**Causes:**
- API key not configured or invalid
- Required APIs not enabled in Google Cloud Console
- Billing not set up
- CORS issues
- Incorrect request format

**Solutions:**

#### API Key Issues:
1. **Check API Key**: Ensure `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set in your environment variables
2. **Verify API Key**: Test your API key in the [Google Cloud Console](https://console.cloud.google.com/)
3. **Check Restrictions**: Ensure your API key has the correct restrictions (HTTP referrers, IP addresses)

#### API Enablement:
1. **Enable Required APIs** in Google Cloud Console:
   - Maps JavaScript API
   - Places API
   - Geocoding API
   - Weather API (Preview)
   - Air Quality API
   - Elevation API

#### Billing Setup:
1. **Enable Billing**: Google Maps Platform requires billing to be enabled
2. **Check Quotas**: Ensure you haven't exceeded free tier limits

#### Request Format Issues:
- **Weather API**: Uses GET requests with URL parameters (fixed in latest update)
- **Air Quality API**: Uses POST requests with JSON body (correct format)
- **Places API**: Uses POST requests with JSON body

### 2. 403 Forbidden Error

**Symptoms:**
- API returns 403 status code
- "Access denied" or "API key not valid" messages

**Causes:**
- API key doesn't have required permissions
- API not enabled for the project
- Billing not enabled
- API key restrictions too strict

**Solutions:**
1. **Check API Permissions**: Ensure your API key has access to all required APIs
2. **Enable APIs**: Go to Google Cloud Console → APIs & Services → Library
3. **Check Billing**: Ensure billing is enabled for your project
4. **Review Restrictions**: Temporarily remove API key restrictions for testing

### 3. 400 Bad Request Error

**Symptoms:**
- API returns 400 status code
- "Invalid request" messages

**Causes:**
- Incorrect request parameters
- Malformed request body
- Invalid coordinates

**Solutions:**
1. **Check Parameters**: Ensure latitude/longitude are valid numbers
2. **Validate Coordinates**: Ensure coordinates are within valid ranges
3. **Check Request Format**: Verify request method and body format

### 4. 429 Rate Limit Exceeded

**Symptoms:**
- API returns 429 status code
- "Quota exceeded" messages

**Causes:**
- Exceeded API quota limits
- Too many requests in short time period

**Solutions:**
1. **Check Quotas**: Review your usage in Google Cloud Console
2. **Implement Caching**: Cache API responses to reduce requests
3. **Add Delays**: Implement rate limiting in your application
4. **Upgrade Plan**: Consider upgrading your billing plan

## Debugging Steps

### 1. Check Browser Console
```javascript
// Look for these console messages:
🌤️ Weather API URL: https://weather.googleapis.com/v1/currentConditions:lookup?key=...
🌬️ Air Quality API URL: https://airquality.googleapis.com/v1/currentConditions:lookup?key=...
✅ Weather API response received: {...}
❌ Weather API error: 403 - ...
```

### 2. Test API Key Manually
```bash
# Test Weather API
curl -X GET "https://weather.googleapis.com/v1/currentConditions:lookup?key=YOUR_API_KEY&location.latitude=37.4220&location.longitude=-122.0841"

# Test Air Quality API
curl -X GET "https://airquality.googleapis.com/v1/currentConditions:lookup?key=YOUR_API_KEY&location.latitude=37.4220&location.longitude=-122.0841"
```

### 3. Check Network Tab
1. Open browser Developer Tools
2. Go to Network tab
3. Click Weather Radar or Air Quality button
4. Look for failed requests and error details

## Quick Fixes

### 1. Environment Variables
```bash
# .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### 2. API Enablement Checklist
- [ ] Maps JavaScript API
- [ ] Places API
- [ ] Geocoding API
- [ ] Weather API (Preview)
- [ ] Air Quality API
- [ ] Elevation API

### 3. Billing Setup
- [ ] Enable billing for Google Cloud project
- [ ] Set up payment method
- [ ] Check quota limits

## API Setup Checklist

### Google Cloud Console Setup:
1. **Create Project**: Create a new Google Cloud project
2. **Enable Billing**: Set up billing for the project
3. **Create API Key**: Generate an API key
4. **Enable APIs**: Enable all required APIs
5. **Set Restrictions**: Configure API key restrictions (optional but recommended)

### Environment Setup:
1. **Add API Key**: Add to `.env.local` file
2. **Restart Server**: Restart your development server
3. **Test APIs**: Test each API endpoint manually

### Common API Endpoints:
- **Weather**: `https://weather.googleapis.com/v1/currentConditions:lookup`
- **Air Quality**: `https://airquality.googleapis.com/v1/currentConditions:lookup`
- **Places**: `https://places.googleapis.com/v1/places:searchNearby`
- **Elevation**: `https://maps.googleapis.com/maps/api/elevation/json`

## Recent Fixes

### Weather API Request Format (Latest Update)
**Problem**: Weather API was using incorrect POST request format
**Solution**: Updated to use GET request with URL parameters as per [Google Weather API documentation](https://developers.google.com/maps/documentation/weather/current-conditions)

**Before:**
```javascript
// Incorrect POST request
const response = await fetch(url, {
  method: 'POST',
  body: JSON.stringify({ location: { latitude: lat, longitude: lng } })
});
```

**After:**
```javascript
// Correct GET request with URL parameters
const url = `https://weather.googleapis.com/v1/currentConditions:lookup?key=${API_KEY}&location.latitude=${lat}&location.longitude=${lng}`;
const response = await fetch(url, { method: 'GET' });
```

### Air Quality API Request Format (Corrected)
**Note**: Air Quality API correctly uses POST request with JSON body as per [Google Air Quality API documentation](https://developers.google.com/maps/documentation/air-quality/current-conditions)

**Correct Format:**
```javascript
// Correct POST request with JSON body
const response = await fetch(
  `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${API_KEY}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: { latitude: lat, longitude: lng },
      extraComputations: ['HEALTH_RECOMMENDATIONS', 'DOMINANT_POLLUTANT_CONCENTRATION'],
      languageCode: 'en'
    })
  }
);
```

These fixes resolve the "Failed to fetch" errors for both Weather Radar and Air Quality functionality.
# 3D Map Setup Guide

## Overview

The application now supports 3D map functionality with tilt controls and 3D buildings. This feature requires a Google Maps Map ID with 3D buildings enabled.

## Prerequisites

1. **Google Cloud Console Access**: You need access to the Google Cloud Console where your Maps API key is configured.
2. **Maps JavaScript API**: Ensure the Maps JavaScript API is enabled in your project.

## Setting Up Map ID for 3D Features

### Step 1: Create a Map ID

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** > **Credentials**
4. Click **+ CREATE CREDENTIALS** > **Map ID**
5. Give your Map ID a name (e.g., "3d-buildings")
6. Click **CREATE**

### Step 2: Enable 3D Buildings

1. After creating the Map ID, click on it to open the details
2. In the **Map features** section, ensure **3D buildings** is enabled
3. You can also enable other features like:
   - **Advanced markers**
   - **Vector tiles**
   - **Custom styling**

### Step 3: Configure Environment Variable

Add the Map ID to your environment variables:

```env
# .env.local (for development)
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=your-map-id-here

# .env (for production)
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=your-map-id-here
```

Replace `your-map-id-here` with the actual Map ID you created (e.g., `3d-buildings`).

## How 3D Mode Works

### Activation
- Click the **3D** button in the map controls panel
- The map will switch to 3D mode with a default 45° tilt
- 3D buildings will be rendered if available in the area

### Controls
- **Tilt Slider**: Adjust the tilt angle from 0° to 67.5°
- **Reset 3D View**: Return to the default 45° tilt
- **Map Type**: Switch between different map types while maintaining 3D mode

### Technical Details

The 3D functionality uses:
- **Vector Rendering**: `renderingType: google.maps.RenderingType.VECTOR`
- **Map ID**: Enables 3D buildings and advanced features
- **Tilt Control**: `map.setTilt(angle)` method
- **Heading Control**: For rotation (currently set to 0)

## Troubleshooting

### Map Not Tilting
1. **Check Map ID**: Ensure `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` is set correctly
2. **Verify 3D Buildings**: Confirm 3D buildings are enabled in your Map ID settings
3. **Browser Support**: Ensure you're using a modern browser that supports WebGL
4. **Location**: 3D buildings are only available in certain areas (primarily urban centers)

### Console Errors
- If you see errors about `RenderingType.VECTOR`, ensure the Google Maps JavaScript API is properly loaded
- Check that your API key has the necessary permissions

### Fallback Behavior
- If 3D buildings are not available in the current area, the map will still tilt but without 3D building rendering
- The tilt functionality will work regardless of 3D building availability

## Example Map ID Configuration

```json
{
  "mapId": "3d-buildings",
  "features": {
    "3dBuildings": true,
    "advancedMarkers": true,
    "vectorTiles": true
  }
}
```

## Related Files

- `frontend/src/components/GoogleMap.tsx`: Main 3D map implementation
- `docs/google-maps-api-integration.md`: General Google Maps API setup
- `docs/google-maps-api-troubleshooting.md`: Troubleshooting guide 
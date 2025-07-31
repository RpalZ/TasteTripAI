// Google Maps Platform API utilities
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// Air Quality API
export const getAirQuality = async (lat: number, lng: number): Promise<any> => {
  try {
    // Check if API key is available
    if (!GOOGLE_MAPS_API_KEY) {
      console.warn('⚠️ Google Maps API key not found. Using fallback air quality data.');
      return null;
    }

    console.log('🌬️ Attempting to fetch air quality data from Google Air Quality API...');
    
    // Use POST request with JSON body as per Google Air Quality API documentation
    const response = await fetch(
      `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${GOOGLE_MAPS_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: {
            latitude: lat,
            longitude: lng
          },
          extraComputations: ['HEALTH_RECOMMENDATIONS', 'DOMINANT_POLLUTANT_CONCENTRATION'],
          languageCode: 'en'
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Air Quality API error: ${response.status} - ${errorText}`);
      
      // Check for specific error types
      if (response.status === 403) {
        console.error('❌ API key may not have Air Quality API enabled or billing not set up');
      } else if (response.status === 400) {
        console.error('❌ Invalid request parameters');
      } else if (response.status === 429) {
        console.error('❌ Rate limit exceeded');
      }
      
      return null;
    }

    const data = await response.json();
    console.log('✅ Air Quality API response received:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching air quality data:', error);
    
    // Log specific error details
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('❌ Network error - check internet connection and CORS settings');
    } else if (error instanceof Error) {
      console.error('❌ Error details:', error.message);
    }
    
    return null;
  }
};

// Weather API
export const getWeather = async (lat: number, lng: number): Promise<any> => {
  try {
    // Check if API key is available
    if (!GOOGLE_MAPS_API_KEY) {
      console.warn('⚠️ Google Maps API key not found. Using fallback weather data.');
      return null;
    }

    console.log('🌤️ Attempting to fetch weather data from Google Weather API...');
    
    // Use GET request with URL parameters as per Google Weather API documentation
    const url = `https://weather.googleapis.com/v1/currentConditions:lookup?key=${GOOGLE_MAPS_API_KEY}&location.latitude=${lat}&location.longitude=${lng}`;
    
    console.log('🌤️ Weather API URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Weather API error: ${response.status} - ${errorText}`);
      
      // Check for specific error types
      if (response.status === 403) {
        console.error('❌ API key may not have Weather API enabled or billing not set up');
      } else if (response.status === 400) {
        console.error('❌ Invalid request parameters');
      } else if (response.status === 429) {
        console.error('❌ Rate limit exceeded');
      }
      
      return null;
    }

    const data = await response.json();
    console.log('✅ Weather API response received:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching weather data:', error);
    
    // Log specific error details
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('❌ Network error - check internet connection and CORS settings');
    } else if (error instanceof Error) {
      console.error('❌ Error details:', error.message);
    }
    
    return null;
  }
};

// Places API - Nearby Search
export const getNearbyPlaces = async (lat: number, lng: number, radius: number = 1000): Promise<any> => {
  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places:searchNearby?key=${GOOGLE_MAPS_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          locationRestriction: {
            circle: {
              center: {
                latitude: lat,
                longitude: lng
              },
              radius: radius
            }
          },
          rankPreference: 'DISTANCE',
          maxResultCount: 10
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Places API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    return null;
  }
};

// Elevation API
export const getElevation = async (lat: number, lng: number): Promise<any> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/elevation/json?locations=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Elevation API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching elevation data:', error);
    return null;
  }
};

// Traffic API (using Maps JavaScript API)
export const getTrafficData = async (lat: number, lng: number): Promise<any> => {
  try {
    // For traffic data, we'll use the Maps JavaScript API
    // This is typically handled client-side, but we can make a request to get traffic info
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Traffic API error: ${response.status}`);
    }

    const data = await response.json();
    
    // For now, we'll simulate traffic data since real-time traffic requires client-side implementation
    // In a real implementation, you'd use the Maps JavaScript API with traffic layer
    return {
      level: ['low', 'medium', 'high', 'severe'][Math.floor(Math.random() * 4)],
      description: 'Traffic data available via Maps JavaScript API',
      color: '#00ff00'
    };
  } catch (error) {
    console.error('Error fetching traffic data:', error);
    return null;
  }
};

// Helper function to format air quality data
export const formatAirQualityData = (data: any) => {
  if (!data || !data.indexes || data.indexes.length === 0) {
    return null;
  }

  const aqi = data.indexes[0];
  const category = aqi.category || 'Unknown';
  const aqiValue = aqi.aqi || 0;

  // Color mapping based on AQI
  const getColor = (aqi: number) => {
    if (aqi <= 50) return '#00ff00'; // Good
    if (aqi <= 100) return '#ffff00'; // Moderate
    if (aqi <= 150) return '#ff8800'; // Unhealthy for Sensitive Groups
    if (aqi <= 200) return '#ff0000'; // Unhealthy
    if (aqi <= 300) return '#800080'; // Very Unhealthy
    return '#800000'; // Hazardous
  };

  return {
    aqi: aqiValue,
    category: category,
    color: getColor(aqiValue),
    description: `Air quality is ${category.toLowerCase()} in this area.`
  };
};

// Helper function to format weather data
export const formatWeatherData = (data: any) => {
  if (!data) {
    console.log('❌ No weather data received');
    return null;
  }

  console.log('🌤️ Formatting weather data:', data);

  try {
    // Extract data from Google Weather API response structure
    const temperature = data.temperature?.degrees || 0;
    const condition = data.weatherCondition?.description?.text || 'Unknown';
    const humidity = data.relativeHumidity || 0;
    const windSpeed = data.wind?.speed?.value || 0;
    const windUnit = data.wind?.speed?.unit || 'KILOMETERS_PER_HOUR';
    const feelsLike = data.feelsLikeTemperature?.degrees || temperature;
    const uvIndex = data.uvIndex || 0;
    const visibility = data.visibility?.distance || 0;
    const visibilityUnit = data.visibility?.unit || 'KILOMETERS';

    // Convert wind speed to km/h if needed
    let windSpeedKmh = windSpeed;
    if (windUnit === 'MILES_PER_HOUR') {
      windSpeedKmh = windSpeed * 1.60934;
    }

    // Convert visibility to km if needed
    let visibilityKm = visibility;
    if (visibilityUnit === 'MILES') {
      visibilityKm = visibility * 1.60934;
    }

    // Icon mapping based on weather condition
    const getIcon = (condition: string) => {
      const conditionLower = condition.toLowerCase();
      if (conditionLower.includes('sunny') || conditionLower.includes('clear')) return '☀️';
      if (conditionLower.includes('cloudy') || conditionLower.includes('overcast')) return '☁️';
      if (conditionLower.includes('rain') || conditionLower.includes('shower')) return '🌧️';
      if (conditionLower.includes('snow') || conditionLower.includes('sleet')) return '❄️';
      if (conditionLower.includes('storm') || conditionLower.includes('thunder')) return '⛈️';
      if (conditionLower.includes('fog') || conditionLower.includes('mist')) return '🌫️';
      if (conditionLower.includes('windy')) return '💨';
      return '🌤️';
    };

    const formattedData = {
      temperature: Math.round(temperature),
      condition: condition,
      humidity: Math.round(humidity),
      windSpeed: Math.round(windSpeedKmh),
      feelsLike: Math.round(feelsLike),
      uvIndex: uvIndex,
      visibility: Math.round(visibilityKm),
      icon: getIcon(condition)
    };

    console.log('✅ Formatted weather data:', formattedData);
    return formattedData;
  } catch (error) {
    console.error('❌ Error formatting weather data:', error);
    return null;
  }
};

// Helper function to format nearby places data
export const formatNearbyPlacesData = (data: any) => {
  if (!data || !data.places || data.places.length === 0) {
    return [];
  }

  return data.places.map((place: any) => ({
    name: place.displayName?.text || 'Unknown Place',
    type: place.types?.[0] || 'place',
    distance: 0, // Distance calculation would need additional logic
    rating: place.rating || null,
    lat: place.location?.latitude || 0,
    lng: place.location?.longitude || 0
  }));
};

// Helper function to format elevation data
export const formatElevationData = (data: any) => {
  if (!data || !data.results || data.results.length === 0) {
    return null;
  }

  const elevation = data.results[0].elevation || 0;
  
  return {
    elevation: Math.round(elevation),
    unit: 'meters'
  };
}; 
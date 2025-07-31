import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useTheme } from './ThemeContext';
import { GoogleMap as GoogleMapComponent, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Cloud, Wind, Thermometer, MapPin, Layers, Zap, Sun, Droplets, Box } from 'lucide-react';
import { 
  getAirQuality, 
  getWeather, 
  formatAirQualityData,
  formatWeatherData
} from '@/utils/googleMapsApi';

const DEFAULT_CENTER = { lat: 40.7128, lng: -74.0060 };
const MAP_CONTAINER_STYLE = {
  width: '100%',
  height: '100%',
  borderRadius: '0.75rem', // rounded-md
  boxShadow: '0 4px 24px 0 rgba(0,0,0,0.07)', // shadow-md
  overflow: 'hidden',
};

const customLightMapStyle = [
  { "featureType": "water", "elementType": "geometry", "stylers": [ { "color": "#e9e9e9" }, { "lightness": 17 } ] },
  { "featureType": "landscape", "elementType": "geometry", "stylers": [ { "color": "#f5f5f5" }, { "lightness": 20 } ] },
  { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [ { "color": "#ffffff" }, { "lightness": 17 } ] },
  { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [ { "color": "#ffffff" }, { "lightness": 29 }, { "weight": 0.2 } ] },
  { "featureType": "road.arterial", "elementType": "geometry", "stylers": [ { "color": "#ffffff" }, { "lightness": 18 } ] },
  { "featureType": "road.local", "elementType": "geometry", "stylers": [ { "color": "#ffffff" }, { "lightness": 16 } ] },
  { "featureType": "poi", "elementType": "geometry", "stylers": [ { "color": "#f5f5f5" }, { "lightness": 21 } ] },
  { "featureType": "poi.park", "elementType": "geometry", "stylers": [ { "color": "#dedede" }, { "lightness": 21 } ] },
  { "elementType": "labels.text.stroke", "stylers": [ { "visibility": "on" }, { "color": "#ffffff" }, { "lightness": 16 } ] },
  { "elementType": "labels.text.fill", "stylers": [ { "saturation": 36 }, { "color": "#333333" }, { "lightness": 40 } ] },
  { "elementType": "labels.icon", "stylers": [ { "visibility": "off" } ] },
  { "featureType": "transit", "elementType": "geometry", "stylers": [ { "color": "#f2f2f2" }, { "lightness": 19 } ] },
  { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [ { "color": "#fefefe" }, { "lightness": 20 } ] },
  { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [ { "color": "#fefefe" }, { "lightness": 17 }, { "weight": 1.2 } ] }
];

// Vibrant dark theme from SnazzyMaps
const customDarkMapStyle = [
  { "elementType": "geometry", "stylers": [ { "color": "#1d2c4d" } ] },
  { "elementType": "labels.text.fill", "stylers": [ { "color": "#8ec3b9" } ] },
  { "elementType": "labels.text.stroke", "stylers": [ { "color": "#1a3646" } ] },
  { "featureType": "administrative.country", "elementType": "geometry.stroke", "stylers": [ { "color": "#4b6878" } ] },
  { "featureType": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [ { "color": "#64779e" } ] },
  { "featureType": "administrative.province", "elementType": "geometry.stroke", "stylers": [ { "color": "#4b6878" } ] },
  { "featureType": "landscape.man_made", "elementType": "geometry.stroke", "stylers": [ { "color": "#334e87" } ] },
  { "featureType": "landscape.natural", "elementType": "geometry", "stylers": [ { "color": "#023e58" } ] },
  { "featureType": "poi", "elementType": "geometry", "stylers": [ { "color": "#283d6a" } ] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [ { "color": "#6f9ba5" } ] },
  { "featureType": "poi", "elementType": "labels.text.stroke", "stylers": [ { "color": "#1d2c4d" } ] },
  { "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [ { "color": "#023e58" } ] },
  { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [ { "color": "#3C7680" } ] },
  { "featureType": "road", "elementType": "geometry", "stylers": [ { "color": "#304a7d" } ] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [ { "color": "#98a5be" } ] },
  { "featureType": "road", "elementType": "labels.text.stroke", "stylers": [ { "color": "#1d2c4d" } ] },
  { "featureType": "road.highway", "elementType": "geometry", "stylers": [ { "color": "#2c6675" } ] },
  { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [ { "color": "#255763" } ] },
  { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [ { "color": "#b0d5ce" } ] },
  { "featureType": "road.highway", "elementType": "labels.text.stroke", "stylers": [ { "color": "#023e58" } ] },
  { "featureType": "transit", "elementType": "labels.text.fill", "stylers": [ { "color": "#98a5be" } ] },
  { "featureType": "transit", "elementType": "labels.text.stroke", "stylers": [ { "color": "#1d2c4d" } ] },
  { "featureType": "transit.line", "elementType": "geometry.fill", "stylers": [ { "color": "#283d6a" } ] },
  { "featureType": "transit.station", "elementType": "geometry", "stylers": [ { "color": "#3a4762" } ] },
  { "featureType": "water", "elementType": "geometry", "stylers": [ { "color": "#0e1626" } ] },
  { "featureType": "water", "elementType": "labels.text.fill", "stylers": [ { "color": "#4e6d70" } ] }
];

// Qloo recommendation interface
interface QlooRecommendation {
  name: string
  entity_id: string
  type: string
  subtype: string
  properties: {
    address: string
    phone?: string
    business_rating?: number
    keywords?: Array<string | { name: string; count?: number }>
    images?: Array<{ url: string; type: string }>
    price_level?: number
  }
  popularity: number
  location: {
    lat: number
    lon: number
    geohash: string
  }
}

type MapType = 'roadmap' | 'satellite' | 'hybrid' | 'terrain' | '3d' | '3d-satellite';

interface GoogleMapProps {
  markers?: { lat: number; lng: number; }[];
  center?: { lat: number; lng: number };
  zoom?: number;
  recommendation?: QlooRecommendation;
  userLocation?: { lat: number; lng: number } | null;
  showUserLocation?: boolean;
  showMapControls?: boolean;
  showInfoWindow?: boolean;
  onWeatherToggle?: (() => void);
}

// New interfaces for enhanced features
interface AirQualityData {
  aqi: number;
  category: string;
  color: string;
  description: string;
}

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  uvIndex: number;
  visibility: number;
  icon: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ 
  markers, 
  center: propCenter, 
  zoom = 13, 
  recommendation,
  userLocation: propUserLocation,
  showUserLocation = true,
  showMapControls = true,
  showInfoWindow = false,
  onWeatherToggle
}) => {
  const { theme } = useTheme();
  const [center, setCenter] = useState(propCenter || DEFAULT_CENTER);
  const [loadingLocation, setLoadingLocation] = useState(!propCenter);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; accuracy: number } | null>(propUserLocation ? { ...propUserLocation, accuracy: 100 } : null);
  const [geoError, setGeoError] = useState(false);
  const [customIcon, setCustomIcon] = useState<google.maps.Icon | undefined>(undefined);
  const [recommendationIcon, setRecommendationIcon] = useState<google.maps.Icon | undefined>(undefined);
  const [mapType, setMapType] = useState<MapType>('roadmap');
  const [showControls, setShowControls] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<QlooRecommendation | null>(null);
  const [is3DMode, setIs3DMode] = useState(false);
  const [tilt, setTilt] = useState(0);
  const mapRef = useRef<google.maps.Map | null>(null);

  // New state variables for enhanced features
  const [showAirQuality, setShowAirQuality] = useState(false);
  const [showWeather, setShowWeather] = useState(false);
  
  const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  // Loading states for API calls
  const [loadingAirQuality, setLoadingAirQuality] = useState(false);
  const [loadingWeather, setLoadingWeather] = useState(false);

  // Load Google Maps JS API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  });

  // Update center when prop changes
  useEffect(() => {
    if (propCenter) {
      setCenter(propCenter);
      setLoadingLocation(false);
    }
  }, [propCenter]);

  // Update user location when prop changes
  useEffect(() => {
    if (propUserLocation) {
      setUserLocation({ ...propUserLocation, accuracy: 100 });
    }
  }, [propUserLocation]);

  // Handle tilt changes when map is loaded and 3D mode is active
  useEffect(() => {
    if (mapRef.current && is3DMode) {
      console.log('🎯 useEffect: Applying tilt to loaded map:', tilt);
      mapRef.current.setTilt(tilt);
    }
  }, [tilt, is3DMode]);

  // Get user location if not provided
  useEffect(() => {
    if (propCenter || !showUserLocation) {
      setLoadingLocation(false);
      return;
    }

    if (!navigator.geolocation) {
      setLoadingLocation(false);
      setGeoError(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy || 100,
        };
        setCenter({ lat: coords.lat, lng: coords.lng });
        setUserLocation(coords);
        setLoadingLocation(false);
        setGeoError(false);
      },
      (err) => {
        setLoadingLocation(false);
        setGeoError(true);
        console.error('Unable to detect your location. Please enable location permissions.');
      },
      { timeout: 10000 }
    );
  }, [propCenter, showUserLocation]);

  // Set custom marker icons after Google Maps API is loaded
  useEffect(() => {
    if (isLoaded && window.google && window.google.maps) {
      // User location icon
      const userSvg = `
        <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'>
          <circle cx='12' cy='12' r='8' fill='#E63946' stroke='#fff' stroke-width='2' />
        </svg>
      `;
      setCustomIcon({
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(userSvg),
        scaledSize: new window.google.maps.Size(24, 24),
      });

      // Recommendation icon
      const recSvg = `
        <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'>
          <circle cx='16' cy='16' r='12' fill='#3B82F6' stroke='#fff' stroke-width='3' />
          <path d='M16 8l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z' fill='#fff' />
        </svg>
      `;
      setRecommendationIcon({
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(recSvg),
        scaledSize: new window.google.maps.Size(32, 32),
      });
    }
  }, [isLoaded]);

  const handleRecenter = () => {
    if (!navigator.geolocation || !mapRef.current) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy || 100,
        };
        setCenter({ lat: coords.lat, lng: coords.lng });
        setUserLocation(coords);
        mapRef.current?.panTo({ lat: coords.lat, lng: coords.lng });
        setGeoError(false);
      },
      (err) => {
        setGeoError(true);
        console.error('Unable to detect your location. Please enable location permissions.');
      }
    );
  };

  const handleMapTypeChange = (newMapType: MapType) => {
    console.log('🗺️ Changing map type to:', newMapType);
    setMapType(newMapType);
    
    // Handle 3D modes
    if (newMapType === '3d' || newMapType === '3d-satellite') {
      console.log('🎯 Entering 3D mode:', newMapType);
      setIs3DMode(true);
      setTilt(45); // Set a default tilt for 3D view
      if (mapRef.current) {
        console.log('🎯 Applying 3D tilt to map:', 45);
        mapRef.current.setTilt(45);
      }
    } else {
      console.log('🎯 Exiting 3D mode');
      setIs3DMode(false);
      setTilt(0);
      if (mapRef.current) {
        console.log('🎯 Resetting tilt to 0');
        mapRef.current.setTilt(0);
      }
    }
  };

  const handleMarkerClick = (marker: QlooRecommendation) => {
    setSelectedMarker(marker);
  };

  const handleInfoWindowClose = () => {
    setSelectedMarker(null);
  };


  // New handler functions for enhanced features
  const handleAirQualityToggle = async () => {
    setShowAirQuality(!showAirQuality);
    if (!showAirQuality) {
      setLoadingAirQuality(true);
      try {
        // Use current map center or recommendation location
        const targetLocation = recommendation || { location: { lat: center.lat, lon: center.lng } };
        console.log('🌬️ Fetching air quality data for location:', targetLocation.location);
        const rawData = await getAirQuality(targetLocation.location.lat, targetLocation.location.lon);
        const formattedData = formatAirQualityData(rawData);
        
        if (formattedData) {
          setAirQualityData(formattedData);
          console.log('✅ Air quality data loaded:', formattedData);
        } else {
          console.log('⚠️ No air quality data available');
          // Fallback to mock data
          setAirQualityData({
            aqi: Math.floor(Math.random() * 150) + 50,
            category: 'Moderate',
            color: '#ffff00',
            description: 'Air quality data temporarily unavailable.'
          });
        }
      } catch (error) {
        console.error('❌ Error fetching air quality:', error);
        // Fallback to mock data
        setAirQualityData({
          aqi: Math.floor(Math.random() * 150) + 50,
          category: 'Moderate',
          color: '#ffff00',
          description: 'Air quality data temporarily unavailable.'
        });
      } finally {
        setLoadingAirQuality(false);
      }
    }
  };

  const handleWeatherToggle = async () => {
    setShowWeather(!showWeather);
    if (!showWeather) {
      setLoadingWeather(true);
      try {
        // Use current map center or recommendation location
        const targetLocation = recommendation || { location: { lat: center.lat, lon: center.lng } };
        console.log('🌤️ Fetching weather data for location:', targetLocation.location);
        const weatherData = await getWeather(targetLocation.location.lat, targetLocation.location.lon);
        const formattedData = formatWeatherData(weatherData);
        
        if (formattedData) {
          setWeatherData(formattedData);
          console.log('✅ Weather data loaded:', formattedData);
        } else {
          console.log('⚠️ No weather data available');
          // Fallback to mock data
          setWeatherData({
            temperature: Math.floor(Math.random() * 30) + 10,
            condition: 'Sunny',
            humidity: Math.floor(Math.random() * 50) + 30,
            windSpeed: Math.floor(Math.random() * 10) + 5,
            feelsLike: Math.floor(Math.random() * 30) + 10,
            uvIndex: Math.floor(Math.random() * 10) + 1,
            visibility: Math.floor(Math.random() * 20) + 5,
            icon: '☀️'
          });
        }
      } catch (error) {
        console.error('❌ Error fetching weather:', error);
        // Fallback to mock data
        setWeatherData({
          temperature: Math.floor(Math.random() * 30) + 10,
          condition: 'Sunny',
          humidity: Math.floor(Math.random() * 50) + 30,
          windSpeed: Math.floor(Math.random() * 10) + 5,
          feelsLike: Math.floor(Math.random() * 30) + 10,
          uvIndex: Math.floor(Math.random() * 10) + 1,
          visibility: Math.floor(Math.random() * 20) + 5,
          icon: '☀️'
        });
      } finally {
        setLoadingWeather(false);
      }
    }
  };



  const getMapStyle = () => {
    if (mapType === 'satellite' || mapType === 'hybrid' || mapType === '3d-satellite') {
      return undefined; // Use default satellite styling
    }
    if (mapType === '3d') {
      return undefined; // Use default styling for 3D mode
    }
    return theme === 'dark' ? customDarkMapStyle : customLightMapStyle;
  };

  // Memoize map options to prevent re-rendering when 3D mode changes
  const mapOptions = useMemo(() => ({
    styles: getMapStyle(),
    disableDefaultUI: false,
    zoomControl: true,
    draggable: true,
    fullscreenControl: false,
    mapTypeControl: false, // We have custom controls
    streetViewControl: false, // We have custom controls
    // Always include mapId for 3D support (renderingType will be auto-detected)
    mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID',
  }), [mapType, theme]); // Only re-create when mapType or theme changes, not when is3DMode changes

  if (loadError) {
    return <div 
      className="w-full h-full flex items-center justify-center rounded-md shadow-md"
      style={{
        backgroundColor: 'var(--color-bg-secondary)'
      }}
    >
      Failed to load map
    </div>;
  }

  if (!isLoaded) {
    return (
      <div 
        className="w-full h-full flex items-center justify-center rounded-md shadow-md"
        style={{
          backgroundColor: 'var(--color-bg-secondary)'
        }}
      >
        <span 
          className="text-lg"
          style={{
            color: 'var(--color-text-secondary)'
          }}
        >
          Loading map…
        </span>
      </div>
    );
  }

  const mapTypes: MapType[] = ['roadmap', 'satellite', 'hybrid', 'terrain', '3d', '3d-satellite'];

  return (
    <div className="w-full h-full">
      {/* Map Container */}
      <div className="w-full h-full rounded-md shadow-md overflow-hidden relative">
        {/* User Location Info Window */}
        {showUserLocation && userLocation && (
          <div 
            className="absolute top-4 left-4 z-10 rounded-lg shadow-lg px-3 py-2 backdrop-blur-sm"
            style={{
              backgroundColor: 'var(--color-card-bg)',
              opacity: 0.95
            }}
          >
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span 
                className="font-medium"
                style={{
                  color: 'var(--color-text-primary)'
                }}
              >
                You are here
              </span>
            </div>
          </div>
        )}



                                   <GoogleMapComponent
            mapContainerStyle={MAP_CONTAINER_STYLE}
            center={center}
            zoom={zoom}
            mapTypeId={mapType === '3d' ? 'roadmap' : mapType === '3d-satellite' ? 'satellite' : mapType}
            onLoad={map => { 
              mapRef.current = map; 
              // Set initial tilt for 3D mode
              if (is3DMode) {
                console.log('🎯 Setting initial 3D tilt:', tilt);
                map.setTilt(tilt);
              }
            }}
            options={{
              styles: getMapStyle(),
              disableDefaultUI: false,
              zoomControl: true,
              draggable: true,
              fullscreenControl: false,
              mapTypeControl: false, // We have custom controls
              streetViewControl: false, // We have custom controls
              // Include mapId for 3D support (renderingType will be auto-detected)
              mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID',
              // Apply 3D-specific options only when in 3D mode
              ...(is3DMode && {
                tilt: tilt,
                heading: 0
              })
            }}
         >
          {/* User location marker */}
          {showUserLocation && userLocation && customIcon && (
            <Marker
              position={{ lat: userLocation.lat, lng: userLocation.lng }}
              icon={customIcon}
              title="You are here"
            />
          )}

          {/* Recommendation marker */}
          {recommendation && recommendationIcon && (
            <Marker
              position={{ lat: recommendation.location.lat, lng: recommendation.location.lon }}
              icon={recommendationIcon}
              title={recommendation.name}
              onClick={() => handleMarkerClick(recommendation)}
            />
          )}

          {/* Info window for recommendation */}
          {selectedMarker && showInfoWindow && (
            <InfoWindow
              position={{ lat: selectedMarker.location.lat, lng: selectedMarker.location.lon }}
              onCloseClick={handleInfoWindowClose}
            >
              <div 
                className="p-2 max-w-[200px]"
                style={{
                  backgroundColor: 'var(--color-card-bg)',
                  color: 'var(--color-text-primary)'
                }}
              >
                <h3 
                  className="font-semibold text-sm mb-1"
                  style={{
                    color: 'var(--color-text-primary)'
                  }}
                >
                  {selectedMarker.name}
                </h3>
                <p 
                  className="text-xs mb-2"
                  style={{
                    color: 'var(--color-text-secondary)'
                  }}
                >
                  {selectedMarker.type} • {selectedMarker.subtype}
                </p>
                {selectedMarker.properties.address && (
                  <p 
                    className="text-xs"
                    style={{
                      color: 'var(--color-text-secondary)'
                    }}
                  >
                    📍 {selectedMarker.properties.address}
                  </p>
                )}
                {selectedMarker.properties.business_rating && (
                  <p 
                    className="text-xs"
                    style={{
                      color: 'var(--color-text-secondary)'
                    }}
                  >
                    ⭐ {selectedMarker.properties.business_rating}/5
                  </p>
                )}
                {selectedMarker.properties.price_level && (
                  <p 
                    className="text-xs"
                    style={{
                      color: 'var(--color-text-secondary)'
                    }}
                  >
                    💰 {'$'.repeat(selectedMarker.properties.price_level)}
                  </p>
                )}
                
                {/* View on Google Maps Button */}
                <button
                  onClick={() => {
                    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedMarker.name + ' ' + selectedMarker.properties.address)}`;
                    window.open(url, '_blank');
                  }}
                  className="w-full mt-2 px-2 py-1 text-xs rounded transition-all duration-200 flex items-center justify-center"
                  style={{
                    backgroundColor: 'var(--color-accent)',
                    color: '#ffffff'
                  }}
                >
                  <MapPin className="w-3 h-3 mr-1" />
                  View on Google Maps
                </button>
              </div>
            </InfoWindow>
          )}

          {/* Additional markers */}
          {markers && markers.map((marker, idx) => (
            <Marker key={idx} position={marker} />
          ))}
        </GoogleMapComponent>

        {/* Collapsible Controls - Top Right */}
        {showMapControls && (
          <div className="absolute top-4 right-4 z-20">
            {/* Toggle Button */}
            <button
              onClick={() => setShowControls((prev) => !prev)}
              className="w-10 h-10 rounded-lg shadow-lg backdrop-blur-md transition-all duration-200 flex items-center justify-center"
              style={{
                backgroundColor: 'var(--color-card-bg)',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-card-border)'
              }}
              title={showControls ? "Hide Controls" : "Show Controls"}
            >
              <Layers className="w-5 h-5" />
            </button>

            {/* Controls Panel */}
            {showControls && (
              <div 
                className="rounded-lg shadow-xl backdrop-blur-md p-3 mt-2 min-w-[180px] animate-in slide-in-from-top-2 duration-200"
                style={{
                  backgroundColor: 'var(--color-card-bg)',
                  border: '1px solid var(--color-card-border)',
                  opacity: 0.95,
                  position: 'absolute',
                  right: '0',
                  top: '100%'
                }}
              >
                {/* Map Type Controls */}
                <div className="mb-3">
                  <h3 
                    className="text-xs font-semibold mb-2 uppercase tracking-wide"
                    style={{
                      color: 'var(--color-text-secondary)'
                    }}
                  >
                    Map Type
                  </h3>
                  <div className="grid grid-cols-2 gap-1">
                    {mapTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => handleMapTypeChange(type)}
                        className={`px-2 py-1.5 text-xs rounded transition-all duration-200 ${
                          mapType === type
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                        style={{
                          backgroundColor: mapType === type ? '#3b82f6' : 'var(--color-bg-secondary)',
                          color: mapType === type ? '#ffffff' : 'var(--color-text-secondary)'
                        }}
                                               >
                           {type === '3d-satellite' ? '3D Satellite' : type.charAt(0).toUpperCase() + type.slice(1)}
                         </button>
                    ))}
                  </div>
                </div>

                                 {/* Action Controls */}
                 <div className="mb-3">
                   <h3 
                     className="text-xs font-semibold mb-2 uppercase tracking-wide"
                     style={{
                       color: 'var(--color-text-secondary)'
                     }}
                   >
                     Actions
                   </h3>
                   <div className="space-y-1">
                     {/* My Location */}
                     {showUserLocation && (
                       <button
                         onClick={handleRecenter}
                         className="w-full px-2 py-1.5 text-xs rounded transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center"
                         style={{
                           backgroundColor: 'var(--color-bg-secondary)',
                           color: 'var(--color-text-secondary)'
                         }}
                       >
                         <MapPin className="w-3 h-3 mr-2" />
                         My Location
                       </button>
                     )}
                     
                     {/* Enhanced Features */}
                     <>
                       {/* Air Quality */}
                       <button
                         onClick={handleAirQualityToggle}
                         disabled={loadingAirQuality}
                         className={`w-full px-2 py-1.5 text-xs rounded transition-all duration-200 flex items-center ${
                           showAirQuality
                             ? 'bg-green-500 text-white shadow-md'
                             : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                         } ${loadingAirQuality ? 'opacity-50 cursor-not-allowed' : ''}`}
                         style={{
                           backgroundColor: showAirQuality ? '#10b981' : 'var(--color-bg-secondary)',
                           color: showAirQuality ? '#ffffff' : 'var(--color-text-secondary)'
                         }}
                       >
                         <Zap className="w-3 h-3 mr-2" />
                         {loadingAirQuality ? 'Loading...' : 'Air Quality'}
                       </button>

                       {/* Weather Radar */}
                       <button
                         onClick={handleWeatherToggle}
                         disabled={loadingWeather}
                         className={`w-full px-2 py-1.5 text-xs rounded transition-all duration-200 flex items-center ${
                           showWeather
                             ? 'bg-blue-500 text-white shadow-md'
                             : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                         } ${loadingWeather ? 'opacity-50 cursor-not-allowed' : ''}`}
                         style={{
                           backgroundColor: showWeather ? '#3b82f6' : 'var(--color-bg-secondary)',
                           color: showWeather ? '#ffffff' : 'var(--color-text-secondary)'
                         }}
                       >
                         <Cloud className="w-3 h-3 mr-2" />
                         {loadingWeather ? 'Loading...' : 'Weather Radar'}
                       </button>
                     </>
                   </div>
                 </div>

                 {/* 3D Controls - Only show when in 3D mode */}
                 {is3DMode && (
                   <div className="mb-3">
                     <h3 
                       className="text-xs font-semibold mb-2 uppercase tracking-wide"
                       style={{
                         color: 'var(--color-text-secondary)'
                       }}
                     >
                       3D Controls
                     </h3>
                     <div className="space-y-2">
                       {/* Tilt Control */}
                       <div>
                         <label 
                           className="text-xs block mb-1"
                           style={{
                             color: 'var(--color-text-secondary)'
                           }}
                         >
                           Tilt: {tilt}°
                         </label>
                         <input
                           type="range"
                           min="0"
                           max="67.5"
                           value={tilt}
                           onChange={(e) => {
                             const newTilt = parseInt(e.target.value);
                             console.log('🎯 Tilt slider changed to:', newTilt);
                             setTilt(newTilt);
                             if (mapRef.current) {
                               console.log('🎯 Applying tilt to map:', newTilt);
                               mapRef.current.setTilt(newTilt);
                             } else {
                               console.log('⚠️ Map ref not available for tilt');
                             }
                           }}
                           className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                           style={{
                             backgroundColor: 'var(--color-bg-secondary)'
                           }}
                         />
                       </div>
                       
                       {/* Reset 3D View */}
                       <button
                         onClick={() => {
                           console.log('🎯 Resetting 3D view to 45°');
                           setTilt(45);
                           if (mapRef.current) {
                             console.log('🎯 Applying reset tilt to map: 45');
                             mapRef.current.setTilt(45);
                           } else {
                             console.log('⚠️ Map ref not available for reset');
                           }
                         }}
                         className="w-full px-2 py-1.5 text-xs rounded transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center"
                         style={{
                           backgroundColor: 'var(--color-bg-secondary)',
                           color: 'var(--color-text-secondary)'
                         }}
                       >
                         <Box className="w-3 h-3 mr-2" />
                         Reset 3D View
                       </button>
                     </div>
                   </div>
                 )}
              </div>
            )}
          </div>
        )}

        {/* Enhanced Data Overlays */}
        {showAirQuality && airQualityData && (
          <div className="absolute top-4 left-4 z-10">
            <div 
              className="rounded-lg shadow-lg px-4 py-3 backdrop-blur-sm border-l-4" 
              style={{ 
                backgroundColor: 'var(--color-card-bg)',
                opacity: 0.95,
                borderLeftColor: airQualityData.color 
              }}
            >
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5" style={{ color: airQualityData.color }} />
                <div>
                  <h4 className="font-semibold text-sm">Air Quality</h4>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>AQI: {airQualityData.aqi} - {airQualityData.category}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {showWeather && weatherData && (
          <div className="absolute top-20 left-4 z-10">
            <div 
              className="rounded-lg shadow-lg px-4 py-3 backdrop-blur-sm"
              style={{
                backgroundColor: 'var(--color-card-bg)',
                opacity: 0.95
              }}
            >
              <div className="flex items-center space-x-2">
                <Cloud className="w-5 h-5 text-blue-500" />
                <div>
                  <h4 className="font-semibold text-sm">Weather</h4>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    {weatherData.temperature}°C, {weatherData.condition} {weatherData.icon}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    Feels like: {weatherData.feelsLike}°C | Humidity: {weatherData.humidity}%
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    Wind: {weatherData.windSpeed} km/h | UV: {weatherData.uvIndex} | Visibility: {weatherData.visibility} km
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

export default GoogleMap; 
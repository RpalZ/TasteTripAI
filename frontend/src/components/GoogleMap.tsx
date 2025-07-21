import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from './ThemeContext';
import { GoogleMap as GoogleMapComponent, useJsApiLoader, Marker } from '@react-google-maps/api';

const DEFAULT_CENTER = { lat: 40.7128, lng: -74.0060 };
const MAP_CONTAINER_STYLE = {
  width: '100%',
  height: '500px',
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

interface GoogleMapProps {
  markers?: { lat: number; lng: number; }[];
}

const GoogleMap: React.FC<GoogleMapProps> = ({ markers }) => {
  const { theme } = useTheme();
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [geoError, setGeoError] = useState(false);
  const [customIcon, setCustomIcon] = useState<google.maps.Icon | undefined>(undefined);
  const mapRef = useRef<google.maps.Map | null>(null);

  // Load Google Maps JS API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: [],
  });

  useEffect(() => {
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
        if (typeof window !== 'undefined') {
          window.alert('Unable to detect your location. Please enable location permissions.');
        }
      },
      { timeout: 10000 }
    );
  }, []);

  // Set custom marker icon after Google Maps API is loaded
  useEffect(() => {
    if (isLoaded && window.google && window.google.maps) {
      const svg = `
        <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'>
          <circle cx='12' cy='12' r='8' fill='#E63946' stroke='#fff' stroke-width='2' />
        </svg>
      `;
      setCustomIcon({
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
        scaledSize: new window.google.maps.Size(24, 24),
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
        if (typeof window !== 'undefined') {
          window.alert('Unable to detect your location. Please enable location permissions.');
        }
      }
    );
  };

  if (loadError) {
    return <div className="w-full h-[500px] flex items-center justify-center rounded-md shadow-md bg-gray-100 dark:bg-gray-800">Failed to load map</div>;
  }

  if (!isLoaded || loadingLocation) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center rounded-md shadow-md bg-gray-100 dark:bg-gray-800">
        <span className="text-lg text-gray-500">Loading map…</span>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] rounded-md shadow-md overflow-hidden relative">
      {/* Floating label overlay */}
      <div className="absolute top-2 left-2 bg-white/80 dark:bg-gray-800/80 text-sm px-3 py-1 rounded shadow z-10">
        📍 You are here
      </div>
      <button
        className="bg-white text-black p-2 rounded shadow hover:bg-gray-100 absolute top-4 right-4 z-10"
        onClick={handleRecenter}
        type="button"
      >
        📍 My Location
      </button>
      <GoogleMapComponent
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={center}
        zoom={13}
        onLoad={map => { mapRef.current = map; }}
        options={{
          styles: theme === 'dark' ? customDarkMapStyle : customLightMapStyle,
          disableDefaultUI: false,
          zoomControl: true,
          draggable: true,
          fullscreenControl: false,
        }}
      >
        {userLocation && customIcon && (
          <Marker
            position={{ lat: userLocation.lat, lng: userLocation.lng }}
            icon={customIcon}
            title="You are here"
          />
        )}
        {markers && markers.map((marker, idx) => (
          <Marker key={idx} position={marker} />
        ))}
      </GoogleMapComponent>
    </div>
  );
};

export default GoogleMap; 
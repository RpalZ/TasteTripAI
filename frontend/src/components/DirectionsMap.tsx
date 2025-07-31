'use client'

import { useState, useEffect, useRef } from 'react'
import { GoogleMap, useJsApiLoader, DirectionsRenderer, Marker } from '@react-google-maps/api'
import { Navigation, MapPin, Clock, Route, X, ChevronDown, ChevronUp } from 'lucide-react'

interface DirectionsMapProps {
  origin: { lat: number; lng: number }
  destination: { lat: number; lng: number }
  destinationName: string
  onClose?: () => void
  className?: string
}

interface DirectionsStep {
  instructions: string
  distance: { text: string; value: number }
  duration: { text: string; value: number }
  maneuver?: string
}

export default function DirectionsMap({ 
  origin, 
  destination, 
  destinationName, 
  onClose,
  className = '' 
}: DirectionsMapProps) {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null)
  const [routeInfo, setRouteInfo] = useState<{
    distance: string
    duration: string
    steps: DirectionsStep[]
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [travelMode, setTravelMode] = useState<google.maps.TravelMode>(google.maps.TravelMode.DRIVING)
  const [showSteps, setShowSteps] = useState(false)
  const mapRef = useRef<google.maps.Map | null>(null)

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  })

  const mapContainerStyle = {
    width: '100%',
    height: '100%',
  }

  // Calculate directions when component loads or travel mode changes
  useEffect(() => {
    if (!isLoaded || !window.google) return

    const directionsService = new google.maps.DirectionsService()
    
    setIsLoading(true)
    setError(null)

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: travelMode,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      },
      (result, status) => {
        setIsLoading(false)
        
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result)
          
          // Extract route information
          const route = result.routes[0]
          const leg = route.legs[0]
          
          const steps: DirectionsStep[] = leg.steps.map(step => ({
            instructions: step.instructions,
            distance: step.distance!,
            duration: step.duration!,
            maneuver: step.maneuver
          }))

          setRouteInfo({
            distance: leg.distance?.text || '',
            duration: leg.duration?.text || '',
            steps: steps
          })
          
          console.log('🚗 Directions calculated:', {
            distance: leg.distance?.text,
            duration: leg.duration?.text,
            steps: steps.length
          })
        } else {
          setError('Could not calculate directions. Please try again.')
          console.error('Directions request failed:', status)
        }
      }
    )
  }, [isLoaded, origin, destination, travelMode])

  const handleTravelModeChange = (mode: google.maps.TravelMode) => {
    setTravelMode(mode)
  }

  const getTravelModeIcon = (mode: google.maps.TravelMode) => {
    switch (mode) {
      case google.maps.TravelMode.DRIVING:
        return '🚗'
      case google.maps.TravelMode.WALKING:
        return '🚶'
      case google.maps.TravelMode.BICYCLING:
        return '🚴'
      case google.maps.TravelMode.TRANSIT:
        return '🚌'
      default:
        return '🚗'
    }
  }

  const stripHtmlTags = (html: string) => {
    const temp = document.createElement('div')
    temp.innerHTML = html
    return temp.textContent || temp.innerText || ''
  }

  if (loadError) {
    return (
      <div className={`flex items-center justify-center h-full bg-red-50 rounded-lg ${className}`}>
        <p className="text-red-600">Failed to load directions</p>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center h-full bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading directions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative h-full ${className}`}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Route className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Directions</h3>
              <p className="text-sm text-gray-600 truncate max-w-xs">to {destinationName}</p>
            </div>
          </div>
          
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Travel Mode Selector */}
        <div className="flex items-center space-x-2 mt-3">
          {[
            { mode: google.maps.TravelMode.DRIVING, label: 'Drive' },
            { mode: google.maps.TravelMode.WALKING, label: 'Walk' },
            { mode: google.maps.TravelMode.BICYCLING, label: 'Bike' },
            { mode: google.maps.TravelMode.TRANSIT, label: 'Transit' },
          ].map(({ mode, label }) => (
            <button
              key={mode}
              onClick={() => handleTravelModeChange(mode)}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                travelMode === mode
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{getTravelModeIcon(mode)}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Route Info */}
        {routeInfo && !isLoading && (
          <div className="flex items-center justify-between mt-3 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">{routeInfo.distance}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">{routeInfo.duration}</span>
              </div>
            </div>
            
            <button
              onClick={() => setShowSteps(!showSteps)}
              className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              <span>Steps</span>
              {showSteps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>

      {/* Loading/Error State */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-600">Calculating route...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="text-center p-4">
            <p className="text-red-600 mb-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Map */}
      <div className="h-full pt-32">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={origin}
          zoom={13}
          onLoad={map => { mapRef.current = map }}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          {/* Origin Marker */}
          <Marker
            position={origin}
            title="Your Location"
            icon={{
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'>
                  <circle cx='12' cy='12' r='8' fill='#10B981' stroke='#fff' stroke-width='2' />
                </svg>
              `),
              scaledSize: new window.google.maps.Size(24, 24),
            }}
          />

          {/* Destination Marker */}
          <Marker
            position={destination}
            title={destinationName}
            icon={{
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'>
                  <circle cx='16' cy='16' r='12' fill='#EF4444' stroke='#fff' stroke-width='3' />
                  <path d='M16 8l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z' fill='#fff' />
                </svg>
              `),
              scaledSize: new window.google.maps.Size(32, 32),
            }}
          />

          {/* Directions Renderer */}
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                suppressMarkers: true, // We have custom markers
                polylineOptions: {
                  strokeColor: '#3B82F6',
                  strokeWeight: 5,
                  strokeOpacity: 0.8,
                },
              }}
            />
          )}
        </GoogleMap>
      </div>

      {/* Step-by-Step Instructions */}
      {showSteps && routeInfo && (
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200 max-h-64 overflow-y-auto">
          <div className="p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Step-by-Step Directions</h4>
            <div className="space-y-3">
              {routeInfo.steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 mb-1">
                      {stripHtmlTags(step.instructions)}
                    </p>
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span>{step.distance.text}</span>
                      <span>•</span>
                      <span>{step.duration.text}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 
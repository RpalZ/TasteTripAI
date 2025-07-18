'use client'

import { useState, useEffect } from 'react'
import { MapPin, Navigation, Maximize2 } from 'lucide-react'
import { useTheme } from './ThemeContext'

interface MapViewProps {
  lat?: number
  lng?: number
  location?: string
  title?: string
  className?: string
}

/**
 * Map component for displaying recommendation locations
 * Uses Google Maps embed for simplicity and performance
 */
export default function MapView({ lat, lng, location, title, className = '' }: MapViewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mapSrc, setMapSrc] = useState('')
  const { theme } = useTheme();

  useEffect(() => {
    let src = ''
    
    if (lat && lng) {
      // Use coordinates for precise location
      src = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${lat},${lng}&zoom=15`
    } else if (location && title) {
      // Use search query for general location
      const query = encodeURIComponent(`${title} ${location}`)
      src = `https://www.google.com/maps/embed/v1/search?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${query}&zoom=14`
    } else if (location) {
      // Use location only
      const query = encodeURIComponent(location)
      src = `https://www.google.com/maps/embed/v1/search?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${query}&zoom=12`
    }
    
    setMapSrc(src)
  }, [lat, lng, location, title])

  const openInGoogleMaps = () => {
    let url = ''
    
    if (lat && lng) {
      url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    } else if (location && title) {
      url = `https://www.google.com/maps/search/${encodeURIComponent(title + ' ' + location)}`
    } else if (location) {
      url = `https://www.google.com/maps/search/${encodeURIComponent(location)}`
    }
    
    if (url) {
      window.open(url, '_blank')
    }
  }

  if (!mapSrc) {
    return (
      <div style={{ background: 'var(--color-card-bg)', color: 'var(--color-text-primary)' }} className={`rounded-2xl p-8 text-center ${className}`}>
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p style={{ color: 'var(--color-text-secondary)' }}>Location not available</p>
      </div>
    )
  }

  return (
    <>
      <div style={{ background: 'var(--color-card-bg)', color: 'var(--color-text-primary)' }} className={`relative rounded-2xl overflow-hidden shadow-md ${className}`}>
        {/* Map Controls */}
        <div className="absolute top-4 right-4 z-10 flex space-x-2">
          <button
            onClick={() => setIsFullscreen(true)}
            style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
            className="p-2 rounded-lg shadow-md transition-colors"
            title="Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={openInGoogleMaps}
            style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
            className="p-2 rounded-lg shadow-md transition-colors"
            title="Open in Google Maps"
          >
            <Navigation className="w-4 h-4" />
          </button>
        </div>
        <iframe
          src={mapSrc}
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        />
        {(title || location) && (
          <div style={{ background: 'var(--color-card-bg)', color: 'var(--color-text-primary)' }} className="absolute bottom-0 left-0 right-0 p-4">
            <div className="text-white">
              {title && <h3 className="font-semibold">{title}</h3>}
              {location && <p className="text-sm opacity-90">{location}</p>}
            </div>
          </div>
        )}
      </div>
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div style={{ background: 'var(--color-card-bg)', color: 'var(--color-text-primary)' }} className="relative w-full h-full max-w-6xl max-h-4xl rounded-2xl overflow-hidden">
            <button
              onClick={() => setIsFullscreen(false)}
              style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
              className="absolute top-4 right-4 z-10 p-2 rounded-lg shadow-md transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <iframe
              src={mapSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      )}
    </>
  )
}
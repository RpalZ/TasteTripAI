'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Star, Clock, Phone, Globe } from 'lucide-react'
import { useTheme } from '@/components/ThemeContext'
import { supabase } from '@/utils/supabaseClient'
import GoogleMap from '@/components/GoogleMap'
import WeatherOverlay from '@/components/WeatherOverlay'
import SaveBookmarkButton from '@/components/SaveBookmarkButton'
import PhotoGallery from '@/components/PhotoGallery'
import { DetailPageSkeleton } from '@/components/LoadingSkeleton'
import { ModalPageTransition, TransitionBackButton } from '@/components/PageTransition'
import { useScrollPreservation } from '@/context/ChatContext'
import DirectionsMap from '@/components/DirectionsMap'

// TypeScript interfaces for recommendation data
interface QlooLocation {
  lat: number
  lon: number
  geohash: string
}

interface QlooProperties {
  address: string
  phone?: string
  business_rating?: number
  is_closed?: boolean
  keywords?: Array<string | { name: string; count?: number }>
  images?: Array<{ url: string; type: string }>
  price_level?: number
  website?: string
  opening_hours?: string
}

interface QlooRecommendation {
  name: string
  entity_id: string
  type: string
  subtype: string
  description?: string
  properties: QlooProperties
  popularity: number
  location: QlooLocation
}

interface BookmarkData {
  id: string
  user_id: string
  qloo_id: string
  name: string
  lat: number
  lon: number
  address: string
  description: string
  website?: string
  image_url?: string
  source: string
  created_at: string
}

export default function RecommendationDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { theme } = useTheme()
  const { preserveScroll } = useScrollPreservation()
  
  const [recommendation, setRecommendation] = useState<QlooRecommendation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [showWeather, setShowWeather] = useState(false)
  const [showDirections, setShowDirections] = useState(false)

  // Decode recommendation data from URL
  useEffect(() => {
    const dataParam = searchParams.get('data')
    if (dataParam) {
      try {
        // Decode the data using decodeURIComponent to match the new encoding method
        const decodedString = decodeURIComponent(dataParam)
        const decodedData = JSON.parse(decodedString)
        console.log('🔍 Decoded recommendation data:', decodedData)
        console.log('🔍 Keywords type:', typeof decodedData.properties?.keywords)
        console.log('🔍 Keywords value:', decodedData.properties?.keywords)
        setRecommendation(decodedData)
        console.log('✅ Loaded recommendation data:', decodedData)
        

      } catch (error) {
        console.error('❌ Error decoding recommendation data:', error)
        router.push('/chat')
      }
    } else {
      console.error('❌ No recommendation data found')
      router.push('/chat')
    }
    setIsLoading(false)
  }, [searchParams, router])

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
          console.log('📍 User location obtained:', {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.warn('⚠️ Could not get user location:', error)
        }
      )
    }
  }, [])



  // Handle back navigation with scroll preservation
  const handleBack = () => {
    preserveScroll()
    router.back()
  }

  if (isLoading) {
    return <DetailPageSkeleton />
  }

  if (!recommendation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500">Recommendation not found</p>
          <button 
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <ModalPageTransition>
      <div 
        className="h-screen flex flex-col"
        style={{
          background: 'var(--color-bg-primary)',
          color: 'var(--color-text-primary)'
        }}
      >
      {/* Header */}
      <header 
        className="flex-shrink-0 backdrop-blur-md border-b"
        style={{
          backgroundColor: 'var(--color-card-bg)',
          borderColor: 'var(--color-card-border)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-4">
              <TransitionBackButton
                onClick={handleBack}
                className="p-2 rounded-lg transition-colors hover:opacity-80"
              >
                <ArrowLeft className="w-5 h-5" />
              </TransitionBackButton>
              <div>
                <h1 
                  className="text-lg font-semibold truncate max-w-md"
                  style={{
                    color: 'var(--color-text-primary)'
                  }}
                >
                  {recommendation.name}
                </h1>
                <p 
                  className="text-sm truncate max-w-md"
                  style={{
                    color: 'var(--color-text-secondary)'
                  }}
                >
                  {recommendation.properties.address}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
          
          {/* Map Section */}
          <div className="lg:col-span-1">
            <div 
              className="rounded-lg shadow-lg overflow-hidden relative h-full"
              style={{
                backgroundColor: 'var(--color-card-bg)',
                border: '1px solid var(--color-card-border)'
              }}
            >
              <div className="h-full w-full">
                {showDirections && userLocation ? (
                  <DirectionsMap
                    origin={userLocation}
                    destination={{
                      lat: recommendation.location.lat,
                      lng: recommendation.location.lon
                    }}
                    destinationName={recommendation.name}
                    onClose={() => setShowDirections(false)}
                  />
                ) : (
                  <>
                    <GoogleMap
                      center={{
                        lat: recommendation.location.lat,
                        lng: recommendation.location.lon
                      }}
                      zoom={15}
                      recommendation={recommendation}
                      userLocation={userLocation}
                      showMapControls={true}
                      showInfoWindow={true}
                      onWeatherToggle={() => setShowWeather((prev) => !prev)}
                    />
                    
                    {/* Weather Overlay */}
                    <WeatherOverlay
                      lat={recommendation.location.lat}
                      lng={recommendation.location.lon}
                      isVisible={showWeather}
                      onToggle={() => setShowWeather(false)}
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="lg:col-span-1">
            <div 
              className="rounded-lg shadow-lg p-4 overflow-y-auto" 
              style={{ 
                maxHeight: 'calc(100vh - 80px)',
                backgroundColor: 'var(--color-card-bg)',
                border: '1px solid var(--color-card-border)'
              }}
            >
              
              {/* Basic Info */}
              <div className="mb-6">
                <h2 
                  className="text-2xl font-bold mb-2"
                  style={{
                    color: 'var(--color-text-primary)'
                  }}
                >
                  {recommendation.name}
                </h2>
                <p 
                  className="mb-4"
                  style={{
                    color: 'var(--color-text-secondary)'
                  }}
                >
                  {recommendation.subtype}
                </p>
                
                {/* AI-Generated Description */}
                {recommendation.description && (
                  <div 
                    className="mb-6 p-4 border-l-4 rounded-r-lg"
                    style={{
                      backgroundColor: 'var(--color-bg-secondary)',
                      borderLeftColor: '#3b82f6'
                    }}
                  >
                    <h3 
                      className="text-sm font-semibold mb-2 flex items-center"
                      style={{
                        color: 'var(--color-text-primary)'
                      }}
                    >
                      <span className="mr-2">✨</span>
                      AI Recommendation
                    </h3>
                    <p 
                      className="leading-relaxed"
                      style={{
                        color: 'var(--color-text-secondary)'
                      }}
                    >
                      {recommendation.description}
                    </p>
                  </div>
                )}
                
                {/* Rating */}
                {recommendation.properties.business_rating && (
                  <div className="flex items-center mb-4">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-2 font-semibold">
                      {recommendation.properties.business_rating}/5
                    </span>
                  </div>
                )}

                {/* Address */}
                <div className="flex items-start mb-4">
                  <MapPin 
                    className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" 
                    style={{
                      color: 'var(--color-text-secondary)'
                    }}
                  />
                  <p 
                    style={{
                      color: 'var(--color-text-secondary)'
                    }}
                  >
                    {recommendation.properties.address}
                  </p>
                </div>

                {/* Phone */}
                {recommendation.properties.phone && (
                  <div className="flex items-center mb-4">
                    <Phone 
                      className="w-5 h-5 mr-3" 
                      style={{
                        color: 'var(--color-text-secondary)'
                      }}
                    />
                    <a 
                      href={`tel:${recommendation.properties.phone}`}
                      className="hover:underline"
                      style={{
                        color: 'var(--color-accent)'
                      }}
                    >
                      {recommendation.properties.phone}
                    </a>
                  </div>
                )}

                {/* Website */}
                {recommendation.properties.website && (
                  <div className="flex items-center mb-4">
                    <Globe 
                      className="w-5 h-5 mr-3" 
                      style={{
                        color: 'var(--color-text-secondary)'
                      }}
                    />
                    <a 
                      href={recommendation.properties.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                      style={{
                        color: 'var(--color-accent)'
                      }}
                    >
                      Visit Website
                    </a>
                  </div>
                )}

                {/* Price Level */}
                {recommendation.properties.price_level && (
                  <div className="mb-4">
                    <span 
                      style={{
                        color: 'var(--color-text-secondary)'
                      }}
                    >
                      Price Level: 
                    </span>
                    <span 
                      className="font-semibold"
                      style={{
                        color: 'var(--color-text-primary)'
                      }}
                    >
                      {'$'.repeat(recommendation.properties.price_level)}
                    </span>
                  </div>
                )}

                {/* Opening Hours */}
                {recommendation.properties.opening_hours && (
                  <div className="flex items-center mb-4">
                    <Clock 
                      className="w-5 h-5 mr-3" 
                      style={{
                        color: 'var(--color-text-secondary)'
                      }}
                    />
                    <span 
                      style={{
                        color: 'var(--color-text-secondary)'
                      }}
                    >
                      {recommendation.properties.opening_hours}
                    </span>
                  </div>
                )}
              </div>

              {/* Keywords/Tags */}
              {recommendation.properties.keywords && recommendation.properties.keywords.length > 0 && (
                <div className="mb-6">
                  <h3 
                    className="text-lg font-semibold mb-3"
                    style={{
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.properties.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-sm"
                        style={{
                          backgroundColor: 'var(--color-bg-secondary)',
                          color: 'var(--color-text-secondary)'
                        }}
                      >
                        {typeof keyword === 'string' ? keyword : keyword.name || JSON.stringify(keyword)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Enhanced Photo Gallery */}
              {recommendation.properties.images && recommendation.properties.images.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Photos</h3>
                  <PhotoGallery
                    photos={recommendation.properties.images}
                    placeName={recommendation.name}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                  <SaveBookmarkButton
                    qlooId={recommendation.entity_id}
                    name={recommendation.name}
                    lat={recommendation.location.lat}
                    lon={recommendation.location.lon}
                    address={recommendation.properties.address}
                    description={recommendation.subtype}
                    website={recommendation.properties.website}
                    imageUrl={recommendation.properties.images?.[0]?.url}
                    variant="full"
                    size="md"
                  />
                  
                  <button
                    onClick={() => {
                      if (userLocation) {
                        setShowDirections(true)
                        console.log('🚗 Showing directions to:', recommendation.name)
                      } else {
                        // Fallback to external Google Maps if no user location
                        const destination = `${recommendation.location.lat},${recommendation.location.lon}`
                        const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`
                        window.open(directionsUrl, '_blank')
                      }
                    }}
                    className="flex-1 flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
                  >
                    <MapPin className="w-5 h-5 mr-2" />
                    {userLocation ? 'Show Directions' : 'Get Directions'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalPageTransition>
  )
} 
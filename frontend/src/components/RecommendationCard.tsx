'use client'

import { MapPin, ExternalLink, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTheme } from './ThemeContext'
import SaveBookmarkButton from './SaveBookmarkButton'

interface Recommendation {
  title: string
  type: string
  description: string
  location?: string
  lat?: number
  lng?: number
  // Add Qloo-specific fields for detail page navigation
  entity_id?: string
  name?: string
  subtype?: string
  properties?: {
    address?: string
    phone?: string
    business_rating?: number
    keywords?: Array<string | { name: string; count?: number }>
    images?: Array<{ url: string; type: string }>
    price_level?: number
    website?: string
  }
  popularity?: number
  location_data?: {
    lat: number
    lon: number
    geohash: string
  }
}

interface RecommendationCardProps {
  recommendation: Recommendation
}

/**
 * Card component for displaying cultural recommendations
 * Includes category icons, descriptions, and action buttons
 */
export default function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const { theme } = useTheme();
  const router = useRouter();

  const getCategoryIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'food':
        return '🍜'
      case 'music':
        return '🎶'
      case 'travel':
        return '✈️'
      case 'culture':
        return '🎭'
      case 'fashion':
        return '👗'
      default:
        return '✨'
    }
  }

  const getCategoryColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'food':
        return 'bg-orange-100 text-orange-800'
      case 'music':
        return 'bg-purple-100 text-purple-800'
      case 'travel':
        return 'bg-blue-100 text-blue-800'
      case 'culture':
        return 'bg-pink-100 text-pink-800'
      case 'fashion':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleBooking = () => {
    if (recommendation.lat && recommendation.lng) {
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${recommendation.lat},${recommendation.lng}`
      window.open(mapsUrl, '_blank')
    } else if (recommendation.location) {
      const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(recommendation.title + ' ' + recommendation.location)}`
      window.open(searchUrl, '_blank')
    }
  }

  const createDetailData = () => {
    return {
      name: recommendation.name,
      entity_id: recommendation.entity_id,
      type: recommendation.type,
      subtype: recommendation.subtype || recommendation.type,
      description: recommendation.description,
      properties: {
        address: recommendation.properties?.address || recommendation.location || '',
        phone: recommendation.properties?.phone,
        business_rating: recommendation.properties?.business_rating,
        keywords: recommendation.properties?.keywords,
        images: recommendation.properties?.images,
        price_level: recommendation.properties?.price_level
      },
      popularity: recommendation.popularity || 0,
      location: {
        lat: recommendation.location_data?.lat || recommendation.lat || 0,
        lon: recommendation.location_data?.lon || recommendation.lng || 0,
        geohash: recommendation.location_data?.geohash || ''
      }
    }
  }

  const handleViewDetails = () => {
    // Check if we have the necessary data for the detail page
    if (recommendation.entity_id && recommendation.name) {
      const detailData = createDetailData()
      
      // Encode the data using a Unicode-safe method
      try {
        // Use encodeURIComponent to handle Unicode characters safely
        const jsonString = JSON.stringify(detailData)
        const encodedData = encodeURIComponent(jsonString)
        router.push(`/recommendation/${recommendation.entity_id}?data=${encodedData}`)
      } catch (error) {
        console.error('❌ Error encoding recommendation data:', error)
        // Fallback to external maps if encoding fails
        handleBooking()
      }
    } else {
      // Fallback to external maps if no detail page data
      handleBooking()
    }
  }

  return (
    <div style={{
      background: 'var(--color-card-bg)',
      color: 'var(--color-text-primary)',
      border: '1px solid var(--color-card-border)',
      borderRadius: '1rem',
      boxShadow: '0 1px 4px 0 rgba(0,0,0,0.04)',
      position: 'relative',
      overflow: 'hidden',
      padding: '1.5rem',
      marginBottom: '1rem',
    }} className="group transition-all duration-300 ease-in-out">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl" style={{ color: 'var(--color-accent)' }}>{getCategoryIcon(recommendation.type)}</span>
          <div>
            <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{recommendation.title}</h3>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium`} style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' }}>{recommendation.type}</span>
          </div>
        </div>
        {recommendation.entity_id && (
          <SaveBookmarkButton
            qlooId={recommendation.entity_id}
            name={recommendation.name || recommendation.title}
            lat={recommendation.location_data?.lat || recommendation.lat || 0}
            lon={recommendation.location_data?.lon || recommendation.lng || 0}
            address={recommendation.properties?.address || recommendation.location || ''}
            description={recommendation.subtype || recommendation.type}
            website={recommendation.properties?.website}
            imageUrl={recommendation.properties?.images?.[0]?.url}
            variant="icon"
            size="sm"
            className="p-2"
          />
        )}
      </div>
      <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-secondary)' }}>{recommendation.description}</p>
      {recommendation.location && (
        <div className="flex items-center space-x-2 text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
          <MapPin className="w-4 h-4" />
          <span>{recommendation.location}</span>
        </div>
      )}
      <div className="flex space-x-2">
        {/* View Details Button - Primary Action */}
        <button
          onClick={handleViewDetails}
          className="flex-1 flex items-center justify-center space-x-2 text-sm rounded-xl px-4 py-2 font-semibold transition-all duration-300 ease-in-out"
          style={{
            background: 'var(--color-accent)',
            color: 'var(--color-on-accent)',
            border: 'none',
          }}
        >
          <Eye className="w-4 h-4" />
          <span>View Details</span>
        </button>
        
        {/* Secondary Actions */}
        {(recommendation.location || (recommendation.lat && recommendation.lng)) && (
          <button
            onClick={handleBooking}
            className="btn-secondary flex items-center space-x-2 text-sm"
            style={{
              background: 'var(--color-bg-secondary)',
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-card-border)',
            }}
          >
            <MapPin className="w-4 h-4" />
            <span>Maps</span>
          </button>
        )}
      </div>
    </div>
  )
}
'use client'

import { MapPin, ExternalLink, Heart } from 'lucide-react'
import { useState } from 'react'

interface Recommendation {
  title: string
  type: string
  description: string
  location?: string
  lat?: number
  lng?: number
}

interface RecommendationCardProps {
  recommendation: Recommendation
}

/**
 * Card component for displaying cultural recommendations
 * Includes category icons, descriptions, and action buttons
 */
export default function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const [isLiked, setIsLiked] = useState(false)

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

  return (
    <div className="recommendation-card p-6 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getCategoryIcon(recommendation.type)}</span>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {recommendation.title}
            </h3>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(recommendation.type)}`}>
              {recommendation.type}
            </span>
          </div>
        </div>
        
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`p-2 rounded-full transition-all duration-200 ${
            isLiked 
              ? 'bg-red-100 text-red-600' 
              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm leading-relaxed mb-4">
        {recommendation.description}
      </p>

      {/* Location */}
      {recommendation.location && (
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <MapPin className="w-4 h-4" />
          <span>{recommendation.location}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-2">
        {(recommendation.location || (recommendation.lat && recommendation.lng)) && (
          <button
            onClick={handleBooking}
            className="btn-primary flex-1 flex items-center justify-center space-x-2 text-sm"
          >
            <MapPin className="w-4 h-4" />
            <span>View on Maps</span>
          </button>
        )}
        
        <button className="btn-secondary flex items-center space-x-2 text-sm">
          <ExternalLink className="w-4 h-4" />
          <span>Learn More</span>
        </button>
      </div>
    </div>
  )
}
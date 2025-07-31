'use client'

import React from 'react'

interface LoadingSkeletonProps {
  variant?: 'text' | 'card' | 'image' | 'button' | 'avatar' | 'gallery'
  count?: number
  className?: string
  animate?: boolean
}

export default function LoadingSkeleton({ 
  variant = 'text', 
  count = 1, 
  className = '',
  animate = true
}: LoadingSkeletonProps) {
  const baseClasses = `bg-gray-200 rounded ${animate ? 'animate-pulse' : ''}`

  const renderSkeleton = () => {
    switch (variant) {
      case 'text':
        return <div className={`${baseClasses} h-4 w-full ${className}`} />
      
      case 'card':
        return (
          <div className={`${baseClasses} p-6 ${className}`}>
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-gray-300 rounded-full h-12 w-12"></div>
              <div className="flex-1">
                <div className="bg-gray-300 rounded h-4 w-3/4 mb-2"></div>
                <div className="bg-gray-300 rounded h-3 w-1/2"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="bg-gray-300 rounded h-3 w-full"></div>
              <div className="bg-gray-300 rounded h-3 w-5/6"></div>
              <div className="bg-gray-300 rounded h-3 w-4/6"></div>
            </div>
            <div className="mt-4 flex space-x-2">
              <div className="bg-gray-300 rounded h-8 w-20"></div>
              <div className="bg-gray-300 rounded h-8 w-16"></div>
            </div>
          </div>
        )
      
      case 'image':
        return <div className={`${baseClasses} aspect-square w-full ${className}`} />
      
      case 'button':
        return <div className={`${baseClasses} h-10 w-24 ${className}`} />
      
      case 'avatar':
        return <div className={`${baseClasses} rounded-full h-10 w-10 ${className}`} />
      
      case 'gallery':
        return (
          <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 ${className}`}>
            {Array.from({ length: count || 6 }).map((_, index) => (
              <div key={index} className={`${baseClasses} aspect-square`} />
            ))}
          </div>
        )
      
      default:
        return <div className={`${baseClasses} h-4 w-full ${className}`} />
    }
  }

  if (count === 1) {
    return renderSkeleton()
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  )
}

// Specialized skeleton components for common use cases
export const RecommendationCardSkeleton = ({ className = '' }: { className?: string }) => (
  <LoadingSkeleton variant="card" className={`border border-gray-200 ${className}`} />
)

export const PhotoGallerySkeleton = ({ count = 6, className = '' }: { count?: number, className?: string }) => (
  <LoadingSkeleton variant="gallery" count={count} className={className} />
)

export const DetailPageSkeleton = () => (
  <div className="h-screen flex flex-col bg-gray-50">
    {/* Header Skeleton */}
    <div className="flex-shrink-0 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-4">
            <LoadingSkeleton variant="button" className="w-8 h-8" />
            <div>
              <LoadingSkeleton className="w-48 mb-1" />
              <LoadingSkeleton className="w-32 h-3" />
            </div>
          </div>
          <LoadingSkeleton variant="avatar" />
        </div>
      </div>
    </div>

    {/* Main Content Skeleton */}
    <div className="flex-1 max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
        
        {/* Map Section Skeleton */}
        <div className="lg:col-span-1">
          <LoadingSkeleton className="h-full rounded-lg" />
        </div>

        {/* Info Section Skeleton */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-4 h-full">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <LoadingSkeleton className="w-3/4 h-6 mb-2" />
                <LoadingSkeleton className="w-1/2 h-4" />
              </div>
              
              {/* Details */}
              <div className="space-y-4">
                <LoadingSkeleton count={3} />
              </div>
              
              {/* Tags */}
              <div>
                <LoadingSkeleton className="w-16 h-5 mb-3" />
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <LoadingSkeleton key={i} className={`h-6 rounded-full ${i === 0 ? 'w-16' : i === 1 ? 'w-20' : i === 2 ? 'w-12' : 'w-18'}`} />
                  ))}
                </div>
              </div>
              
              {/* Photo Gallery */}
              <div>
                <LoadingSkeleton className="w-20 h-5 mb-3" />
                <PhotoGallerySkeleton count={4} />
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-4">
                <LoadingSkeleton variant="button" className="flex-1 h-12" />
                <LoadingSkeleton variant="button" className="flex-1 h-12" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
) 
'use client'

import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Download, ExternalLink } from 'lucide-react'

interface Photo {
  url: string
  type: string
}

interface PhotoGalleryProps {
  photos: Photo[]
  placeName: string
  className?: string
}

export default function PhotoGallery({ photos, placeName, className = '' }: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [loadingImages, setLoadingImages] = useState<Set<number>>(new Set())

  const handleImageLoad = (index: number) => {
    setLoadingImages(prev => {
      const newSet = new Set(prev)
      newSet.delete(index)
      return newSet
    })
  }

  const handleImageLoadStart = (index: number) => {
    setLoadingImages(prev => new Set(prev).add(index))
  }

  const openModal = (index: number) => {
    setSelectedIndex(index)
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setSelectedIndex(null)
    // Restore body scroll
    document.body.style.overflow = 'unset'
  }

  const goToPrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? photos.length - 1 : selectedIndex - 1)
    }
  }

  const goToNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === photos.length - 1 ? 0 : selectedIndex + 1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeModal()
    if (e.key === 'ArrowLeft') goToPrevious()
    if (e.key === 'ArrowRight') goToNext()
  }

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Failed to download image:', error)
      // Fallback: open in new tab
      window.open(url, '_blank')
    }
  }

  if (!photos || photos.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <p className="text-gray-500">No photos available</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Gallery Grid */}
      <div className={`${className}`}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group bg-gray-100"
              onClick={() => openModal(index)}
            >
              {/* Loading State */}
              {loadingImages.has(index) && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              
              {/* Image */}
              <img
                src={photo.url}
                alt={`${placeName} - ${photo.type} ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onLoadStart={() => handleImageLoadStart(index)}
                onLoad={() => handleImageLoad(index)}
                onError={() => handleImageLoad(index)}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              
              {/* Photo Counter */}
              {photos.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                  {index + 1}/{photos.length}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Show More Indicator */}
        {photos.length > 6 && (
          <div className="mt-3 text-center">
            <button
              onClick={() => openModal(0)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            >
              View all {photos.length} photos
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-60 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Navigation Buttons */}
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-60 p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-60 p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}

          {/* Image Container */}
          <div className="relative max-w-4xl max-h-[80vh] w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={photos[selectedIndex].url}
              alt={`${placeName} - ${photos[selectedIndex].type} ${selectedIndex + 1}`}
              className="w-full h-full object-contain rounded-lg"
            />
            
            {/* Image Info Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-lg">
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="font-medium">{placeName}</p>
                  <p className="text-sm text-gray-300">
                    {photos[selectedIndex].type} • {selectedIndex + 1} of {photos.length}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => downloadImage(
                      photos[selectedIndex].url,
                      `${placeName}-${selectedIndex + 1}.jpg`
                    )}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                    title="Download image"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => window.open(photos[selectedIndex].url, '_blank')}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Thumbnails */}
          {photos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 bg-black/50 p-2 rounded-lg max-w-xs overflow-x-auto">
              {photos.map((photo, index) => (
                <button
                  key={index}
                  onClick={(e) => { e.stopPropagation(); setSelectedIndex(index); }}
                  className={`flex-shrink-0 w-12 h-12 rounded border-2 overflow-hidden transition-all ${
                    index === selectedIndex ? 'border-white' : 'border-transparent opacity-60 hover:opacity-80'
                  }`}
                >
                  <img
                    src={photo.url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
} 
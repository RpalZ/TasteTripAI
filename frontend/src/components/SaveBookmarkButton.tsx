'use client'

import { useState, useEffect } from 'react'
import { Heart, Check, X } from 'lucide-react'
import { supabase } from '@/utils/supabaseClient'

interface SaveBookmarkButtonProps {
  qlooId: string
  name: string
  lat: number
  lon: number
  address: string
  description: string
  website?: string
  imageUrl?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'icon' | 'button' | 'full'
  onBookmarkChange?: (isBookmarked: boolean) => void
}

export default function SaveBookmarkButton({
  qlooId,
  name,
  lat,
  lon,
  address,
  description,
  website,
  imageUrl,
  className = '',
  size = 'md',
  variant = 'button',
  onBookmarkChange
}: SaveBookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [savedRecommendations, setSavedRecommendations] = useState<any[]>([])

  // Check initial bookmark status
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      try {
        const { data: session } = await supabase.auth.getSession()
        if (!session.session) return

        const { data: bookmarks } = await supabase
          .from('user_bookmarks')
          .select('id')
          .eq('user_id', session.session.user.id)
          .eq('qloo_id', qlooId)
          .single()

        const bookmarked = !!bookmarks
        setIsBookmarked(bookmarked)
        onBookmarkChange?.(bookmarked)
        console.log('🔖 Bookmark status checked:', bookmarked)
      } catch (error) {
        console.log('🔖 No existing bookmark found')
        setIsBookmarked(false)
        onBookmarkChange?.(false)
      }
    }

    checkBookmarkStatus()
  }, [qlooId, onBookmarkChange])

  const handleBookmarkToggle = async () => {
    try {
      setIsLoading(true)
      setShowSuccess(false)
      setShowError(false)

      const { data: session } = await supabase.auth.getSession()
      
      if (!session.session) {
        setShowError(true)
        setTimeout(() => setShowError(false), 3000)
        return
      }

      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from('user_bookmarks')
          .delete()
          .eq('user_id', session.session.user.id)
          .eq('qloo_id', qlooId)

        if (error) throw error
        
        setIsBookmarked(false)
        onBookmarkChange?.(false)
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 2000)
        console.log('🗑️ Bookmark removed')
      } else {
        // Save bookmark
        const bookmarkData = {
          user_id: session.session.user.id,
          qloo_id: qlooId,
          name,
          lat,
          lon,
          address,
          description,
          website,
          image_url: imageUrl,
          source: 'qloo'
        }

        const { error } = await supabase
          .from('user_bookmarks')
          .insert([bookmarkData])

        if (error) throw error
        
        setIsBookmarked(true)
        onBookmarkChange?.(true)
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 2000)
        console.log('💾 Bookmark saved')
      }
    } catch (error) {
      console.error('❌ Error toggling bookmark:', error)
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  }

  // Variant styles
  const getVariantStyles = () => {
    if (variant === 'icon') {
      return `rounded-lg transition-all duration-200 ${
        isBookmarked 
          ? 'text-red-500 hover:bg-red-50 hover:scale-110' 
          : 'text-gray-400 hover:bg-gray-100 hover:scale-110'
      } ${isLoading ? 'animate-pulse' : ''}`
    }
    
    if (variant === 'button') {
      return `flex items-center justify-center px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
        isBookmarked
          ? 'bg-red-500 text-white hover:bg-red-600 hover:scale-105'
          : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105'
      } ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`
    }
    
    if (variant === 'full') {
      return `flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
        isBookmarked
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      } ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`
    }
    
    return ''
  }

  const renderContent = () => {
    if (showSuccess) {
      return (
        <>
          <Check className={`${sizeClasses[size]} mr-2`} />
          {variant !== 'icon' && (isBookmarked ? 'Saved!' : 'Removed!')}
        </>
      )
    }

    if (showError) {
      return (
        <>
          <X className={`${sizeClasses[size]} mr-2`} />
          {variant !== 'icon' && 'Error'}
        </>
      )
    }

    if (isLoading) {
      return (
        <>
          <div className={`${sizeClasses[size]} mr-2 animate-spin rounded-full border-2 border-current border-t-transparent`} />
          {variant !== 'icon' && 'Loading...'}
        </>
      )
    }

    return (
      <>
        <Heart className={`${sizeClasses[size]} mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
        {variant !== 'icon' && (isBookmarked ? 'Remove Bookmark' : 'Save Bookmark')}
      </>
    )
  }

  return (
    <button
      onClick={handleBookmarkToggle}
      disabled={isLoading}
      className={`${getVariantStyles()} ${className}`}
      title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
    >
      {renderContent()}
    </button>
  )
}

// (Removed invalid block rendering savedRecommendations outside of a component)
'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { supabase } from '@/utils/supabaseClient'

interface BookmarkIndicatorProps {
  qlooId: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function BookmarkIndicator({ 
  qlooId, 
  size = 'sm', 
  className = '' 
}: BookmarkIndicatorProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check bookmark status
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      try {
        const { data: session } = await supabase.auth.getSession()
        if (!session.session) {
          setIsBookmarked(false)
          setIsLoading(false)
          return
        }

        const { data: bookmarks } = await supabase
          .from('user_bookmarks')
          .select('id')
          .eq('user_id', session.session.user.id)
          .eq('qloo_id', qlooId)
          .single()

        setIsBookmarked(!!bookmarks)
      } catch (error) {
        setIsBookmarked(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkBookmarkStatus()

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('bookmark_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'user_bookmarks',
          filter: `qloo_id=eq.${qlooId}`
        }, 
        () => {
          checkBookmarkStatus()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [qlooId])

  if (isLoading) {
    return (
      <div className={`animate-pulse rounded-full bg-gray-200 ${className}`}>
        <Heart className={`w-3 h-3 text-gray-400`} />
      </div>
    )
  }

  if (!isBookmarked) {
    return null // Don't show anything if not bookmarked
  }

  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  return (
    <div className={`${className}`}>
      <Heart className={`${sizeClasses[size]} text-red-500 fill-current`} />
    </div>
  )
} 
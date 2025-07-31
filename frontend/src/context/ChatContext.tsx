'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

interface Recommendation {
  title: string
  type: string
  description: string
  location?: string
  lat?: number
  lng?: number
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

interface ChatState {
  messages: Message[]
  recommendations: Recommendation[]
  isRecommending: boolean
  currentConversationId: string | null
  scrollPosition: number
}

interface ChatContextType {
  chatState: ChatState
  setChatState: (state: ChatState) => void
  updateMessages: (messages: Message[]) => void
  updateRecommendations: (recommendations: Recommendation[]) => void
  setIsRecommending: (isRecommending: boolean) => void
  setCurrentConversationId: (id: string | null) => void
  saveScrollPosition: (position: number) => void
  restoreScrollPosition: () => number
  clearChatState: () => void
  saveRecommendationsToStorage: (recommendations: Recommendation[], conversationId: string) => void
  loadRecommendationsFromStorage: (conversationId: string) => Recommendation[] | null
  clearRecommendationsFromStorage: (conversationId?: string) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

const initialChatState: ChatState = {
  messages: [],
  recommendations: [],
  isRecommending: false,
  currentConversationId: null,
  scrollPosition: 0
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chatState, setChatState] = useState<ChatState>(initialChatState)

  // Persist chat state to sessionStorage (survives page refreshes but not tab closes)
  useEffect(() => {
    const savedState = sessionStorage.getItem('tastetrip_chat_state')
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState)
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsedState.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
        setChatState({
          ...parsedState,
          messages: messagesWithDates
        })
      } catch (error) {
        console.error('Failed to restore chat state:', error)
      }
    }
  }, [])

  // Save chat state to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('tastetrip_chat_state', JSON.stringify(chatState))
  }, [chatState])

  const updateMessages = (messages: Message[]) => {
    setChatState(prev => ({ ...prev, messages }))
  }

  const updateRecommendations = (recommendations: Recommendation[]) => {
    setChatState(prev => ({ ...prev, recommendations }))
  }

  const setIsRecommending = (isRecommending: boolean) => {
    setChatState(prev => ({ ...prev, isRecommending }))
  }

  const setCurrentConversationId = (id: string | null) => {
    setChatState(prev => ({ ...prev, currentConversationId: id }))
  }

  const saveScrollPosition = (position: number) => {
    setChatState(prev => ({ ...prev, scrollPosition: position }))
  }

  const restoreScrollPosition = () => {
    return chatState.scrollPosition
  }

  const clearChatState = () => {
    setChatState(initialChatState)
    sessionStorage.removeItem('tastetrip_chat_state')
  }

  // Recommendation storage functions
  const saveRecommendationsToStorage = (recommendations: Recommendation[], conversationId: string) => {
    try {
      // Check if localStorage is available (not in SSR)
      if (typeof window === 'undefined' || !window.localStorage) {
        console.log('⚠️ localStorage not available (SSR or disabled)')
        return
      }

      const storageKey = `tastetrip_recommendations_${conversationId}`
      const dataToStore = {
        recommendations,
        timestamp: Date.now(),
        conversationId
      }
      
      console.log('💾 Attempting to save recommendations:', {
        conversationId,
        count: recommendations.length,
        key: storageKey,
        dataSize: JSON.stringify(dataToStore).length
      })
      
      localStorage.setItem(storageKey, JSON.stringify(dataToStore))
      console.log('✅ Successfully saved recommendations to storage')
    } catch (error) {
      console.error('❌ Failed to save recommendations to storage:', error)
    }
  }

  const loadRecommendationsFromStorage = (conversationId: string): Recommendation[] | null => {
    try {
      // Check if localStorage is available (not in SSR)
      if (typeof window === 'undefined' || !window.localStorage) {
        console.log('⚠️ localStorage not available (SSR or disabled)')
        return null
      }

      const storageKey = `tastetrip_recommendations_${conversationId}`
      console.log('🔍 Looking for stored recommendations:', storageKey)
      
      const storedData = localStorage.getItem(storageKey)
      
      if (!storedData) {
        console.log('📭 No stored recommendations found for conversation:', conversationId)
        return null
      }

      console.log('📄 Found stored data, parsing...')
      const parsedData = JSON.parse(storedData)
      
      // Check if data is not too old (24 hours)
      const maxAge = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
      const isExpired = Date.now() - parsedData.timestamp > maxAge
      
      if (isExpired) {
        console.log('⏰ Stored recommendations expired, removing:', conversationId)
        localStorage.removeItem(storageKey)
        return null
      }

      console.log('📚 Successfully loaded recommendations from storage:', {
        conversationId,
        count: parsedData.recommendations?.length || 0,
        age: Math.round((Date.now() - parsedData.timestamp) / (1000 * 60)) + ' minutes'
      })
      
      return parsedData.recommendations || null
    } catch (error) {
      console.error('❌ Failed to load recommendations from storage:', error)
      return null
    }
  }

  const clearRecommendationsFromStorage = (conversationId?: string) => {
    try {
      if (conversationId) {
        // Clear specific conversation
        const storageKey = `tastetrip_recommendations_${conversationId}`
        localStorage.removeItem(storageKey)
        console.log('🗑️ Cleared recommendations for conversation:', conversationId)
      } else {
        // Clear all recommendation storage
        const keysToRemove: string[] = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && key.startsWith('tastetrip_recommendations_')) {
            keysToRemove.push(key)
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key))
        console.log('🗑️ Cleared all stored recommendations:', keysToRemove.length + ' conversations')
      }
    } catch (error) {
      console.error('❌ Failed to clear recommendations from storage:', error)
    }
  }

  const value: ChatContextType = {
    chatState,
    setChatState,
    updateMessages,
    updateRecommendations,
    setIsRecommending,
    setCurrentConversationId,
    saveScrollPosition,
    restoreScrollPosition,
    clearChatState,
    saveRecommendationsToStorage,
    loadRecommendationsFromStorage,
    clearRecommendationsFromStorage
  }

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChatContext() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
}

// Hook for preserving scroll position during navigation
export function useScrollPreservation() {
  const { saveScrollPosition, restoreScrollPosition } = useChatContext()

  const preserveScroll = () => {
    const scrollY = window.scrollY
    saveScrollPosition(scrollY)
  }

  const restoreScroll = () => {
    const position = restoreScrollPosition()
    if (position > 0) {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        window.scrollTo(0, position)
      }, 100)
    }
  }

  return { preserveScroll, restoreScroll }
} 
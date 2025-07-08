'use client'

import { useState } from 'react'
import ChatInput from '@/components/ChatInput'
import MessageBubble from '@/components/MessageBubble'
import RecommendationCard from '@/components/RecommendationCard'
import TasteHistory from '@/components/TasteHistory'
import { Menu, X, Sparkles, ArrowLeft } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  recommendations?: Recommendation[]
}

interface Recommendation {
  title: string
  type: string
  description: string
  location?: string
  lat?: number
  lng?: number
}

interface ChatInterfaceProps {
  initialQuery?: string
  onBack?: () => void
}

export default function ChatInterface({ initialQuery, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your cultural discovery assistant. Tell me about your tastes - what kind of food, music, places, or experiences do you enjoy? I'll help you discover amazing cultural recommendations tailored just for you! ✨",
      timestamp: new Date(),
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const handleUserInput = async (input: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Simulate API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock recommendations
      const mockRecommendations: Recommendation[] = [
        {
          title: "Blue Note Jazz Club",
          type: "Music",
          description: "An intimate jazz venue perfect for your sophisticated musical taste, featuring live performances from emerging and established artists.",
          location: "New York, NY",
          lat: 40.7282,
          lng: -73.9942
        },
        {
          title: "Osteria Francescana",
          type: "Food",
          description: "A Michelin-starred Italian restaurant that combines traditional flavors with modern innovation, matching your refined culinary preferences.",
          location: "Modena, Italy",
          lat: 44.6471,
          lng: 10.9252
        },
        {
          title: "Museum of Modern Art",
          type: "Culture",
          description: "Explore contemporary art exhibitions that align with your appreciation for creative expression and cultural depth.",
          location: "New York, NY",
          lat: 40.7614,
          lng: -73.9776
        }
      ]

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "Based on your taste profile, I've found some amazing cultural experiences that align perfectly with your preferences! Each recommendation is carefully selected to match your unique style and interests.",
        timestamp: new Date(),
        recommendations: mockRecommendations
      }
      
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-pink-900/30 m-0 p-0 relative overflow-hidden">
      {/* Enhanced Background with Floating Bubbles */}
      <div className="absolute inset-0 opacity-10">
        <div className="floating-bubble absolute top-20 left-20 w-32 h-32 bg-blue-400/40 rounded-full blur-2xl" />
        <div className="floating-bubble absolute top-40 right-32 w-24 h-24 bg-purple-400/40 rounded-full blur-2xl" />
        <div className="floating-bubble absolute bottom-32 left-1/4 w-40 h-40 bg-pink-400/40 rounded-full blur-2xl" />
        <div className="floating-bubble absolute bottom-20 right-20 w-28 h-28 bg-blue-300/40 rounded-full blur-2xl" />
        <div className="floating-bubble absolute top-1/2 left-10 w-20 h-20 bg-yellow-400/30 rounded-full blur-2xl" />
        <div className="floating-bubble absolute top-1/3 right-1/4 w-36 h-36 bg-green-400/30 rounded-full blur-2xl" />
      </div>
      
      {/* Enhanced Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-purple-50/30 to-pink-50/40" />
      
      {/* Subtle Wave Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
          <path d="M0,400 C300,200 600,600 1200,400 L1200,800 L0,800 Z" fill="url(#wave-gradient)" />
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-700 ease-in-out hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">TasteTrip AI</h1>
              <p className="text-sm text-gray-600">Your Cultural Discovery Assistant</p>
            </div>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-all duration-700 ease-in-out hover:scale-105"
          >
            {showHistory ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((message) => (
            <div key={message.id}>
              <MessageBubble message={message} />
              {message.recommendations && (
                <div className="mt-4 grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                  {message.recommendations.map((rec, index) => (
                    <RecommendationCard key={index} recommendation={rec} />
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <MessageBubble 
              message={{
                id: 'loading',
                type: 'ai',
                content: 'Analyzing your taste profile and finding perfect recommendations',
                timestamp: new Date()
              }}
              isLoading={true}
            />
          )}
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white/90 backdrop-blur-md border-t border-gray-200/50 shadow-sm">
          <ChatInput onSubmit={handleUserInput} disabled={isLoading} />
        </div>
      </div>

      {/* Taste History Sidebar */}
      <div className={`${showHistory ? 'block' : 'hidden'} lg:block w-80 bg-white/95 backdrop-blur-md border-l border-gray-200/50 relative z-10`}>
        <TasteHistory />
      </div>
    </div>
  )
}
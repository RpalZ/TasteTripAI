'use client'

import { useState } from 'react'
import ChatInput from '@/components/ChatInput'
import MessageBubble from '@/components/MessageBubble'
import RecommendationCard from '@/components/RecommendationCard'
import TasteHistory from '@/components/TasteHistory'
import { Menu, X, Sparkles } from 'lucide-react'

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

export default function Home() {
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
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">TasteTrip AI</h1>
              <p className="text-sm text-gray-600">Your Cultural Discovery Assistant</p>
            </div>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
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
        <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200">
          <ChatInput onSubmit={handleUserInput} disabled={isLoading} />
        </div>
      </div>

      {/* Taste History Sidebar */}
      <div className={`${showHistory ? 'block' : 'hidden'} lg:block w-80 bg-white border-l border-gray-200`}>
        <TasteHistory />
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import ChatInput from '@/components/ChatInput'
import MessageBubble from '@/components/MessageBubble'
import RecommendationCard from '@/components/RecommendationCard'
import TasteHistory from '@/components/TasteHistory'
import { Menu, X, Sparkles, ArrowLeft } from 'lucide-react'
import { useTheme } from './ThemeContext'

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
  const { theme } = useTheme();

  const handleUserInput = async (input: string) => {
    // Add user message with animation
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
    <div style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }} className="flex h-screen w-full m-0 p-0 relative overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, #0ea5e9 0%, transparent 50%), 
                           radial-gradient(circle at 80% 20%, #a855f7 0%, transparent 50%),
                           radial-gradient(circle at 40% 40%, #f0f9ff 0%, transparent 50%)`
        }} />
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <header style={{ background: 'var(--color-card-bg)', color: 'var(--color-text-primary)', borderColor: 'var(--color-card-border)' }} className="border-b p-4 flex items-center justify-between shadow-sm navbar-blur">
          <div className="flex items-center space-x-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 rounded-xl transition-all duration-300 ease-in-out hover:scale-105"
                style={{ color: 'var(--color-text-secondary)', background: 'var(--color-bg-secondary)' }}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'var(--color-accent)' }}>
              <Sparkles className="w-6 h-6" style={{ color: 'var(--color-on-accent)' }} />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>TasteTrip AI</h1>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Your Cultural Discovery Assistant</p>
            </div>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="lg:hidden p-2 rounded-xl transition-all duration-300 ease-in-out hover:scale-105"
            style={{ color: 'var(--color-text-secondary)', background: 'var(--color-bg-secondary)' }}
          >
            {showHistory ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((message, index) => (
            <div key={message.id} className="message-enter" style={{ animationDelay: `${index * 100}ms` }}>
              <MessageBubble message={message} />
              {message.recommendations && (
                <div className="mt-4 grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                  {message.recommendations.map((rec, recIndex) => (
                    <div key={recIndex} className="slide-up" style={{ animationDelay: `${recIndex * 150}ms` }}>
                      <RecommendationCard recommendation={rec} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="message-enter">
              <MessageBubble 
                message={{
                  id: 'loading',
                  type: 'ai',
                  content: 'Analyzing your taste profile and finding perfect recommendations',
                  timestamp: new Date()
                }}
                isLoading={true}
              />
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="p-4 navbar-blur border-t shadow-sm" style={{ background: 'var(--color-card-bg)', borderColor: 'var(--color-card-border)' }}>
          <ChatInput onSubmit={handleUserInput} disabled={isLoading} />
        </div>
      </div>

      {/* Taste History Sidebar */}
      <div className={`${showHistory ? 'block' : 'hidden'} lg:block w-80 navbar-blur border-l relative z-10`} style={{ background: 'var(--color-card-bg)', borderColor: 'var(--color-card-border)' }}>
        <TasteHistory />
      </div>
    </div>
  )
}
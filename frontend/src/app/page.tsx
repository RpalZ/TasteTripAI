'use client'

import { useState, useEffect } from 'react'
import { Search, Sparkles, ArrowRight, Globe, MapPin, Heart } from 'lucide-react'
import ChatInterface from '@/components/ChatInterface'

interface TravelIdea {
  id: string
  title: string
  subtitle: string
  emoji: string
  gradient: string
}

const landmarks = [
  'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&h=1080&fit=crop', // London
  'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=1920&h=1080&fit=crop', // Paris
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop', // Santorini
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1920&h=1080&fit=crop', // Tokyo
  'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1920&h=1080&fit=crop', // Dubai
]

const travelIdeas: TravelIdea[] = [
  {
    id: '1',
    title: 'Jazz in Tokyo',
    subtitle: 'Intimate venues & sake bars',
    emoji: '🎷',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: '2',
    title: 'Cuisine in Rome',
    subtitle: 'Authentic trattorias & wine',
    emoji: '🍝',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    id: '3',
    title: 'Art in Barcelona',
    subtitle: 'Galleries & street culture',
    emoji: '🎨',
    gradient: 'from-blue-500 to-purple-500'
  },
  {
    id: '4',
    title: 'Markets in Marrakech',
    subtitle: 'Spices & handcrafted goods',
    emoji: '🏺',
    gradient: 'from-yellow-500 to-orange-500'
  },
  {
    id: '5',
    title: 'Music in Nashville',
    subtitle: 'Live venues & local sounds',
    emoji: '🎸',
    gradient: 'from-green-500 to-blue-500'
  },
  {
    id: '6',
    title: 'Fashion in Milan',
    subtitle: 'Boutiques & design studios',
    emoji: '👗',
    gradient: 'from-pink-500 to-purple-500'
  }
]

export default function Home() {
  const [showChat, setShowChat] = useState(false)
  const [currentLandmark, setCurrentLandmark] = useState(0)
  const [searchFocused, setSearchFocused] = useState(false)

  // Rotate background landmarks
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLandmark((prev) => (prev + 1) % landmarks.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleSearchClick = () => {
    setShowChat(true)
  }

  const handleTravelIdeaClick = (idea: TravelIdea) => {
    // Pre-fill the chat with the travel idea
    setShowChat(true)
    // You can pass the idea to the chat interface here
  }

  if (showChat) {
    return <ChatInterface />
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Landmarks Carousel */}
      <div className="absolute inset-0 z-0">
        {landmarks.map((landmark, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentLandmark ? 'opacity-30' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${landmark})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-pink-900/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">TasteTrip AI</h1>
              <p className="text-blue-100 text-sm">Cultural Discovery Assistant</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6 text-white/80">
            <button className="hover:text-white transition-colors">Discover</button>
            <button className="hover:text-white transition-colors">Explore</button>
            <button className="hover:text-white transition-colors">About</button>
          </div>
        </header>

        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Headline */}
            <div className="mb-8">
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
                Discover Your
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {' '}Perfect{' '}
                </span>
                Cultural Journey
              </h2>
              <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                AI-powered recommendations for food, music, art, and travel experiences tailored to your unique taste
              </p>
            </div>

            {/* Search Input */}
            <div className="mb-12">
              <div 
                className={`relative max-w-2xl mx-auto transition-all duration-300 ${
                  searchFocused ? 'scale-105' : 'scale-100'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-lg opacity-30" />
                <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-2 shadow-2xl">
                  <div className="flex items-center">
                    <Search className="w-6 h-6 text-gray-400 ml-6" />
                    <input
                      type="text"
                      placeholder="Start planning your cultural trip..."
                      className="flex-1 px-6 py-4 text-lg bg-transparent border-none outline-none text-gray-800 placeholder-gray-500"
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)}
                      onClick={handleSearchClick}
                      readOnly
                    />
                    <button
                      onClick={handleSearchClick}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mb-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">50K+</div>
                <div className="text-blue-200 text-sm">Cultural Spots</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">120+</div>
                <div className="text-blue-200 text-sm">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">AI</div>
                <div className="text-blue-200 text-sm">Powered</div>
              </div>
            </div>
          </div>
        </div>

        {/* Travel Ideas Section */}
        <div className="px-6 pb-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Popular Cultural Experiences
              </h3>
              <p className="text-blue-200">
                Get inspired by these curated cultural journeys
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {travelIdeas.map((idea) => (
                <button
                  key={idea.id}
                  onClick={() => handleTravelIdeaClick(idea)}
                  className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/30 hover:scale-105"
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${idea.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                  
                  <div className="relative">
                    <div className="text-4xl mb-3">{idea.emoji}</div>
                    <h4 className="text-xl font-semibold text-white mb-2">
                      {idea.title}
                    </h4>
                    <p className="text-blue-200 text-sm mb-4">
                      {idea.subtitle}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-300 uppercase tracking-wide">
                        Explore
                      </span>
                      <ArrowRight className="w-4 h-4 text-blue-300 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="px-6 pb-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <Globe className="w-12 h-12 text-blue-300 mx-auto mb-4" />
              <h4 className="text-2xl font-bold text-white mb-3">
                Ready to Discover?
              </h4>
              <p className="text-blue-200 mb-6">
                Join thousands of cultural explorers finding their perfect experiences
              </p>
              <button
                onClick={handleSearchClick}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Start Your Journey
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 animate-pulse">
        <div className="w-3 h-3 bg-blue-400 rounded-full opacity-60" />
      </div>
      <div className="absolute top-1/3 right-16 animate-pulse delay-1000">
        <div className="w-2 h-2 bg-purple-400 rounded-full opacity-60" />
      </div>
      <div className="absolute bottom-1/4 left-1/4 animate-pulse delay-2000">
        <div className="w-4 h-4 bg-pink-400 rounded-full opacity-40" />
      </div>
    </div>
  )
}
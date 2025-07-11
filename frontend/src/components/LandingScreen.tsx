'use client'

import { useState, useEffect } from 'react'
import { Search, ArrowRight, Globe, Sparkles, Users, MapPin, Zap } from 'lucide-react'

interface TravelIdea {
  id: string
  title: string
  subtitle: string
  emoji: string
  gradient: string
}

interface LandingScreenProps {
  onStartChat: () => void
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
    gradient: 'from-lavender-500 to-sky-500'
  },
  {
    id: '2',
    title: 'Cuisine in Rome',
    subtitle: 'Authentic trattorias & wine',
    emoji: '🍝',
    gradient: 'from-orange-400 to-red-400'
  },
  {
    id: '3',
    title: 'Art in Barcelona',
    subtitle: 'Galleries & street culture',
    emoji: '🎨',
    gradient: 'from-sky-500 to-lavender-500'
  },
  {
    id: '4',
    title: 'Markets in Marrakech',
    subtitle: 'Spices & handcrafted goods',
    emoji: '🏺',
    gradient: 'from-yellow-400 to-orange-400'
  },
  {
    id: '5',
    title: 'Music in Nashville',
    subtitle: 'Live venues & local sounds',
    emoji: '🎸',
    gradient: 'from-mint-500 to-sky-500'
  },
  {
    id: '6',
    title: 'Fashion in Milan',
    subtitle: 'Boutiques & design studios',
    emoji: '👗',
    gradient: 'from-lavender-500 to-mint-500'
  }
]

export default function LandingScreen({ onStartChat }: LandingScreenProps) {
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
    onStartChat()
  }

  const handleTravelIdeaClick = (idea: TravelIdea) => {
    onStartChat()
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden m-0 p-0 pt-16 bg-sky-50">
      {/* Background Landmarks Carousel */}
      <div className="absolute inset-0 z-0">
        {landmarks.map((landmark, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${
              index === currentLandmark ? 'opacity-20' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${landmark})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-sky-50/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Headline */}
            <div className="mb-8 slide-up">
              <h2 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Discover Your
                <span className="text-sky-500">
                  {' '}Perfect{' '}
                </span>
                Cultural Journey
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
                AI-powered recommendations for food, music, art, and travel experiences tailored to your unique taste
              </p>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12 slide-up stagger-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
                <MapPin className="w-8 h-8 text-sky-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900 mb-1">50K+</div>
                <div className="text-gray-600 text-sm">Cultural Spots</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
                <Globe className="w-8 h-8 text-lavender-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900 mb-1">120+</div>
                <div className="text-gray-600 text-sm">Countries</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
                <Zap className="w-8 h-8 text-mint-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900 mb-1">AI</div>
                <div className="text-gray-600 text-sm">Powered</div>
              </div>
            </div>

            {/* Search Input */}
            <div className="mb-12 slide-up stagger-2">
              <div 
                className={`relative max-w-2xl mx-auto transition-all duration-500 ease-in-out ${
                  searchFocused ? 'scale-102' : 'scale-100'
                }`}
              >
                <div className="absolute inset-0 bg-sky-500/20 rounded-3xl blur-lg opacity-30" />
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
                      className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl flex items-center space-x-2 hover:scale-105"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bold CTA Button */}
            <div className="mb-16 slide-up stagger-3">
              <button
                onClick={handleSearchClick}
                className="bg-sky-500 hover:bg-sky-600 text-white px-12 py-6 rounded-3xl text-xl font-bold transition-all duration-300 ease-in-out shadow-2xl hover:shadow-3xl hover:scale-110 border-2 border-white/20"
              >
                Start Your Cultural Journey
              </button>
            </div>
          </div>
        </div>

        {/* Travel Ideas Section */}
        <div className="px-6 pb-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 slide-up stagger-4">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Popular Cultural Experiences
              </h3>
              <p className="text-gray-600">
                Get inspired by these curated cultural journeys
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {travelIdeas.map((idea, index) => (
                <button
                  key={idea.id}
                  onClick={() => handleTravelIdeaClick(idea)}
                  className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/90 transition-all duration-300 ease-in-out border border-gray-100 hover:border-sky-200 hover:scale-105 slide-up stagger-${index + 5}`}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${idea.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                  
                  <div className="relative">
                    <div className="text-4xl mb-3">{idea.emoji}</div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                      {idea.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4">
                      {idea.subtitle}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">
                        Explore
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="px-6 pb-8">
          <div className="max-w-4xl mx-auto text-center slide-up stagger-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-100">
              <Users className="w-12 h-12 text-sky-500 mx-auto mb-4" />
              <h4 className="text-2xl font-bold text-gray-900 mb-3">
                Ready to Discover?
              </h4>
              <p className="text-gray-600 mb-6">
                Join thousands of cultural explorers finding their perfect experiences
              </p>
              <button
                onClick={handleSearchClick}
                className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl hover:scale-105"
              >
                Start Your Journey
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
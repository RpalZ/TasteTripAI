'use client'

import { useState, useEffect } from 'react'
import { Search, ArrowRight, Globe, Sparkles, Users, MapPin, Zap } from 'lucide-react'
import { useTheme } from './ThemeContext'

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

const travelDestinations = [
  {
    id: '1',
    title: 'Jazz in Tokyo',
    subtitle: 'Jazz cafés & sushi in Tokyo',
    location: 'Tokyo, Japan',
    popularity: '3,200+ travelers',
    rating: 4.8,
    emoji: '🎷',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop',
    gradient: 'from-lavender-500 to-sky-500'
  },
  {
    id: '2',
    title: 'Cuisine in Rome',
    subtitle: 'Authentic trattorias & wine',
    location: 'Rome, Italy',
    popularity: '4,800+ travelers',
    rating: 4.9,
    emoji: '🍝',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=600&fit=crop',
    gradient: 'from-orange-400 to-red-400'
  },
  {
    id: '3',
    title: 'Art in Barcelona',
    subtitle: 'Galleries & street culture',
    location: 'Barcelona, Spain',
    popularity: '2,900+ travelers',
    rating: 4.7,
    emoji: '🎨',
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop',
    gradient: 'from-sky-500 to-lavender-500'
  },
  {
    id: '4',
    title: 'Markets in Marrakech',
    subtitle: 'Spices & handcrafted goods',
    location: 'Marrakech, Morocco',
    popularity: '1,800+ travelers',
    rating: 4.6,
    emoji: '🏺',
    image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&h=600&fit=crop',
    gradient: 'from-yellow-400 to-orange-400'
  },
  {
    id: '5',
    title: 'Music in Nashville',
    subtitle: 'Live venues & local sounds',
    location: 'Nashville, USA',
    popularity: '2,400+ travelers',
    rating: 4.5,
    emoji: '🎸',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
    gradient: 'from-mint-500 to-sky-500'
  },
  {
    id: '6',
    title: 'Fashion in Milan',
    subtitle: 'Boutiques & design studios',
    location: 'Milan, Italy',
    popularity: '3,600+ travelers',
    rating: 4.8,
    emoji: '👗',
    image: '/fashion-milan-galleria.jpg',
    gradient: 'from-lavender-500 to-mint-500'
  }
]

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
  const { theme } = useTheme();
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
    // Scroll to center the chat component in viewport
    setTimeout(() => {
      const chatSection = document.getElementById('chat-section')
      if (chatSection) {
        const navbarHeight = 64 // Height of sticky navbar
        const elementTop = chatSection.offsetTop
        const elementHeight = chatSection.offsetHeight
        const windowHeight = window.innerHeight
        const scrollTo = elementTop - navbarHeight - (windowHeight - elementHeight) / 2
        
        window.scrollTo({
          top: Math.max(0, scrollTo),
          behavior: 'smooth'
        })
      }
    }, 100)
    onStartChat()
  }

  const handleTravelIdeaClick = (destination: typeof travelDestinations[0]) => {
    // Pre-fill chat with trip planning message
    onStartChat()
    // Note: In a real implementation, you'd pass this message to the chat component
    console.log(`Plan me a trip like this: ${destination.subtitle} in ${destination.location}`)
  }

  return (
    <div style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }} className="min-h-screen w-full relative overflow-hidden m-0 p-0">
      {/* Background Landmarks Carousel */}
      <div className="absolute inset-0 z-0">
        {landmarks.map((landmark, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${
              index === currentLandmark ? 'opacity-10' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${landmark})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-white/90" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col" style={{ background: 'var(--color-bg-primary)' }}>
        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-6 py-12" style={{ background: 'var(--color-bg-primary)' }}>
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Headline */}
            <div className="mb-8 slide-up">
              <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{ color: 'var(--color-text-primary)' }}>
                Discover Your
                <span style={{ color: 'var(--color-accent)' }}> Perfect </span>
                Cultural Journey
              </h2>
              <p className="text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed mb-8" style={{ color: 'var(--color-text-secondary)' }}>
                AI-powered recommendations for food, music, art, and travel experiences tailored to your unique taste
              </p>
            </div>

            {/* Search Input */}
            <div id="chat-section" className="mb-12 slide-up stagger-1">
              <div 
                className={`relative max-w-2xl mx-auto transition-all duration-500 ease-in-out ${
                  searchFocused ? 'scale-102' : 'scale-100'
                }`}
              >
                <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-2 shadow-2xl border border-gray-100">
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
                      style={{ background: 'var(--color-accent)', color: 'var(--color-on-accent)' }}
                      className="px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl flex items-center space-x-2 hover:scale-105"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Travel Ideas Section */}
        <div className="px-6 pb-12" style={{ background: 'var(--color-bg-primary)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 slide-up stagger-2">
              <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                Popular Cultural Destinations
              </h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Get inspired by these curated cultural journeys from real travelers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {travelDestinations.map((destination, index) => (
                <button
                  key={destination.id}
                  onClick={() => handleTravelIdeaClick(destination)}
                  className={`group relative rounded-2xl overflow-hidden transition-all duration-300 ease-in-out border hover:scale-105 slide-up stagger-${index + 3} shadow-lg hover:shadow-xl`}
                  style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-card-border)' }}
                >
                  {/* Destination Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={destination.image} 
                      alt={destination.location}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="text-3xl">{destination.emoji}</span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center space-x-1 rounded-full px-2 py-1" style={{ background: 'var(--color-bg-secondary)' }}>
                        <span style={{ color: 'var(--color-accent-secondary)', fontSize: '0.875rem' }}>★</span>
                        <span className="text-xs font-medium" style={{ color: 'var(--color-text-primary)' }}>{destination.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-3">
                      <h4 className="text-xl font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                        {destination.title}
                      </h4>
                      <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                        {destination.subtitle}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                        📍 {destination.location}
                      </p>
                    </div>
                    
                    {/* Popularity */}
                    <div className="mb-4">
                      <p className="text-xs font-medium" style={{ color: 'var(--color-accent)' }}>
                        Used by {destination.popularity}
                      </p>
                    </div>
                    
                    {/* CTA Button */}
                    <div style={{ background: 'var(--color-accent)', color: 'var(--color-on-accent)' }} className="px-4 py-2 rounded-xl font-medium transition-all duration-300 ease-in-out flex items-center justify-center space-x-2 group-hover:scale-105">
                      <span>Start with this trip</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="px-6 pb-8" style={{ background: 'var(--color-bg-primary)' }}>
          <div className="max-w-4xl mx-auto text-center slide-up stagger-6">
            <button
              onClick={handleSearchClick}
              style={{ background: 'var(--color-accent)', color: 'var(--color-on-accent)' }}
              className="px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl hover:scale-105"
            >
              Start Your Journey
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
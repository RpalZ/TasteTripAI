'use client'

import { useState, useEffect } from 'react'
import { Sparkles, ArrowRight, Search, MapPin, MessageCircle, Zap, Globe, Users, Heart, Bot, Map, Compass } from 'lucide-react'

interface LandingPageProps {
  onGetStarted: () => void
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 50)
      
      // Determine active section based on scroll position
      const sections = document.querySelectorAll('.scroll-section')
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect()
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
          setActiveSection(index)
        }
      })
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Floating Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-sky-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">TasteTrip AI</span>
            </div>
            <button
              onClick={onGetStarted}
              className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl hover:scale-105"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="scroll-section min-h-screen flex items-center justify-center px-6 pt-20 bg-white relative overflow-hidden">
        {/* Subtle Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, #0ea5e9 0%, transparent 50%), 
                             radial-gradient(circle at 80% 20%, #a855f7 0%, transparent 50%)`
          }} />
        </div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="fade-in">
            <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-8 leading-tight">
              Discover Your Perfect
              <span className="text-sky-500 block">Cultural Journey</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
              AI-powered recommendations for food, music, art, and travel experiences tailored to your unique taste preferences
            </p>
            
            <button
              onClick={onGetStarted}
              className="bg-sky-500 hover:bg-sky-600 text-white px-12 py-6 rounded-3xl text-xl font-semibold transition-all duration-300 ease-in-out shadow-xl hover:shadow-2xl hover:scale-105 mb-16"
            >
              <span className="flex items-center space-x-3">
                <span>Start Your Journey</span>
                <ArrowRight className="w-6 h-6" />
              </span>
            </button>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-sky-500 mb-2">50K+</div>
                <div className="text-gray-600 text-lg">Cultural Spots</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-lavender-500 mb-2">120+</div>
                <div className="text-gray-600 text-lg">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-mint-500 mb-2">AI</div>
                <div className="text-gray-600 text-lg">Powered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Assistant Section */}
      <section className="scroll-section min-h-screen flex items-center px-6 bg-sky-50/30 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="slide-up">
            <div className="w-16 h-16 bg-sky-100 rounded-3xl flex items-center justify-center mb-8">
              <MessageCircle className="w-8 h-8 text-sky-600" />
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Your Personal Cultural Assistant
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Simply describe your tastes and preferences in natural language. Our AI understands your unique style and discovers cultural experiences you'll love.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                <span className="text-gray-700">Natural conversation interface</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                <span className="text-gray-700">Learns from your preferences</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                <span className="text-gray-700">Instant personalized recommendations</span>
              </div>
            </div>
          </div>
          
          <div className="slide-up stagger-1">
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-mint-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 flex-1">
                    <p className="text-gray-800">Hi! Tell me about your cultural interests. What kind of food, music, or places do you enjoy?</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 justify-end">
                  <div className="bg-sky-500 text-white rounded-2xl p-4 max-w-xs">
                    <p>I love jazz music and Italian cuisine, especially in cozy intimate settings</p>
                  </div>
                  <div className="w-10 h-10 bg-sky-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">You</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-mint-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 flex-1">
                    <p className="text-gray-800">Perfect! I found some amazing jazz clubs and Italian restaurants that match your taste...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cultural Matching Section */}
      <section className="scroll-section min-h-screen flex items-center px-6 bg-lavender-50/30 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="slide-up order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:scale-105 transition-transform duration-300">
                <div className="text-3xl mb-3">🎶</div>
                <h4 className="font-semibold text-gray-900 mb-2">Music</h4>
                <p className="text-gray-600 text-sm">Jazz clubs, concerts, festivals</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:scale-105 transition-transform duration-300">
                <div className="text-3xl mb-3">🍜</div>
                <h4 className="font-semibold text-gray-900 mb-2">Food</h4>
                <p className="text-gray-600 text-sm">Restaurants, local cuisine, markets</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:scale-105 transition-transform duration-300">
                <div className="text-3xl mb-3">🎭</div>
                <h4 className="font-semibold text-gray-900 mb-2">Culture</h4>
                <p className="text-gray-600 text-sm">Museums, galleries, theaters</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:scale-105 transition-transform duration-300">
                <div className="text-3xl mb-3">✈️</div>
                <h4 className="font-semibold text-gray-900 mb-2">Travel</h4>
                <p className="text-gray-600 text-sm">Destinations, experiences, adventures</p>
              </div>
            </div>
          </div>
          
          <div className="slide-up order-1 lg:order-2">
            <div className="w-16 h-16 bg-lavender-100 rounded-3xl flex items-center justify-center mb-8">
              <Zap className="w-8 h-8 text-lavender-600" />
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Smart Cultural Matching
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Our AI analyzes your preferences across multiple cultural domains to find experiences that truly resonate with your taste.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-lavender-500 rounded-full"></div>
                <span className="text-gray-700">Cross-domain recommendations</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-lavender-500 rounded-full"></div>
                <span className="text-gray-700">Taste profile learning</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-lavender-500 rounded-full"></div>
                <span className="text-gray-700">Personalized discovery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Integration Section */}
      <section className="scroll-section min-h-screen flex items-center px-6 bg-mint-50/30 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="slide-up">
            <div className="w-16 h-16 bg-mint-100 rounded-3xl flex items-center justify-center mb-8">
              <Map className="w-8 h-8 text-mint-600" />
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Explore with Interactive Maps
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Discover cultural experiences near you or in your dream destinations with integrated maps and real-world locations.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-mint-500 rounded-full"></div>
                <span className="text-gray-700">Real-time location data</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-mint-500 rounded-full"></div>
                <span className="text-gray-700">Interactive exploration</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-mint-500 rounded-full"></div>
                <span className="text-gray-700">Direct booking links</span>
              </div>
            </div>
          </div>
          
          <div className="slide-up stagger-1">
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 relative overflow-hidden">
              <div className="aspect-video bg-mint-50 rounded-2xl flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-mint-100 to-mint-200 rounded-2xl"></div>
                <div className="relative z-10 text-center">
                  <MapPin className="w-12 h-12 text-mint-600 mx-auto mb-4" />
                  <p className="text-mint-700 font-medium">Interactive Map View</p>
                  <p className="text-mint-600 text-sm">Discover cultural spots worldwide</p>
                </div>
                
                {/* Mock map pins */}
                <div className="absolute top-4 left-6 w-3 h-3 bg-sky-500 rounded-full animate-pulse"></div>
                <div className="absolute top-8 right-8 w-3 h-3 bg-lavender-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute bottom-6 left-12 w-3 h-3 bg-mint-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-8 right-6 w-3 h-3 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="scroll-section min-h-screen flex items-center justify-center px-6 bg-white relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="slide-up">
            <div className="w-20 h-20 bg-sky-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
              <Compass className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
              Ready to Explore?
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of cultural explorers discovering their perfect experiences with AI-powered recommendations
            </p>
            <button
              onClick={onGetStarted}
              className="bg-sky-500 hover:bg-sky-600 text-white px-12 py-6 rounded-3xl text-xl font-semibold transition-all duration-300 ease-in-out shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Explore TasteTrip
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-sky-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">TasteTrip AI</span>
              </div>
              <p className="text-gray-600 max-w-md">
                Discover your perfect cultural journey with AI-powered recommendations tailored to your unique taste.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-sky-600 transition-colors">About</a></li>
                <li><a href="#" className="text-gray-600 hover:text-sky-600 transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-sky-600 transition-colors">Terms</a></li>
                <li><a href="#" className="text-gray-600 hover:text-sky-600 transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-12 pt-8 text-center">
            <p className="text-gray-500">
              © 2025 TasteTrip AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { Sparkles, ArrowRight, Zap, Globe, Users, Heart, Search, MapPin, Music, Utensils } from 'lucide-react'

interface LandingPageProps {
  onGetStarted: () => void
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Floating Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 navbar-blur shadow-lg' 
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
              className="btn-primary"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-gradient min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Discover Your Perfect
              <span className="text-sky-500"> Cultural Journey</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
              AI-powered recommendations for food, music, art, and travel experiences tailored to your unique taste preferences
            </p>
            
            <button
              onClick={onGetStarted}
              className="bg-sky-500 hover:bg-sky-600 text-white px-12 py-6 rounded-3xl text-xl font-semibold transition-all duration-300 ease-in-out shadow-xl hover:shadow-2xl hover:scale-105 mb-16"
            >
              <span className="flex items-center space-x-3">
                <span>Get Started</span>
                <ArrowRight className="w-6 h-6" />
              </span>
            </button>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-sky-600 mb-2">50K+</div>
                <div className="text-gray-600">Cultural Spots</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-lavender-600 mb-2">120+</div>
                <div className="text-gray-600">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-mint-600 mb-2">AI</div>
                <div className="text-gray-600">Powered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-gradient py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 slide-up">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How TasteTrip AI Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our intelligent system learns your preferences and discovers cultural experiences you'll love
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="feature-card slide-up stagger-1">
              <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-sky-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Share Your Tastes
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Tell us about your preferences in food, music, art, and travel. Our AI understands your unique style and cultural interests.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card slide-up stagger-2">
              <div className="w-16 h-16 bg-lavender-100 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-lavender-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                AI-Powered Matching
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced algorithms analyze your taste profile and match you with cultural experiences from around the world.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card slide-up stagger-3">
              <div className="w-16 h-16 bg-mint-100 rounded-2xl flex items-center justify-center mb-6">
                <MapPin className="w-8 h-8 text-mint-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Discover & Explore
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Get personalized recommendations with real locations, reviews, and booking options for your next cultural adventure.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="feature-card slide-up stagger-4">
              <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mb-6">
                <Utensils className="w-8 h-8 text-sky-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Culinary Adventures
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Discover restaurants, local cuisines, and food experiences that match your palate and dining preferences.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="feature-card slide-up stagger-5">
              <div className="w-16 h-16 bg-lavender-100 rounded-2xl flex items-center justify-center mb-6">
                <Music className="w-8 h-8 text-lavender-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Musical Journeys
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Find concerts, music venues, and cultural events that resonate with your musical taste and artistic sensibilities.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="feature-card slide-up stagger-6">
              <div className="w-16 h-16 bg-mint-100 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-mint-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Global Connections
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with cultures worldwide through authentic experiences, local insights, and meaningful travel recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-sky-50 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="slide-up">
            <div className="w-20 h-20 bg-sky-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ready to Explore?
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
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
      <footer className="bg-white border-t border-gray-100 py-16 px-6">
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

          <div className="border-t border-gray-100 mt-12 pt-8 text-center">
            <p className="text-gray-500">
              © 2025 TasteTrip AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
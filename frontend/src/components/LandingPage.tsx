'use client'

import { useState, useEffect } from 'react'
import { Sparkles, ArrowRight, Search, MapPin, MessageCircle, Zap, Globe, Users, Heart, Bot, Map, Compass } from 'lucide-react'
import { useTheme } from './ThemeContext'
import GoogleMap from './GoogleMap';

interface LandingPageProps {
  onGetStarted: () => void
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const { theme } = useTheme();
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
    <div style={{ background: theme === 'dark' ? '#101828' : '#fff', color: 'var(--color-text-primary)' }} className="min-h-screen">
      {/* Floating Navbar */}
      <nav style={{ background: isScrolled ? 'var(--color-bg-navbar)' : 'transparent', backdropFilter: isScrolled ? 'blur(8px)' : undefined, boxShadow: isScrolled ? '0 4px 24px 0 rgba(0,0,0,0.07)' : undefined }} className="fixed top-0 left-0 right-0 z-50 transition-all duration-500">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div style={{ background: 'var(--color-accent)' }} className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6" style={{ color: 'var(--color-on-accent)' }} />
              </div>
              <span className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>TasteTrip AI</span>
            </div>
            <button
              onClick={onGetStarted}
              style={{ background: 'var(--color-accent)', color: 'var(--color-on-accent)' }}
              className="px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl hover:scale-105"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="scroll-section min-h-screen flex items-center justify-center px-6 pt-20 relative overflow-hidden" style={{ background: theme === 'dark' ? '#101828' : '#fff' }}>
        {/* Subtle Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, var(--color-accent) 0%, transparent 50%), 
                             radial-gradient(circle at 80% 20%, var(--color-accent-secondary) 0%, transparent 50%)`
          }} />
        </div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="fade-in">
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight" style={{ color: 'var(--color-text-primary)' }}>
              Discover Your Perfect
              <span style={{ color: 'var(--color-accent)' }} className="block">Cultural Journey</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-12" style={{ color: 'var(--color-text-secondary)' }}>
              AI-powered recommendations for food, music, art, and travel experiences tailored to your unique taste preferences
            </p>
            
            <button
              onClick={onGetStarted}
              style={{ background: 'var(--color-accent)', color: 'var(--color-on-accent)' }}
              className="px-12 py-6 rounded-3xl text-xl font-semibold transition-all duration-300 ease-in-out shadow-xl hover:shadow-2xl hover:scale-105 mb-16"
            >
              <span className="flex items-center space-x-3">
                <span>Start Your Journey</span>
                <ArrowRight className="w-6 h-6" />
              </span>
            </button>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: 'var(--color-accent)' }}>50K+</div>
                <div className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>Cultural Spots</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: 'var(--color-accent-secondary)' }}>120+</div>
                <div className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>Countries</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: 'var(--color-accent-tertiary)' }}>AI</div>
                <div className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>Powered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Assistant Section */}
      <section className="scroll-section min-h-screen flex items-center px-6 relative" style={{ background: theme === 'dark' ? '#101828' : '#fff' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="slide-up">
            <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-8" style={{ background: 'var(--color-accent-bg)' }}>
              <MessageCircle className="w-8 h-8" style={{ color: 'var(--color-accent)' }} />
            </div>
            <h2 className="text-5xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
              Your Personal Cultural Assistant
            </h2>
            <p className="text-xl leading-relaxed mb-8" style={{ color: 'var(--color-text-secondary)' }}>
              Simply describe your tastes and preferences in natural language. Our AI understands your unique style and discovers cultural experiences you'll love.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-accent)' }}></div>
                <span style={{ color: 'var(--color-text-tertiary)' }}>Natural conversation interface</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-accent)' }}></div>
                <span style={{ color: 'var(--color-text-tertiary)' }}>Learns from your preferences</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-accent)' }}></div>
                <span style={{ color: 'var(--color-text-tertiary)' }}>Instant personalized recommendations</span>
              </div>
            </div>
          </div>
          
          <div className="slide-up stagger-1">
            <div className="rounded-3xl p-8 shadow-2xl border" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-accent-tertiary)' }}>
                    <Bot className="w-5 h-5" style={{ color: 'var(--color-on-accent)' }} />
                  </div>
                  <div className="rounded-2xl p-4 flex-1" style={{ background: 'var(--color-bg-secondary)' }}>
                    <p style={{ color: 'var(--color-text-primary)' }}>Hi! Tell me about your cultural interests. What kind of food, music, or places do you enjoy?</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 justify-end">
                  <div className="rounded-2xl p-4 max-w-xs" style={{ background: 'var(--color-accent)', color: 'var(--color-on-accent)' }}>
                    <p>I love jazz music and Italian cuisine, especially in cozy intimate settings</p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-accent)' }}>
                    <span style={{ color: 'var(--color-on-accent)', fontSize: '0.875rem' }}>You</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-accent-tertiary)' }}>
                    <Bot className="w-5 h-5" style={{ color: 'var(--color-on-accent)' }} />
                  </div>
                  <div className="rounded-2xl p-4 flex-1" style={{ background: 'var(--color-bg-secondary)' }}>
                    <p style={{ color: 'var(--color-text-primary)' }}>Perfect! I found some amazing jazz clubs and Italian restaurants that match your taste...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cultural Matching Section */}
      <section className="scroll-section min-h-screen flex items-center px-6 relative" style={{ background: theme === 'dark' ? '#101828' : '#fff' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="slide-up order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-2xl p-6 shadow-lg border hover:scale-105 transition-transform duration-300" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
                <div className="text-3xl mb-3">🎶</div>
                <h4 className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Music</h4>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Jazz clubs, concerts, festivals</p>
              </div>
              <div className="rounded-2xl p-6 shadow-lg border hover:scale-105 transition-transform duration-300" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
                <div className="text-3xl mb-3">🍜</div>
                <h4 className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Food</h4>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Restaurants, local cuisine, markets</p>
              </div>
              <div className="rounded-2xl p-6 shadow-lg border hover:scale-105 transition-transform duration-300" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
                <div className="text-3xl mb-3">🎭</div>
                <h4 className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Culture</h4>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Museums, galleries, theaters</p>
              </div>
              <div className="rounded-2xl p-6 shadow-lg border hover:scale-105 transition-transform duration-300" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
                <div className="text-3xl mb-3">✈️</div>
                <h4 className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Travel</h4>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Destinations, experiences, adventures</p>
              </div>
            </div>
          </div>
          
          <div className="slide-up order-1 lg:order-2">
            <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-8" style={{ background: 'var(--color-accent-secondary-bg)' }}>
              <Zap className="w-8 h-8" style={{ color: 'var(--color-accent-secondary)' }} />
            </div>
            <h2 className="text-5xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
              Smart Cultural Matching
            </h2>
            <p className="text-xl leading-relaxed mb-8" style={{ color: 'var(--color-text-secondary)' }}>
              Our AI analyzes your preferences across multiple cultural domains to find experiences that truly resonate with your taste.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-accent-secondary)' }}></div>
                <span style={{ color: 'var(--color-text-tertiary)' }}>Cross-domain recommendations</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-accent-secondary)' }}></div>
                <span style={{ color: 'var(--color-text-tertiary)' }}>Taste profile learning</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-accent-secondary)' }}></div>
                <span style={{ color: 'var(--color-text-tertiary)' }}>Personalized discovery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Integration Section */}
      <section className="scroll-section min-h-screen flex flex-col items-center px-6 justify-center relative" style={{ background: theme === 'dark' ? '#101828' : '#fff' }}>
        <div className="max-w-4xl w-full mx-auto text-center mb-8">
          <h2 className="text-5xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
            Explore with Interactive Maps
          </h2>
          <p className="text-xl leading-relaxed mb-8" style={{ color: 'var(--color-text-secondary)' }}>
            Discover cultural experiences near you or in your dream destinations with integrated maps and real-world locations.
          </p>
        </div>
        <div className="w-full max-w-4xl flex justify-center">
          <div className="w-full h-[500px] rounded-xl shadow-lg overflow-hidden">
            <GoogleMap />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="scroll-section min-h-screen flex items-center justify-center px-6 relative" style={{ background: theme === 'dark' ? '#101828' : '#fff' }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="slide-up">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl" style={{ background: 'var(--color-accent)' }}>
              <Compass className="w-10 h-10" style={{ color: 'var(--color-on-accent)' }} />
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-8" style={{ color: 'var(--color-text-primary)' }}>
              Ready to Explore?
            </h2>
            <p className="text-xl mb-12 max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              Join thousands of cultural explorers discovering their perfect experiences with AI-powered recommendations
            </p>
            <button
              onClick={onGetStarted}
              style={{ background: 'var(--color-accent)', color: 'var(--color-on-accent)' }}
              className="px-12 py-6 rounded-3xl text-xl font-semibold transition-all duration-300 ease-in-out shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Explore TasteTrip
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-16 px-6" style={{ background: 'var(--color-bg-footer)', borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'var(--color-accent)' }}>
                  <Sparkles className="w-6 h-6" style={{ color: 'var(--color-on-accent)' }} />
                </div>
                <span className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>TasteTrip AI</span>
              </div>
              <p style={{ color: 'var(--color-text-secondary)' }} className="max-w-md">
                Discover your perfect cultural journey with AI-powered recommendations tailored to your unique taste.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Company</h4>
              <ul className="space-y-2">
                <li><a href="#" style={{ color: 'var(--color-text-secondary)' }} className="hover:underline">About</a></li>
                <li><a href="#" style={{ color: 'var(--color-text-secondary)' }} className="hover:underline">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" style={{ color: 'var(--color-text-secondary)' }} className="hover:underline">Terms</a></li>
                <li><a href="#" style={{ color: 'var(--color-text-secondary)' }} className="hover:underline">Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 text-center" style={{ borderColor: 'var(--color-border)' }}>
            <p style={{ color: 'var(--color-text-tertiary)' }}>
              © 2025 TasteTrip AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
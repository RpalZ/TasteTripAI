'use client'

import { useState } from 'react'
import { Sparkles, Mail, Lock, ArrowRight, Globe, MapPin, Heart } from 'lucide-react'

interface AuthScreenProps {
  onContinue: () => void
}

export default function AuthScreen({ onContinue }: AuthScreenProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsLoading(false)
    onContinue()
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden m-0 p-0">
      {/* Background with Cultural Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
        {/* Floating Bubbles */}
        <div className="absolute inset-0 opacity-20">
          <div className="floating-bubble absolute top-20 left-20 w-32 h-32 bg-white/30 rounded-full blur-sm" />
          <div className="floating-bubble absolute top-40 right-32 w-24 h-24 bg-blue-300/40 rounded-full blur-sm" />
          <div className="floating-bubble absolute bottom-32 left-1/4 w-40 h-40 bg-purple-300/30 rounded-full blur-sm" />
          <div className="floating-bubble absolute bottom-20 right-20 w-28 h-28 bg-pink-300/40 rounded-full blur-sm" />
          <div className="floating-bubble absolute top-1/2 left-10 w-16 h-16 bg-yellow-300/30 rounded-full blur-sm" />
          <div className="floating-bubble absolute top-1/3 right-1/4 w-20 h-20 bg-green-300/30 rounded-full blur-sm" />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Logo and Branding */}
          <div className="text-center mb-8 fade-in">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl hover:scale-110 transition-transform duration-700 ease-in-out">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
              Welcome to
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {' '}TasteTrip AI
              </span>
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed max-w-md mx-auto">
              Discover personalized cultural experiences powered by AI taste intelligence
            </p>
          </div>

          {/* Auth Form */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 slide-up">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Email Address</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-500 ease-in-out bg-white/90"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <span>Password</span>
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-500 ease-in-out bg-white/90"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-700 ease-in-out shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 hover:scale-105"
              >
                {isLoading ? (
                  <div className="loading-dots text-lg">Signing in</div>
                ) : (
                  <>
                    <span>Continue to TasteTrip</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Additional Options */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-4">
                Don't have an account?{' '}
                <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-500">
                  Sign up here
                </button>
              </p>
              
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <button className="hover:text-gray-700 transition-colors duration-500">Privacy Policy</button>
                <span>•</span>
                <button className="hover:text-gray-700 transition-colors duration-500">Terms of Service</button>
              </div>
            </div>
          </div>

          {/* Simplified Description */}
          <div className="mt-8 text-center slide-up stagger-1">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 max-w-sm mx-auto">
              <div className="flex items-center justify-center space-x-4 mb-3">
                <Globe className="w-6 h-6 text-blue-300" />
                <MapPin className="w-6 h-6 text-purple-300" />
                <Heart className="w-6 h-6 text-pink-300" />
              </div>
              <p className="text-white text-sm leading-relaxed">
                AI-powered cultural discovery across food, music, art, and travel
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Floating Elements */}
      <div className="absolute top-1/4 left-10 floating-bubble">
        <div className="w-3 h-3 bg-blue-400/60 rounded-full" />
      </div>
      <div className="absolute top-1/3 right-16 floating-bubble">
        <div className="w-2 h-2 bg-purple-400/60 rounded-full" />
      </div>
      <div className="absolute bottom-1/4 left-1/4 floating-bubble">
        <div className="w-4 h-4 bg-pink-400/40 rounded-full" />
      </div>
    </div>
  )
}
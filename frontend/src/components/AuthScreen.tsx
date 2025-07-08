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
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full animate-pulse" />
          <div className="absolute top-40 right-32 w-24 h-24 bg-blue-300 rounded-full animate-pulse delay-1000" />
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-purple-300 rounded-full animate-pulse delay-2000" />
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-pink-300 rounded-full animate-pulse delay-3000" />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Logo and Branding */}
          <div className="text-center mb-8 fade-in">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">
              Welcome to
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {' '}TasteTrip AI
              </span>
            </h1>
            <p className="text-blue-100 text-lg">
              Your gateway to personalized cultural discovery
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
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-500 ease-in-out shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 hover:scale-105"
              >
                {isLoading ? (
                  <div className="loading-dots">Signing in</div>
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
                <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300">
                  Sign up here
                </button>
              </p>
              
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <button className="hover:text-gray-700 transition-colors duration-300">Privacy Policy</button>
                <span>•</span>
                <button className="hover:text-gray-700 transition-colors duration-300">Terms of Service</button>
              </div>
            </div>
          </div>

          {/* Features Preview */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center slide-up stagger-1">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <Globe className="w-8 h-8 text-blue-300 mx-auto mb-2" />
              <p className="text-white text-sm font-medium">Global Culture</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <MapPin className="w-8 h-8 text-purple-300 mx-auto mb-2" />
              <p className="text-white text-sm font-medium">Local Spots</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <Heart className="w-8 h-8 text-pink-300 mx-auto mb-2" />
              <p className="text-white text-sm font-medium">Personal Taste</p>
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
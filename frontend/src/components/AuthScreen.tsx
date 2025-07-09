'use client'

import { useState } from 'react'
import { Sparkles, Mail, Lock, ArrowRight } from 'lucide-react'

interface AuthScreenProps {
  onLogin: () => void
}

const inspirationalQuotes = [
  "Discover cultures that speak to your soul",
  "Every taste tells a story waiting to be explored",
  "Your next cultural adventure is just a conversation away",
  "AI-powered discovery meets human curiosity",
  "Where taste meets travel, magic happens"
]

export default function AuthScreen({ onLogin }: AuthScreenProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentQuote, setCurrentQuote] = useState(0)

  // Rotate quotes every 4 seconds
  useState(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % inspirationalQuotes.length)
    }, 4000)
    return () => clearInterval(interval)
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsLoading(false)
    onLogin()
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden m-0 p-0 bg-slate-900">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #3B82F6 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, #8B5CF6 0%, transparent 50%)`
        }} />
      </div>
      
      {/* Floating Bubbles - More Subtle */}
      <div className="absolute inset-0 opacity-5">
        <div className="floating-bubble absolute top-20 left-20 w-16 h-16 bg-blue-400 rounded-full blur-xl" />
        <div className="floating-bubble absolute top-40 right-32 w-12 h-12 bg-purple-400 rounded-full blur-lg" />
        <div className="floating-bubble absolute bottom-32 left-1/4 w-20 h-20 bg-blue-300 rounded-full blur-xl" />
        <div className="floating-bubble absolute bottom-20 right-20 w-14 h-14 bg-purple-300 rounded-full blur-lg" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Logo and Branding */}
          <div className="text-center mb-8 fade-in">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl hover:scale-110 transition-transform duration-300 ease-in-out">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
              Welcome to
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {' '}TasteTrip AI
              </span>
            </h1>
            
            {/* Rotating Inspirational Quotes */}
            <div className="h-12 flex items-center justify-center">
              <p className="text-blue-200 text-lg leading-relaxed max-w-md mx-auto transition-all duration-500 ease-in-out">
                {inspirationalQuotes[currentQuote]}
              </p>
            </div>
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
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300 ease-in-out bg-white/90"
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
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300 ease-in-out bg-white/90"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 hover:scale-105"
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
                <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300">
                  Sign up here
                </button>
              </p>
              
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300 mb-4">
                Forgot Password?
              </button>
              
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <button className="hover:text-gray-700 transition-colors duration-300">Privacy Policy</button>
                <span>•</span>
                <button className="hover:text-gray-700 transition-colors duration-300">Terms of Service</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
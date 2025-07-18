'use client'

import { useState } from 'react'
import { Sparkles, Mail, Lock, ArrowRight, ArrowLeft, User, MapPin, Music } from 'lucide-react'
import { useTheme } from './ThemeContext'

interface AuthScreenProps {
  onLogin: () => void
}

interface OnboardingStep {
  id: number
  question: string
  placeholder: string
  icon: React.ReactNode
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    question: "Describe your perfect day off — what would you eat, listen to, or do?",
    placeholder: "I love cozy cafes with jazz music, trying new cuisines...",
    icon: <User className="w-5 h-5" />
  },
  {
    id: 2,
    question: "Name a city or place you've always wanted to explore.",
    placeholder: "Tokyo, Paris, local hidden gems...",
    icon: <MapPin className="w-5 h-5" />
  },
  {
    id: 3,
    question: "What kind of music and movies do you enjoy the most?",
    placeholder: "Indie rock, jazz, sci-fi movies, documentaries...",
    icon: <Music className="w-5 h-5" />
  }
]

const inspirationalQuotes = [
  "Discover cultures that speak to your soul",
  "Every taste tells a story waiting to be explored",
  "Your next cultural adventure is just a conversation away",
  "AI-powered discovery meets human curiosity",
  "Where taste meets travel, magic happens"
]

export default function AuthScreen({ onLogin }: AuthScreenProps) {
  const { theme } = useTheme();
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentQuote, setCurrentQuote] = useState(0)
  const [onboardingAnswers, setOnboardingAnswers] = useState<string[]>(['', '', ''])

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
    
    if (mode === 'signup') {
      setShowOnboarding(true)
    } else {
      onLogin()
    }
  }

  const handleOnboardingNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding
      onLogin()
    }
  }

  const handleOnboardingBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      setShowOnboarding(false)
      setCurrentStep(0)
    }
  }

  const updateOnboardingAnswer = (value: string) => {
    const newAnswers = [...onboardingAnswers]
    newAnswers[currentStep] = value
    setOnboardingAnswers(newAnswers)
  }

  if (showOnboarding) {
    const step = onboardingSteps[currentStep]
    
    return (
      <div style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }} className="min-h-screen w-full relative overflow-hidden m-0 p-0">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #0ea5e9 0%, transparent 50%), 
                             radial-gradient(circle at 75% 75%, #a855f7 0%, transparent 50%)`
          }} />
        </div>
        
        {/* Floating Bubbles */}
        <div className="absolute inset-0 opacity-10">
          <div className="floating-bubble absolute top-20 left-20 w-16 h-16 bg-sky-400 rounded-full blur-xl" />
          <div className="floating-bubble absolute top-40 right-32 w-12 h-12 bg-lavender-400 rounded-full blur-lg" />
          <div className="floating-bubble absolute bottom-32 left-1/4 w-20 h-20 bg-mint-300 rounded-full blur-xl" />
          <div className="floating-bubble absolute bottom-20 right-20 w-14 h-14 bg-sky-300 rounded-full blur-lg" />
        </div>

        {/* Onboarding Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
          <div className="w-full max-w-2xl">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  Step {currentStep + 1} of {onboardingSteps.length}
                </span>
                <span className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                  {Math.round(((currentStep + 1) / onboardingSteps.length) * 100)}% Complete
                </span>
              </div>
              <div className="w-full rounded-full h-2" style={{ background: 'var(--color-border)' }}>
                <div 
                  className="h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%`, background: 'var(--color-accent)' }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="rounded-3xl p-8 shadow-2xl border slide-up" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-card-border)' }}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'var(--color-accent-bg)' }}>
                  {step.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-0" style={{ color: 'var(--color-text-primary)' }}>Tell us about yourself</h2>
                  <p style={{ color: 'var(--color-text-secondary)' }}>Help us personalize your experience</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                  {step.question}
                </h3>
                <textarea
                  value={onboardingAnswers[currentStep]}
                  onChange={(e) => updateOnboardingAnswer(e.target.value)}
                  placeholder={step.placeholder}
                  rows={4}
                  className="w-full px-4 py-3 rounded-2xl border focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all duration-300 ease-in-out resize-none"
                  style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                />
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handleOnboardingBack}
                  className="flex items-center space-x-2 px-6 py-3 transition-all duration-300 ease-in-out hover:scale-105"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  onClick={handleOnboardingNext}
                  disabled={!onboardingAnswers[currentStep].trim()}
                  className="flex items-center space-x-2 px-8 py-3 rounded-2xl font-semibold transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-on-accent)' }}
                >
                  <span>{currentStep === onboardingSteps.length - 1 ? 'Complete' : 'Next'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }} className="min-h-screen w-full relative overflow-hidden m-0 p-0">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #0ea5e9 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, #a855f7 0%, transparent 50%)`
        }} />
      </div>
      
      {/* Floating Bubbles */}
      <div className="absolute inset-0 opacity-10">
        <div className="floating-bubble absolute top-20 left-20 w-16 h-16 bg-sky-400 rounded-full blur-xl" />
        <div className="floating-bubble absolute top-40 right-32 w-12 h-12 bg-lavender-400 rounded-full blur-lg" />
        <div className="floating-bubble absolute bottom-32 left-1/4 w-20 h-20 bg-mint-300 rounded-full blur-xl" />
        <div className="floating-bubble absolute bottom-20 right-20 w-14 h-14 bg-sky-300 rounded-full blur-lg" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Logo and Branding */}
          <div className="text-center mb-8 fade-in">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl hover:scale-110 transition-transform duration-300 ease-in-out" style={{ background: 'var(--color-accent)' }}>
              <Sparkles className="w-10 h-10" style={{ color: 'var(--color-on-accent)' }} />
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight" style={{ color: 'var(--color-text-primary)' }}>
              {mode === 'login' ? 'Welcome Back' : 'Join TasteTrip AI'}
            </h1>
            
            {/* Rotating Inspirational Quotes */}
            <div className="h-12 flex items-center justify-center">
              <p className="text-lg leading-relaxed max-w-md mx-auto transition-all duration-500 ease-in-out" style={{ color: 'var(--color-accent-secondary)' }}>
                {inspirationalQuotes[currentQuote]}
              </p>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex rounded-2xl p-1 mb-8 slide-up" style={{ background: 'var(--color-bg-secondary)' }}>
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                mode === 'login'
                  ? 'bg-white shadow-md' : ''
              }`}
              style={mode === 'login' ? { color: 'var(--color-accent)' } : { color: 'var(--color-text-secondary)' }}
            >
              Login
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                mode === 'signup'
                  ? 'bg-white shadow-md' : ''
              }`}
              style={mode === 'signup' ? { color: 'var(--color-accent)' } : { color: 'var(--color-text-secondary)' }}
            >
              Sign Up
            </button>
          </div>

          {/* Auth Form */}
          <div className="rounded-3xl p-8 shadow-2xl border slide-up" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-card-border)' }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium flex items-center space-x-2" style={{ color: 'var(--color-text-secondary)' }}>
                  <Mail className="w-4 h-4" />
                  <span>Email Address</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-2xl border focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all duration-300 ease-in-out"
                  style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium flex items-center space-x-2" style={{ color: 'var(--color-text-secondary)' }}>
                  <Lock className="w-4 h-4" />
                  <span>Password</span>
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-2xl border focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all duration-300 ease-in-out"
                  style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                  required
                />
              </div>

              {/* Confirm Password Field (Sign Up Only) */}
              {mode === 'signup' && (
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium flex items-center space-x-2" style={{ color: 'var(--color-text-secondary)' }}>
                    <Lock className="w-4 h-4" />
                    <span>Confirm Password</span>
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full px-4 py-3 rounded-2xl border focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all duration-300 ease-in-out"
                    style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                    required
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !email || !password || (mode === 'signup' && !confirmPassword)}
                className="w-full py-4 rounded-2xl font-semibold transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 hover:scale-105"
                style={{ background: 'var(--color-accent)', color: 'var(--color-on-accent)' }}
              >
                {isLoading ? (
                  <div className="loading-dots text-lg">
                    {mode === 'login' ? 'Signing in' : 'Creating account'}
                  </div>
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Additional Options */}
            <div className="mt-6 text-center">
              {mode === 'login' && (
                <button className="text-sm font-medium mb-4 transition-colors duration-300" style={{ color: 'var(--color-accent)' }}>
                  Forgot Password?
                </button>
              )}
              
              <div className="flex items-center justify-center space-x-4 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                <button className="hover:underline transition-colors duration-300">Privacy Policy</button>
                <span>•</span>
                <button className="hover:underline transition-colors duration-300">Terms of Service</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
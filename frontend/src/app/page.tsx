'use client'

import { useState, useEffect } from 'react'
import AuthScreen from '@/components/AuthScreen'
import LandingScreen from '@/components/LandingScreen'
import ChatInterface from '@/components/ChatInterface'

type AppState = 'auth' | 'landing' | 'chat'

export default function Home() {
  const [appState, setAppState] = useState<AppState>('auth')
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleStateChange = async (newState: AppState) => {
    setIsTransitioning(true)
    // Quick transition delay
    await new Promise(resolve => setTimeout(resolve, 150))
    setAppState(newState)
    // Brief fade-in delay
    await new Promise(resolve => setTimeout(resolve, 100))
    setIsTransitioning(false)
  }

  const renderCurrentScreen = () => {
    switch (appState) {
      case 'auth':
        return <AuthScreen onContinue={() => handleStateChange('landing')} />
      case 'landing':
        return <LandingScreen onStartChat={() => handleStateChange('chat')} />
      case 'chat':
        return <ChatInterface onBack={() => handleStateChange('landing')} />
      default:
        return <AuthScreen onContinue={() => handleStateChange('landing')} />
    }
  }

  return (
    <div className={`min-h-screen w-full m-0 p-0 ${isTransitioning ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 ease-in-out`}>
      {renderCurrentScreen()}
    </div>
  )
}
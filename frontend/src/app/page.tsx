'use client'

import { useState, useEffect } from 'react'
import AuthScreen from '@/components/AuthScreen'
import LandingScreen from '@/components/LandingScreen'
import ChatInterface from '@/components/ChatInterface'
import Dashboard from '@/components/Dashboard'
import Navigation from '@/components/Navigation'

type AppState = 'auth' | 'landing' | 'chat' | 'dashboard'

export default function Home() {
  const [appState, setAppState] = useState<AppState>('auth')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleStateChange = async (newState: AppState) => {
    setIsTransitioning(true)
    await new Promise(resolve => setTimeout(resolve, 150))
    setAppState(newState)
    await new Promise(resolve => setTimeout(resolve, 100))
    setIsTransitioning(false)
  }

  const handleLogin = () => {
    setIsAuthenticated(true)
    handleStateChange('landing')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    handleStateChange('auth')
  }

  const renderCurrentScreen = () => {
    switch (appState) {
      case 'auth':
        return <AuthScreen onLogin={handleLogin} />
      case 'landing':
        return (
          <>
            <Navigation 
              isAuthenticated={isAuthenticated} 
              onNavigate={handleStateChange}
              onLogout={handleLogout}
              currentPage="landing"
            />
            <LandingScreen onStartChat={() => handleStateChange('chat')} />
          </>
        )
      case 'chat':
        return (
          <>
            <Navigation 
              isAuthenticated={isAuthenticated} 
              onNavigate={handleStateChange}
              onLogout={handleLogout}
              currentPage="chat"
            />
            <ChatInterface onBack={() => handleStateChange('landing')} />
          </>
        )
      case 'dashboard':
        return (
          <>
            <Navigation 
              isAuthenticated={isAuthenticated} 
              onNavigate={handleStateChange}
              onLogout={handleLogout}
              currentPage="dashboard"
            />
            <Dashboard />
          </>
        )
      default:
        return <AuthScreen onLogin={handleLogin} />
    }
  }

  return (
    <div className={`min-h-screen w-full m-0 p-0 ${isTransitioning ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 ease-in-out`}>
      {renderCurrentScreen()}
    </div>
  )
}
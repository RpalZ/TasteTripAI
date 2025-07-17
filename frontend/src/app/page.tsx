'use client'

import { useState, useEffect } from 'react'
import LandingPage from '@/components/LandingPage'
import AuthScreen from '@/components/AuthScreen'
import LandingScreen from '@/components/LandingScreen'
import ChatInterface from '@/components/ChatInterface'
import Dashboard from '@/components/Dashboard'
import Navigation from '@/components/Navigation'

type AppState = 'landing' | 'auth' | 'home' | 'chat' | 'dashboard'

export default function Home() {
  const [appState, setAppState] = useState<AppState>('landing')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleStateChange = async (newState: AppState) => {
    setIsTransitioning(true)
    await new Promise(resolve => setTimeout(resolve, 300))
    setAppState(newState)
    await new Promise(resolve => setTimeout(resolve, 100))
    setIsTransitioning(false)
  }

  const handleGetStarted = () => {
    handleStateChange('auth')
  }

  const handleLogin = () => {
    setIsAuthenticated(true)
    handleStateChange('home')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    handleStateChange('landing')
  }

  const renderCurrentScreen = () => {
    switch (appState) {
      case 'landing':
        return <LandingPage onGetStarted={handleGetStarted} />
      case 'auth':
        return <AuthScreen onLogin={handleLogin} />
      case 'home':
        return (
          <>
            <Navigation 
              isAuthenticated={isAuthenticated} 
              onNavigate={handleStateChange}
              onLogout={handleLogout}
              currentPage="home"
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
            <ChatInterface onBack={() => handleStateChange('home')} />
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
        return <LandingPage onGetStarted={handleGetStarted} />
    }
  }

  return (
    <div className={`min-h-screen w-full m-0 p-0 ${isTransitioning ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 ease-in-out`}>
      {renderCurrentScreen()}
    </div>
  )
}
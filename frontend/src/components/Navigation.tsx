'use client'

import { Sparkles, Compass, Search, BarChart3, LogOut, User } from 'lucide-react'

interface NavigationProps {
  isAuthenticated: boolean
  onNavigate: (page: 'auth' | 'landing' | 'chat' | 'dashboard') => void
  onLogout: () => void
  currentPage: string
}

export default function Navigation({ isAuthenticated, onNavigate, onLogout, currentPage }: NavigationProps) {
  if (!isAuthenticated) return null

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">TasteTrip AI</h1>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onNavigate('landing')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                currentPage === 'landing' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Explore</span>
            </button>
            
            <button
              onClick={() => onNavigate('chat')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                currentPage === 'chat' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Discover</span>
            </button>
            
            <button
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                currentPage === 'dashboard' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-gray-300">
              <User className="w-4 h-4" />
              <span className="text-sm">Welcome back!</span>
            </div>
            
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 hover:scale-105"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-gray-300 hover:text-white p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
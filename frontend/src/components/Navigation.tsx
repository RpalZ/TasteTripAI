'use client'

import { Sparkles, Compass, Search, BarChart3, LogOut, User, Moon, Sun, Router } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from './ThemeContext'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useUserProfile } from '../utils/useUserProfile'

interface NavigationProps {
  isAuthenticated: boolean
  onLogout: () => void
  currentPage?: string // optional, for legacy support
}

export default function Navigation({ isAuthenticated, onLogout }: NavigationProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const { profile, loading } = useUserProfile()
  
  // Redirect to '/' if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);
  if (!isAuthenticated) return null;

  // Get display name for greeting
  const getDisplayName = () => {
    if (loading) return 'there';
    if (profile?.username) return profile.username;
    return 'there';
  };

  return (
    <nav
      className="sticky top-0 z-50 navbar-blur shadow-sm"
      style={{
        background: 'var(--color-bg-navbar)',
        borderBottom: '1px solid var(--color-card-border)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-sky-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">TasteTrip AI</h1>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/home"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                pathname === '/home' 
                  ? 'bg-sky-500 text-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Explore</span>
            </Link>
            
            <Link
              href="/chat"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                pathname === '/chat' 
                  ? 'bg-sky-500 text-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Discover</span>
            </Link>
            
            <Link
              href="/dashboard"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                pathname === '/dashboard' 
                  ? 'bg-sky-500 text-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-gray-600">
              <User className="w-4 h-4" />
              <span className="text-sm">
                Welcome back, {getDisplayName()}!
              </span>
            </div>
            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-300 ${
                theme === 'dark' ? 'bg-sky-500' : 'bg-gray-200'
              }`}
              title="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-white" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-500" />
              )}
            </button>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-300 hover:scale-105"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-gray-900 p-2">
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
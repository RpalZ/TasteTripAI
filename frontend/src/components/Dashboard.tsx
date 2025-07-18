'use client'

import { useState } from 'react'
import { BarChart3, Heart, Clock, MapPin, Trash2, Star, TrendingUp, User, Settings, Moon, Sun } from 'lucide-react'
import { getCategoryColor } from '@/utils/formatTaste'
import { useTheme } from './ThemeContext'

interface TasteSummary {
  id: string
  query: string
  timestamp: Date
  category: string
  recommendations: number
}

interface SavedRecommendation {
  id: string
  title: string
  type: string
  location: string
  savedAt: Date
  rating?: number
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'tastes' | 'saved' | 'profile'>('tastes')
  const { theme, toggleTheme } = useTheme()

  // Mock data
  const tasteSummaries: TasteSummary[] = [
    {
      id: '1',
      query: 'I love jazz music and Italian cuisine in cozy settings',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      category: 'Food & Music',
      recommendations: 8
    },
    {
      id: '2',
      query: 'Modern art galleries and contemporary fashion boutiques',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      category: 'Culture & Fashion',
      recommendations: 12
    },
    {
      id: '3',
      query: 'Hiking trails with scenic views and craft breweries',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      category: 'Travel & Food',
      recommendations: 6
    }
  ]

  const savedRecommendations: SavedRecommendation[] = [
    {
      id: '1',
      title: 'Blue Note Jazz Club',
      type: 'Music',
      location: 'New York, NY',
      savedAt: new Date(Date.now() - 1000 * 60 * 60),
      rating: 5
    },
    {
      id: '2',
      title: 'Osteria Francescana',
      type: 'Food',
      location: 'Modena, Italy',
      savedAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
      rating: 5
    },
    {
      id: '3',
      title: 'Museum of Modern Art',
      type: 'Culture',
      location: 'New York, NY',
      savedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
      rating: 4
    },
    {
      id: '4',
      title: 'Sagrada Familia',
      type: 'Culture',
      location: 'Barcelona, Spain',
      savedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      rating: 5
    }
  ]

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'food': return '🍜'
      case 'music': return '🎶'
      case 'culture': return '🎭'
      case 'travel': return '✈️'
      default: return '✨'
    }
  }

  return (
    <div style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }} className="min-h-screen pt-16 p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Dashboard</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Track your cultural discoveries and saved recommendations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="rounded-2xl p-6 border shadow-sm transition-colors duration-300" style={{ background: 'var(--color-card-bg)', color: 'var(--color-text-primary)', borderColor: 'var(--color-card-border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Total Queries</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>24</p>
              </div>
              <BarChart3 className="w-8 h-8 text-sky-500" />
            </div>
          </div>
          <div className="rounded-2xl p-6 border shadow-sm transition-colors duration-300" style={{ background: 'var(--color-card-bg)', color: 'var(--color-text-primary)', borderColor: 'var(--color-card-border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Saved Items</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{savedRecommendations.length}</p>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <div className="rounded-2xl p-6 border shadow-sm transition-colors duration-300" style={{ background: 'var(--color-card-bg)', color: 'var(--color-text-primary)', borderColor: 'var(--color-card-border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Countries</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>8</p>
              </div>
              <MapPin className="w-8 h-8 text-mint-500" />
            </div>
          </div>
          <div className="rounded-2xl p-6 border shadow-sm transition-colors duration-300" style={{ background: 'var(--color-card-bg)', color: 'var(--color-text-primary)', borderColor: 'var(--color-card-border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>This Week</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>+12</p>
              </div>
              <TrendingUp className="w-8 h-8 text-lavender-500" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 rounded-2xl p-1 mb-8 w-fit border transition-colors duration-300" style={{ background: 'var(--color-card-bg)', color: 'var(--color-text-primary)', borderColor: 'var(--color-card-border)' }}>
          <button
            onClick={() => setActiveTab('tastes')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === 'tastes' ? 'bg-sky-500 text-white shadow-lg' : ''}`}
            style={activeTab !== 'tastes' ? { color: 'var(--color-text-secondary)' } : {}}
          >
            Taste Summary
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === 'saved' ? 'bg-sky-500 text-white shadow-lg' : ''}`}
            style={activeTab !== 'saved' ? { color: 'var(--color-text-secondary)' } : {}}
          >
            Saved Recommendations
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === 'profile' ? 'bg-sky-500 text-white shadow-lg' : ''}`}
            style={activeTab !== 'profile' ? { color: 'var(--color-text-secondary)' } : {}}
          >
            Profile
          </button>
        </div>

        {/* Tab Content */}
        <div className="rounded-2xl border overflow-hidden shadow-sm transition-colors duration-300" style={{ background: 'var(--color-card-bg)', color: 'var(--color-text-primary)', borderColor: 'var(--color-card-border)' }}>
          {activeTab === 'tastes' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-text-primary)' }}>Recent Taste Queries</h2>
              <div className="space-y-4">
                {tasteSummaries.map((taste) => (
                  <div key={taste.id} className="rounded-xl p-4 hover:scale-[1.01] transition-all duration-300" style={{ background: 'var(--color-card-bg)', color: 'var(--color-text-primary)', border: '1px solid var(--color-card-border)' }}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>{taste.query}</p>
                        <div className="flex items-center space-x-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(taste.category)}`}>{taste.category}</span>
                          <div className="flex items-center space-x-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                            <Clock className="w-4 h-4" />
                            <span>{formatTimeAgo(taste.timestamp)}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                            <BarChart3 className="w-4 h-4" />
                            <span>{taste.recommendations} recommendations</span>
                          </div>
                        </div>
                      </div>
                      <button className="p-2" style={{ color: 'var(--color-text-secondary)' }}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'saved' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-text-primary)' }}>Saved Recommendations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedRecommendations.map((rec) => (
                  <div key={rec.id} className="rounded-xl p-4 hover:scale-[1.01] transition-all duration-300" style={{ background: 'var(--color-card-bg)', color: 'var(--color-text-primary)', border: '1px solid var(--color-card-border)' }}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getTypeIcon(rec.type)}</span>
                        <div>
                          <h3 className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{rec.title}</h3>
                          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{rec.location}</p>
                        </div>
                      </div>
                      <button className="p-2" style={{ color: 'var(--color-text-secondary)' }}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < (rec.rating || 0) ? 'text-yellow-400 fill-current' : ''}`}
                            style={i < (rec.rating || 0) ? {} : { color: 'var(--color-text-secondary)' }}
                          />
                        ))}
                      </div>
                      <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{formatTimeAgo(rec.savedAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'profile' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-text-primary)' }}>Profile Settings</h2>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-sky-500 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>John Doe</h3>
                    <p style={{ color: 'var(--color-text-secondary)' }}>john.doe@example.com</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-xl p-4 transition-colors duration-300" style={{ background: 'var(--color-card-bg)', color: 'var(--color-text-primary)', border: '1px solid var(--color-card-border)' }}>
                    <h4 className="font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>Preferences</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span style={{ color: 'var(--color-text-secondary)' }}>Email Notifications</span>
                        <button className="relative w-12 h-6 bg-sky-500 rounded-full transition-colors duration-300">
                          <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 transition-transform duration-300"></div>
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span style={{ color: 'var(--color-text-secondary)' }}>Location Services</span>
                        <button className="relative w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full transition-colors duration-300">
                          <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 transition-transform duration-300"></div>
                        </button>
                      </div>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Dark Mode</span>
                      <button 
                        onClick={toggleTheme}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                          theme === 'dark' ? 'bg-sky-500' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-300 flex items-center justify-center ${
                          theme === 'dark' ? 'right-0.5' : 'left-0.5'
                        }`}>
                          {theme === 'dark' ? (
                            <Moon className="w-3 h-3 text-sky-500" />
                          ) : (
                            <Sun className="w-3 h-3 text-yellow-500" />
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                  
                  <div className="rounded-xl p-4 transition-colors duration-300" style={{ background: 'var(--color-card-bg)', color: 'var(--color-text-primary)', border: '1px solid var(--color-card-border)' }}>
                    <h4 className="font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>Account</h4>
                    <div className="space-y-3">
                      <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <Settings className="w-4 h-4" />
                        <span>Account Settings</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <User className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
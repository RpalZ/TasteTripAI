'use client'

import { useState, useEffect } from 'react'
import { BarChart3, Clock, Star, Trash2, User, Settings, Moon, Sun } from 'lucide-react'
import { useTheme } from './ThemeContext'
import { useUserProfile } from '../utils/useUserProfile'
import DashboardStats from './DashboardStats'

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
  const { profile, loading } = useUserProfile()

  // Location state
  const [location, setLocation] = useState<string>('Fetching location...')

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation('Location unavailable')
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        try {
          const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
          console.log('Google Maps API Key:', apiKey)
          const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
          console.log('Geocode URL:', url)
          const response = await fetch(url)
          const data = await response.json()
          console.log('Geocode API response:', data)
          if (data.status === 'OK' && data.results.length > 0) {
            const address = data.results[0].address_components
            const cityObj = address.find((c: any) => c.types.includes('locality')) ||
                            address.find((c: any) => c.types.includes('administrative_area_level_1'))
            const countryObj = address.find((c: any) => c.types.includes('country'))
            const city = cityObj ? cityObj.long_name : ''
            const country = countryObj ? countryObj.long_name : ''
            if (city && country) setLocation(`${city}, ${country}`)
            else if (country) setLocation(country)
            else setLocation('Location unavailable')
          } else {
            setLocation('Location unavailable')
          }
        } catch (err) {
          console.error('Geolocation error:', err)
          setLocation('Location unavailable')
        }
      },
      (err) => {
        console.error('Geolocation permission error:', err)
        setLocation('Location unavailable')
      }
    )
  }, [])

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

  // Get display name for profile
  const getDisplayName = () => {
    if (loading) return 'Loading...';
    if (profile?.username) return profile.username;
    return 'User';
  };

  return (
    <div style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }} className="min-h-screen pt-16 p-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Dashboard</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Track your cultural journey and manage your preferences
          </p>
          <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            You're currently in {location}
          </p>
        </div>
        {/* Stats Tiles */}
        <DashboardStats />
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
        {activeTab === 'tastes' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>Recent Taste Queries</h2>
            <div className="grid gap-4">
              {tasteSummaries.map((summary) => (
                <div
                  key={summary.id}
                  className="p-6 rounded-2xl transition-colors duration-300"
                  style={{ background: 'var(--color-card-bg)', color: 'var(--color-text-primary)', border: '1px solid var(--color-card-border)' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-lg font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                        "{summary.query}"
                      </p>
                      <div className="flex items-center space-x-4 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200">
                          {summary.category}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatTimeAgo(summary.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-sky-500">{summary.recommendations}</div>
                      <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>recommendations</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>Saved Recommendations</h2>
            <div className="grid gap-4">
              {savedRecommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="p-6 rounded-2xl transition-colors duration-300"
                  style={{ background: 'var(--color-card-bg)', color: 'var(--color-text-primary)', border: '1px solid var(--color-card-border)' }}
                >
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
                  <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{getDisplayName()}</h3>
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    {loading ? 'Loading...' : profile?.username ? `@${profile.username}` : 'User Profile'}
                  </p>
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
                    <div className="flex items-center justify-between">
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
  )
}
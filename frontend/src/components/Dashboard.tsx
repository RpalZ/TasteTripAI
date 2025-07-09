'use client'

import { useState } from 'react'
import { BarChart3, Heart, Clock, MapPin, Trash2, Star, TrendingUp, User, Settings } from 'lucide-react'

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

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Food & Music': 'bg-orange-100 text-orange-800',
      'Culture & Fashion': 'bg-purple-100 text-purple-800',
      'Travel & Food': 'bg-blue-100 text-blue-800',
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
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
    <div className="min-h-screen bg-slate-900 pt-16 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400">Track your cultural discoveries and saved recommendations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Queries</p>
                <p className="text-2xl font-bold text-white">24</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Saved Items</p>
                <p className="text-2xl font-bold text-white">{savedRecommendations.length}</p>
              </div>
              <Heart className="w-8 h-8 text-red-400" />
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Countries</p>
                <p className="text-2xl font-bold text-white">8</p>
              </div>
              <MapPin className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">This Week</p>
                <p className="text-2xl font-bold text-white">+12</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-slate-800 rounded-2xl p-1 mb-8 w-fit">
          <button
            onClick={() => setActiveTab('tastes')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'tastes'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            Taste Summary
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'saved'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            Saved Recommendations
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            Profile
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
          {activeTab === 'tastes' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Recent Taste Queries</h2>
              <div className="space-y-4">
                {tasteSummaries.map((taste) => (
                  <div key={taste.id} className="bg-slate-700/50 rounded-xl p-4 hover:bg-slate-700 transition-all duration-300">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="text-white font-medium mb-2">{taste.query}</p>
                        <div className="flex items-center space-x-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(taste.category)}`}>
                            {taste.category}
                          </span>
                          <div className="flex items-center space-x-1 text-slate-400 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>{formatTimeAgo(taste.timestamp)}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-slate-400 text-sm">
                            <BarChart3 className="w-4 h-4" />
                            <span>{taste.recommendations} recommendations</span>
                          </div>
                        </div>
                      </div>
                      <button className="p-2 text-slate-400 hover:text-red-400 transition-colors">
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
              <h2 className="text-xl font-semibold text-white mb-6">Saved Recommendations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedRecommendations.map((rec) => (
                  <div key={rec.id} className="bg-slate-700/50 rounded-xl p-4 hover:bg-slate-700 transition-all duration-300">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getTypeIcon(rec.type)}</span>
                        <div>
                          <h3 className="text-white font-medium">{rec.title}</h3>
                          <p className="text-slate-400 text-sm">{rec.location}</p>
                        </div>
                      </div>
                      <button className="p-2 text-slate-400 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < (rec.rating || 0) ? 'text-yellow-400 fill-current' : 'text-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-slate-400 text-sm">{formatTimeAgo(rec.savedAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Profile Settings</h2>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">John Doe</h3>
                    <p className="text-slate-400">john.doe@example.com</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-700/50 rounded-xl p-4">
                    <h4 className="text-white font-medium mb-3">Preferences</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Email Notifications</span>
                        <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                          <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Location Services</span>
                        <button className="w-12 h-6 bg-slate-600 rounded-full relative">
                          <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-700/50 rounded-xl p-4">
                    <h4 className="text-white font-medium mb-3">Account</h4>
                    <div className="space-y-3">
                      <button className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors">
                        <Settings className="w-4 h-4" />
                        <span>Account Settings</span>
                      </button>
                      <button className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors">
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
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { BarChart3, Clock, Star, Trash2, User, Settings, Moon, Sun } from 'lucide-react'
import { useTheme } from './ThemeContext'
import { useUserProfile } from '../utils/useUserProfile'
import DashboardStats from './DashboardStats'
import { supabase } from '../utils/supabaseClient' // <-- ADD THIS LINE
import SaveBookmarkButton from './SaveBookmarkButton'

interface TasteSummary {
  id: string
  query: string
  timestamp: Date
  category: string
  recommendations: number
}

interface SavedRecommendation {
  id: string
  qloo_id: string
  title: string
  type: string
  location: string
  savedAt: Date
  rating?: number
}

// Add these interfaces at the top of Dashboard.tsx
interface UserBookmark {
  id: string
  user_id: string
  qloo_id: string
  name: string
  type?: string
  location?: string
  address?: string
  created_at: string
  rating?: number
  lat?: number
  lon?: number
  description?: string
  website?: string
  image_url?: string
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'tastes' | 'saved' | 'profile'>('tastes')
  const { theme, toggleTheme } = useTheme()
  const { profile, loading } = useUserProfile()

  // Location state
  const [location, setLocation] = useState<string>('Fetching location...')

  // Supabase-driven state for bookmarks and recent queries
  const [savedRecommendations, setSavedRecommendations] = useState<SavedRecommendation[]>([])
  const [bookmarksLoading, setBookmarksLoading] = useState(true)
  const [tasteSummaries, setTasteSummaries] = useState<TasteSummary[]>([])
  const [queriesLoading, setQueriesLoading] = useState(true)

  // 1. Add a ref to track mounted state
  const isMounted = useRef(false)

  // 2. Modify the fetchBookmarks function to add debouncing and better state management
  const fetchBookmarks = useCallback(async () => {
    if (!isMounted.current) return

    try {
      // Only show loading on initial fetch
      if (!savedRecommendations.length) {
        setBookmarksLoading(true)
      }

      const { data: session } = await supabase.auth.getSession()
      if (!session?.session?.user) {
        setSavedRecommendations([])
        return
      }

      const { data, error } = await supabase
        .from('user_bookmarks')
        .select('*')
        .eq('user_id', session.session.user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      if (isMounted.current) {
        setSavedRecommendations(data?.map(bookmark => ({
          id: bookmark.id,
          qloo_id: bookmark.qloo_id,
          title: bookmark.name || 'Unnamed Location',
          type: bookmark.type || 'place',
          location: bookmark.location || bookmark.address || 'No location provided',
          savedAt: new Date(bookmark.created_at),
          rating: bookmark.rating || 0
        })) || [])
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error)
    } finally {
      if (isMounted.current) {
        setBookmarksLoading(false)
      }
    }
  }, []) // Empty dependency array since we don't need any dependencies

  // 3. Setup proper effect hooks
  useEffect(() => {
    isMounted.current = true
    
    // Initial fetch
    fetchBookmarks()

    // Setup real-time subscription
    const subscription = supabase
      .channel('bookmarks_db_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'user_bookmarks' 
        },
        (payload) => {
          // Instead of refetching, update the state directly
          if (isMounted.current) {
            if (payload.eventType === 'DELETE') {
              setSavedRecommendations(prev => 
                prev.filter(rec => rec.qloo_id !== payload.old.qloo_id)
              )
            } else if (payload.eventType === 'INSERT') {
              setSavedRecommendations(prev => [{
                id: payload.new.id,
                qloo_id: payload.new.qloo_id,
                title: payload.new.name || 'Unnamed Location',
                type: payload.new.type || 'place',
                location: payload.new.location || payload.new.address || 'No location provided',
                savedAt: new Date(payload.new.created_at),
                rating: payload.new.rating || 0
              }, ...prev])
            }
          }
        }
      )
      .subscribe()

    return () => {
      isMounted.current = false
      subscription.unsubscribe()
    }
  }, [fetchBookmarks]) // Only depend on fetchBookmarks

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
          const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
          const response = await fetch(url)
          const data = await response.json()
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
          setLocation('Location unavailable')
        }
      },
      () => setLocation('Location unavailable')
    )
  }, [])

  // Fetch recent queries from Supabase
  useEffect(() => {
    const fetchRecentQueries = async () => {
      setQueriesLoading(true)
      const { data: session } = await supabase.auth.getSession()
      if (!session?.session) {
        setTasteSummaries([])
        setQueriesLoading(false)
        return
      }
      const { data, error } = await supabase
        .from('chats')
        .select('id, message, created_at')
        .eq('user_id', session.session.user.id)
        .eq('sender_type', 'user')
        .order('created_at', { ascending: false })
        .limit(10)
      if (data) {
        setTasteSummaries(
          data.map((q: any) => ({
            id: q.id,
            query: q.message,
            timestamp: q.created_at ? new Date(q.created_at) : new Date(),
            category: '', // You can enhance this if you store categories
            recommendations: 0, // Or fetch actual recommendations count if available
          }))
        )
      } else {
        setTasteSummaries([])
      }
      setQueriesLoading(false)
    }
    fetchRecentQueries()
  }, [])

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

  // 4. Modify the handleRemoveBookmark to be more optimistic
  const handleRemoveBookmark = async (qlooId: string) => {
    const { data: session } = await supabase.auth.getSession()
    if (!session?.session) return
    
    // Optimistically update UI
    setSavedRecommendations(prev => 
      prev.filter(rec => rec.qloo_id !== qlooId)
    )

    try {
      await supabase
        .from('user_bookmarks')
        .delete()
        .eq('user_id', session.session.user.id)
        .eq('qloo_id', qlooId)
    } catch (error) {
      // On error, revert the optimistic update
      fetchBookmarks()
    }
  }

  // Add this right after the component declaration
  useEffect(() => {
    // Verify Supabase client initialization
    if (!supabase) {
      console.error('Supabase client not initialized')
      return
    }
    
    // Log environment variables (without exposing sensitive data)
    console.log('Supabase URL configured:', !!process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Supabase key configured:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  }, [])

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
            {queriesLoading ? (
              <p>Loading...</p>
            ) : tasteSummaries.length === 0 ? (
              <p>No recent queries found.</p>
            ) : (
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
                            {summary.category || 'Query'}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatTimeAgo(summary.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-sky-500">{summary.recommendations ?? ''}</div>
                        <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>recommendations</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              Saved Recommendations
            </h2>
            {bookmarksLoading && !savedRecommendations.length ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-sky-500 border-t-transparent" />
              </div>
            ) : savedRecommendations.length === 0 ? (
              <p className="text-center py-8" style={{ color: 'var(--color-text-secondary)' }}>
                You have no saved locations yet.
              </p>
            ) : (
              <div className="grid gap-4 animate-fade-in">
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
                      {/* Use SaveBookmarkButton for toggle and reactivity */}
                      <SaveBookmarkButton
                        qlooId={rec.qloo_id}
                        name={rec.title}
                        address={rec.location}
                        onBookmarkChange={fetchBookmarks}
                        variant="icon" lat={0} lon={0} description={''}                      />
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
            )}
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
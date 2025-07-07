import axios from 'axios'

// API base URL - adjust based on your backend deployment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Add Supabase JWT token if available
    const token = localStorage.getItem('supabase_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login or refresh token
      localStorage.removeItem('supabase_token')
      // You might want to redirect to login page here
    }
    return Promise.reject(error)
  }
)

export interface TasteInput {
  input: string
}

export interface TasteResponse {
  embedding_id: string
}

export interface SimilarTaste {
  id: string
  input: string
  embedding: number[]
  timestamp: string
  similarity: number
}

export interface Recommendation {
  title: string
  type: string
  description: string
  location?: string
  lat?: number
  lng?: number
}

export interface RecommendationResponse {
  results: Recommendation[]
  explanation?: string
}

export interface BookingQuery {
  query: string
}

export interface BookingResult {
  place_id: string
  name: string
  address: string
  location: {
    lat: number
    lng: number
  }
  link: string
  types: string[]
  rating?: number
}

export interface BookingResponse {
  results: BookingResult[]
}

/**
 * API functions for TasteTrip AI backend integration
 */
export const tasteAPI = {
  /**
   * Submit a taste input and get embedding ID
   */
  createTaste: async (input: string): Promise<TasteResponse> => {
    const response = await api.post<TasteResponse>('/api/taste', { input })
    return response.data
  },

  /**
   * Get similar tastes based on embedding ID
   */
  getSimilarTastes: async (id: string): Promise<SimilarTaste[]> => {
    const response = await api.get<SimilarTaste[]>(`/api/taste/similar?id=${id}`)
    return response.data
  },

  /**
   * Get recommendations based on embedding ID
   */
  getRecommendations: async (embedding_id: string): Promise<RecommendationResponse> => {
    const response = await api.post<RecommendationResponse>('/api/recommend', { embedding_id })
    return response.data
  },

  /**
   * Search for bookable locations using Google Maps
   */
  searchBookings: async (query: string): Promise<BookingResponse> => {
    const response = await api.post<BookingResponse>('/api/booking', { query })
    return response.data
  },
}

/**
 * Error handling utility
 */
export const handleAPIError = (error: any): string => {
  if (error.response?.data?.error) {
    return error.response.data.error
  } else if (error.message) {
    return error.message
  } else {
    return 'An unexpected error occurred'
  }
}

export default api
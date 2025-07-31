'use client'

import { useState, useEffect } from 'react'
import { Cloud, Sun, CloudRain, CloudSnow, Wind } from 'lucide-react'

interface WeatherData {
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  description: string
}

interface WeatherOverlayProps {
  lat: number
  lng: number
  isVisible: boolean
  onToggle: () => void
}

const WeatherOverlay: React.FC<WeatherOverlayProps> = ({ lat, lng, isVisible, onToggle }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mock weather data for now (in a real app, you'd use a weather API)
  const getMockWeather = (lat: number, lng: number): WeatherData => {
    const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy', 'Clear']
    const condition = conditions[Math.floor(Math.random() * conditions.length)]
    
    return {
      temperature: Math.floor(Math.random() * 30) + 10, // 10-40°C
      condition,
      humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
      windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
      description: `${condition} with ${Math.floor(Math.random() * 10) + 5}°C`
    }
  }

  const fetchWeather = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For now, use mock data
      // In production, you'd call a real weather API like OpenWeatherMap
      const weatherData = getMockWeather(lat, lng)
      setWeather(weatherData)
    } catch (err) {
      setError('Failed to load weather data')
      console.error('Weather fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isVisible && !weather) {
      fetchWeather()
    }
  }, [isVisible, lat, lng])

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className="w-6 h-6 text-yellow-500" />
      case 'cloudy':
      case 'partly cloudy':
        return <Cloud className="w-6 h-6 text-gray-500" />
      case 'rainy':
        return <CloudRain className="w-6 h-6 text-blue-500" />
      case 'snowy':
        return <CloudSnow className="w-6 h-6 text-blue-300" />
      default:
        return <Wind className="w-6 h-6 text-gray-400" />
    }
  }

  if (!isVisible) return null

  return (
    <div className="absolute top-4 right-4 z-20">
      <div className="bg-white/95 dark:bg-gray-800/95 rounded-lg shadow-lg p-4 min-w-[200px] backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Weather</h3>
          <button
            onClick={onToggle}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm py-2">
            {error}
          </div>
        )}

        {weather && !loading && (
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              {getWeatherIcon(weather.condition)}
              <div>
                <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
                  {weather.temperature}°C
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {weather.condition}
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <div>Humidity: {weather.humidity}%</div>
              <div>Wind: {weather.windSpeed} km/h</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WeatherOverlay 
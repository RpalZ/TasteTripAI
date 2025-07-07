/**
 * Utility functions for formatting and parsing taste-related data
 */

export interface ParsedTaste {
  categories: string[]
  keywords: string[]
  locations: string[]
  sentiment: 'positive' | 'neutral' | 'negative'
}

/**
 * Parse user taste input to extract categories and keywords
 */
export function parseTasteInput(input: string): ParsedTaste {
  const lowerInput = input.toLowerCase()
  
  // Define category keywords
  const categoryMap = {
    food: ['food', 'restaurant', 'cuisine', 'dining', 'eat', 'meal', 'dish', 'cook', 'recipe', 'pizza', 'pasta', 'sushi', 'burger'],
    music: ['music', 'song', 'artist', 'band', 'concert', 'jazz', 'rock', 'pop', 'classical', 'hip-hop', 'electronic'],
    travel: ['travel', 'trip', 'vacation', 'destination', 'city', 'country', 'hotel', 'flight', 'explore', 'adventure'],
    culture: ['museum', 'art', 'gallery', 'theater', 'culture', 'history', 'exhibition', 'performance', 'literature'],
    fashion: ['fashion', 'style', 'clothing', 'outfit', 'designer', 'boutique', 'shopping', 'trend', 'accessory'],
  }

  // Extract categories
  const categories: string[] = []
  Object.entries(categoryMap).forEach(([category, keywords]) => {
    if (keywords.some(keyword => lowerInput.includes(keyword))) {
      categories.push(category)
    }
  })

  // Extract general keywords (simple approach)
  const keywords = input
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2)
    .slice(0, 10) // Limit to top 10 keywords

  // Extract potential locations (basic pattern matching)
  const locationPatterns = [
    /in\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,
    /at\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,
    /near\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,
  ]
  
  const locations: string[] = []
  locationPatterns.forEach(pattern => {
    let match
    while ((match = pattern.exec(input)) !== null) {
      locations.push(match[1])
    }
  })

  // Determine sentiment (basic approach)
  const positiveWords = ['love', 'like', 'enjoy', 'amazing', 'great', 'wonderful', 'fantastic', 'excellent']
  const negativeWords = ['hate', 'dislike', 'awful', 'terrible', 'bad', 'horrible']
  
  const hasPositive = positiveWords.some(word => lowerInput.includes(word))
  const hasNegative = negativeWords.some(word => lowerInput.includes(word))
  
  let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral'
  if (hasPositive && !hasNegative) sentiment = 'positive'
  else if (hasNegative && !hasPositive) sentiment = 'negative'

  return {
    categories: [...new Set(categories)], // Remove duplicates
    keywords: [...new Set(keywords)],
    locations: [...new Set(locations)],
    sentiment,
  }
}

/**
 * Format recommendation type for display
 */
export function formatRecommendationType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
}

/**
 * Generate a search query for Google Maps based on recommendation
 */
export function generateMapsQuery(title: string, location?: string, type?: string): string {
  let query = title
  
  if (location) {
    query += ` in ${location}`
  }
  
  if (type && type.toLowerCase() !== 'culture') {
    query += ` ${type.toLowerCase()}`
  }
  
  return query
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(timestamp: Date | string): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
  if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`
  
  return date.toLocaleDateString()
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * Generate a color class based on category
 */
export function getCategoryColor(category: string): string {
  const colorMap: Record<string, string> = {
    food: 'bg-orange-100 text-orange-800 border-orange-200',
    music: 'bg-purple-100 text-purple-800 border-purple-200',
    travel: 'bg-blue-100 text-blue-800 border-blue-200',
    culture: 'bg-pink-100 text-pink-800 border-pink-200',
    fashion: 'bg-green-100 text-green-800 border-green-200',
    default: 'bg-gray-100 text-gray-800 border-gray-200',
  }
  
  return colorMap[category.toLowerCase()] || colorMap.default
}
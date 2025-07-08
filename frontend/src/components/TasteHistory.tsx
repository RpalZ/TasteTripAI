'use client'

import { useState } from 'react'
import { Clock, Search, Trash2, RefreshCw } from 'lucide-react'

interface TasteEntry {
  id: string
  query: string
  timestamp: Date
  category?: string
}

/**
 * Sidebar component showing user's taste history and past queries
 * Allows re-querying previous tastes and managing history
 */
export default function TasteHistory() {
  const [searchTerm, setSearchTerm] = useState('')
  
  // Mock data - replace with actual API integration
  const [tasteHistory] = useState<TasteEntry[]>([
    {
      id: '1',
      query: 'I love jazz music and Italian cuisine, especially in cozy intimate settings',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      category: 'Food & Music'
    },
    {
      id: '2',
      query: 'Looking for modern art galleries and contemporary fashion boutiques',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      category: 'Culture & Fashion'
    },
    {
      id: '3',
      query: 'I enjoy hiking trails with scenic views and local craft breweries',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      category: 'Travel & Food'
    },
    {
      id: '4',
      query: 'Interested in indie bookstores and vinyl record shops',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      category: 'Culture & Music'
    }
  ])

  const filteredHistory = tasteHistory.filter(entry =>
    entry.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`
    }
  }

  const handleRequery = (entry: TasteEntry) => {
    // This would trigger a new query with the historical taste
    console.log('Re-querying:', entry.query)
  }

  return (
    <div className="h-full flex flex-col bg-white/95 backdrop-blur-md">
      {/* Header */}
      <div className="p-4 border-b border-gray-200/50">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Taste History</h2>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search your tastes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-500 ease-in-out bg-white/90"
          />
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              {searchTerm ? 'No matching tastes found' : 'No taste history yet'}
            </p>
          </div>
        ) : (
          filteredHistory.map((entry) => (
            <div
              key={entry.id}
              className="group p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all duration-500 ease-in-out cursor-pointer hover:scale-105"
              onClick={() => handleRequery(entry)}
            >
              {/* Category & Time */}
              <div className="flex items-center justify-between mb-2">
                {entry.category && (
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    {entry.category}
                  </span>
                )}
                <span className="text-xs text-gray-500">
                  {formatTimeAgo(entry.timestamp)}
                </span>
              </div>

              {/* Query Text */}
              <p className="text-sm text-gray-700 line-clamp-3 mb-3">
                {entry.query}
              </p>

              {/* Actions */}
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRequery(entry)
                  }}
                  className="btn-secondary flex items-center space-x-1 text-xs shadow-sm"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Re-query</span>
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    // Handle delete
                  }}
                  className="btn-secondary flex items-center space-x-1 text-xs text-red-600 hover:text-red-700 shadow-sm"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200/50">
        <button className="btn-secondary w-full shadow-sm">
          Clear All History
        </button>
      </div>
    </div>
  )
}
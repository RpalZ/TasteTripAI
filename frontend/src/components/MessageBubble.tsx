'use client'

import { Bot, User } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

interface MessageBubbleProps {
  message: Message
  isLoading?: boolean
}

/**
 * Message bubble component for chat interface
 * Displays user and AI messages with avatars and timestamps
 */
export default function MessageBubble({ message, isLoading = false }: MessageBubbleProps) {
  const isUser = message.type === 'user'
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3 max-w-4xl`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center ${
          isUser 
            ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
            : 'bg-gradient-to-r from-emerald-500 to-teal-600'
        }`}>
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-white" />
          )}
        </div>

        {/* Message Content */}
        <div className={`chat-bubble ${isUser ? 'ml-3' : 'mr-3'}`}>
          <div className={`px-4 py-3 rounded-2xl ${
            isUser 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
              : 'bg-white border border-gray-200 text-gray-900'
          }`}>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {isLoading ? (
                <span className="loading-dots">{message.content}</span>
              ) : (
                message.content
              )}
            </p>
          </div>
          
          {/* Timestamp */}
          <div className={`mt-1 text-xs text-gray-500 ${isUser ? 'text-right' : 'text-left'}`}>
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
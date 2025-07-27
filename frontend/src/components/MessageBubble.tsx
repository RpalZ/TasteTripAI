'use client'

import { Bot, User } from 'lucide-react'
import { useTheme } from './ThemeContext'

interface Message {
  id: string
  type: 'user' | 'ai' | 'system'
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
  const { theme } = useTheme();

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3 max-w-4xl`}>
        {/* Minimal Avatar */}
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center`}
          style={{
            background: isUser ? 'var(--color-accent)' : 'var(--color-accent-tertiary)',
          }}
        >
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-white" />
          )}
        </div>
        {/* Minimal Message Content */}
        <div className={`chat-bubble ${isUser ? 'ml-3' : 'mr-3'}`} style={{
          background: isUser ? 'var(--color-card-bg)' : 'var(--color-bg-secondary)',
          borderRadius: '1rem',
          boxShadow: '0 1px 4px 0 rgba(0,0,0,0.04)',
          border: '1px solid var(--color-card-border)',
          color: 'var(--color-text-primary)',
          padding: '0.75rem 1.25rem',
          fontSize: '1rem',
          fontWeight: 400,
        }}>
          <p className="leading-relaxed whitespace-pre-wrap m-0">
            {isLoading ? (
              <span className="loading-dots">{message.content}</span>
            ) : (
              message.content
            )}
          </p>
        </div>
        {/* Timestamp */}
        <div className={`mt-1 text-xs ${isUser ? 'text-right' : 'text-left'}`} style={{ color: 'var(--color-text-secondary)' }}>
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { Send, Mic } from 'lucide-react'

interface ChatInputProps {
  onSubmit: (input: string) => void
  disabled?: boolean
}

/**
 * Chat input component for user taste queries and messages
 * Features auto-resize, submit on Enter, and disabled state during loading
 */
export default function ChatInput({ onSubmit, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !disabled) {
      onSubmit(input.trim())
      setInput('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-3" style={{
      background: 'var(--color-card-bg)',
      border: '1px solid var(--color-card-border)',
      borderRadius: '1rem',
      boxShadow: '0 1px 4px 0 rgba(0,0,0,0.04)',
      padding: '0.75rem 1.25rem',
      margin: '0.5rem 0',
    }}>
      <div className="flex-1 flex items-center">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Tell me about your tastes... (food, music, travel, etc.)"
          disabled={disabled}
          rows={1}
          className="w-full px-4 py-3 rounded-xl border-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-0 outline-none transition-all duration-300 ease-in-out resize-none min-h-[48px] max-h-32 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            height: 'auto',
            minHeight: '48px',
            color: 'var(--color-text-primary)',
            background: 'transparent',
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement
            target.style.height = 'auto'
            target.style.height = Math.min(target.scrollHeight, 128) + 'px'
          }}
        />
      </div>
      <button
        type="button"
        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-all duration-300 ease-in-out hover:scale-110 flex items-center justify-center"
        disabled={disabled}
        style={{ background: 'none', display: 'flex', alignItems: 'center', height: '48px' }}
      >
        <Mic className="w-5 h-5" />
      </button>
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="flex items-center space-x-2 min-w-[100px] justify-center rounded-xl px-5 py-2 font-semibold transition-all duration-300 ease-in-out"
        style={{
          background: 'var(--color-accent)',
          color: 'var(--color-on-accent)',
          border: 'none',
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          height: '48px',
        }}
      >
        {disabled ? (
          <div className="loading-dots">Thinking</div>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Send</span>
          </>
        )}
      </button>
    </form>
  )
}
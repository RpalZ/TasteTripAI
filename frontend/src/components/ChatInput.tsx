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
    <form onSubmit={handleSubmit} className="flex items-end space-x-3">
      <div className="flex-1 relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Tell me about your tastes... (food, music, travel, etc.)"
          disabled={disabled}
          rows={1}
          className="w-full px-4 py-3 rounded-2xl border border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300 ease-in-out resize-none min-h-[48px] max-h-32 pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            height: 'auto',
            minHeight: '48px',
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement
            target.style.height = 'auto'
            target.style.height = Math.min(target.scrollHeight, 128) + 'px'
          }}
        />
        <button
          type="button"
          className="absolute right-3 bottom-3 p-1.5 text-slate-400 hover:text-slate-300 transition-all duration-300 ease-in-out hover:scale-110"
          disabled={disabled}
        >
          <Mic className="w-4 h-4" />
        </button>
      </div>
      
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 min-w-[100px] justify-center shadow-lg"
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
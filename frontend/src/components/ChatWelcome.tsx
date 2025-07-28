import React, { useState } from 'react';

interface ChatWelcomeProps {
  onStart: (firstMessage?: string) => void;
  hasConversations?: boolean;
}

export default function ChatWelcome({ onStart, hasConversations }: ChatWelcomeProps) {
  const [input, setInput] = useState('');

  React.useEffect(() => {
    if (hasConversations) {
      onStart();
    }
  }, [hasConversations, onStart]);

  const handleStart = () => {
    onStart(input.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleStart();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full" style={{ background: 'var(--color-bg-primary)' }}>
      <div className="max-w-xl w-full mx-auto text-center p-8">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6" style={{ color: 'var(--color-text-primary)' }}>
          What do you want to discover?
        </h1>
        <p className="text-lg md:text-2xl mb-10" style={{ color: 'var(--color-text-secondary)' }}>
          Get personalized cultural recommendations for food, music, travel, and more. Start by telling us your interests!
        </p>
        <div className="flex flex-col items-center gap-4">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your taste or idea... (e.g. I love jazz and pizza)"
            className="w-full max-w-md px-6 py-4 rounded-2xl text-lg focus:ring-2 outline-none transition-all duration-300 ease-in-out chatwelcome-input"
            style={{
              marginBottom: '1rem',
              background: '#fff', // Always light background
              color: '#111827', // Always dark text
              border: '1px solid var(--color-card-border)',
            }}
          />
          <button
            onClick={handleStart}
            disabled={!input.trim()}
            className="w-full max-w-md px-6 py-4 rounded-2xl text-lg font-semibold shadow-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'var(--color-accent)',
              color: 'var(--color-on-accent)',
            }}
          >
            Start Chat
          </button>
        </div>
      </div>
      <style>{`
        .chatwelcome-input::placeholder {
          color: var(--color-text-secondary);
          opacity: 1;
        }
      `}</style>
    </div>
  );
} 
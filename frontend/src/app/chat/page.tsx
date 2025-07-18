"use client"

import Navigation from '@/components/Navigation'
import ChatInterface from '@/components/ChatInterface'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/components/ThemeContext'

export default function ChatPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const handleBack = () => {
    router.push('/home');
  };
  return (
    <div style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }} className="min-h-screen">
      <Navigation isAuthenticated={true} currentPage="chat" onLogout={() => { router.push('/auth'); }} />
      <ChatInterface onBack={handleBack} />
    </div>
  );
} 
"use client"

import Navigation from '@/components/Navigation'
import LandingScreen from '@/components/LandingScreen'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/components/ThemeContext'

export default function HomePage() {
  const router = useRouter();
  const { theme } = useTheme();
  const handleStartChat = () => {
    router.push('/chat');
  };
  return (
    <div style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }} className="min-h-screen">
      <Navigation isAuthenticated={true} currentPage="home" onLogout={() => { router.push('/auth'); }} />
      <LandingScreen onStartChat={handleStartChat} />
    </div>
  );
} 
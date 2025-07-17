"use client"

import Navigation from '@/components/Navigation'
import LandingScreen from '@/components/LandingScreen'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter();
  const handleStartChat = () => {
    router.push('/chat');
  };
  return (
    <>
      <Navigation isAuthenticated={true} currentPage="home" onLogout={() => { router.push('/auth'); }} />
      <LandingScreen onStartChat={handleStartChat} />
    </>
  );
} 
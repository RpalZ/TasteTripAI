"use client"

import Navigation from '@/components/Navigation'
import ChatInterface from '@/components/ChatInterface'
import { useRouter } from 'next/navigation'

export default function ChatPage() {
  const router = useRouter();
  const handleBack = () => {
    router.push('/home');
  };
  return (
    <>
      <Navigation isAuthenticated={true} currentPage="chat" onLogout={() => { router.push('/auth'); }} />
      <ChatInterface onBack={handleBack} />
    </>
  );
} 
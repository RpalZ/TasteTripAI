"use client"

import Navigation from '@/components/Navigation'
import ChatInterface from '@/components/ChatInterface'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/components/ThemeContext'
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

export default function ChatPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      setLoading(false);
    };
    checkAuth();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleBack = () => {
    router.push('/home');
  };
  if (loading) return null;
  return (
    <div style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }} className="min-h-screen">
      <Navigation isAuthenticated={isAuthenticated} currentPage="chat" onLogout={async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('supabase_token');
        setIsAuthenticated(false);
        router.push('/auth');
      }} />
      <ChatInterface onBack={handleBack} />
    </div>
  );
} 
"use client"

import Navigation from '@/components/Navigation'
import LandingScreen from '@/components/LandingScreen'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/components/ThemeContext'
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

export default function HomePage() {
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
    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleStartChat = () => {
    router.push('/chat');
  };
  if (loading) return null;
  return (
    <div style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }} className="min-h-screen">
      <Navigation isAuthenticated={isAuthenticated} currentPage="home" onLogout={async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('supabase_token');
        setIsAuthenticated(false);
        router.push('/auth');
      }} />
      <LandingScreen onStartChat={handleStartChat} />
    </div>
  );
} 
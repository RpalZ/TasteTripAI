"use client"

import Navigation from '@/components/Navigation'
import Dashboard from '@/components/Dashboard'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

export default function DashboardPage() {
  const router = useRouter();
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

  if (loading) return null;
  return (
    <>
      <Navigation isAuthenticated={isAuthenticated} currentPage="dashboard" onLogout={async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('supabase_token');
        setIsAuthenticated(false);
        router.push('/auth');
      }} />
      <Dashboard />
    </>
  );
} 
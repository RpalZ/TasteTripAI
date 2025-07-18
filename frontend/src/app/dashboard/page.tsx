"use client"

import Navigation from '@/components/Navigation'
import Dashboard from '@/components/Dashboard'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter();
  return (
    <>
      <Navigation isAuthenticated={true} currentPage="dashboard" onLogout={() => { router.push('/auth'); }} />
      <Dashboard />
    </>
  );
} 
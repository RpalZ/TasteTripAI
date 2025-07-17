"use client"

import AuthScreen from '@/components/AuthScreen'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const router = useRouter();
  const handleLogin = () => {
    router.push('/home');
  };
  return <AuthScreen onLogin={handleLogin} />
} 
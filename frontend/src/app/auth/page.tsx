"use client"

import AuthScreen from '@/components/AuthScreen'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/components/ThemeContext'

export default function AuthPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const handleLogin = () => {
    router.push('/home');
  };
  return (
    <div style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }} className="min-h-screen">
      <AuthScreen onLogin={handleLogin} />
    </div>
  );
} 
"use client"

import Navigation from '@/components/Navigation'
import ChatInterface from '@/components/ChatInterface'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/components/ThemeContext'
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import ChatWelcome from '@/components/ChatWelcome'

export default function ChatPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [hasConversations, setHasConversations] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthAndConversations = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      if (data.session) {
        // Fetch all conversations for the user
        const { data: conversations, error } = await supabase
          .from('conversations')
          .select('id, created_at')
          .eq('user_id', data.session.user.id)
          .order('created_at', { ascending: false });
        setHasConversations(!!conversations && conversations.length > 0);
        setConversations(conversations || []);
      }
      setLoading(false);
    };
    checkAuthAndConversations();
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

  const handleConversationCreated = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  if (loading) return null;

  // Show conversation list if user has conversations and hasn't started a chat yet
  if (!hasStartedChat && hasConversations && !selectedConversationId) {
    return (
      <div style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }} className="min-h-screen">
        <Navigation isAuthenticated={isAuthenticated} currentPage="chat" onLogout={async () => {
          await supabase.auth.signOut();
          localStorage.removeItem('supabase_token');
          setIsAuthenticated(false);
          router.push('/auth');
        }} />
        <div className="flex flex-col items-center justify-center min-h-screen pt-16">
          <div className="w-full max-w-lg mx-auto p-8 rounded-2xl shadow-lg" style={{ background: 'var(--color-card-bg)' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>Your Conversations</h2>
            <ul className="space-y-4">
              {conversations.map((conv) => (
                <li key={conv.id}>
                  <button
                    className="w-full text-left px-4 py-3 rounded-xl transition-all font-medium"
                    style={{ 
                      color: 'var(--color-text-primary)',
                      background: 'var(--color-bg-secondary)',
                    }}
                    onClick={() => {
                      setSelectedConversationId(conv.id)
                      setHasStartedChat(true)
                    }}
                  >
                    Conversation started {new Date(conv.created_at).toLocaleString()}
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="mt-8 px-4 py-2 rounded-xl font-semibold transition-all duration-300 ease-in-out"
              style={{ background: 'var(--color-accent)', color: 'var(--color-on-accent)' }}
              onClick={() => {
                setSelectedConversationId(null)
                setHasStartedChat(true)
              }}
            >
              Start New Conversation
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }} className="min-h-screen">
      <Navigation isAuthenticated={isAuthenticated} currentPage="chat" onLogout={async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('supabase_token');
        setIsAuthenticated(false);
        router.push('/auth');
      }} />
      {!hasStartedChat ? (
        <ChatWelcome onStart={() => setHasStartedChat(true)} hasConversations={hasConversations} />
      ) : (
        <ChatInterface onBack={handleBack} conversationId={selectedConversationId} onConversationCreated={handleConversationCreated} />
      )}
    </div>
  );
} 
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
  const [initialQuery, setInitialQuery] = useState<string>(''); // Add this state

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

  // Add handler for ChatWelcome onStart
  const handleStartChat = (input?: string) => {
    if (input) {
      setInitialQuery(input);
    }
    setHasStartedChat(true);
  };

  // Add delete conversation handler
  const handleDeleteConversation = async (conversationId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this conversation? This cannot be undone.');
    if (!confirmed) return;
    
    console.log('🗑️ Deleting conversation:', conversationId);
    
    try {
      // First, check if the conversation exists
      const { data: existingConv, error: checkError } = await supabase
        .from('conversations')
        .select('id, user_id')
        .eq('id', conversationId)
        .single();
      
      if (checkError || !existingConv) {
        console.error('❌ Conversation not found or error checking:', checkError);
        alert('Conversation not found or you do not have permission to delete it.');
        return;
      }
      
      console.log('✅ Conversation found:', existingConv);
      
      // Check if user owns this conversation
      const { data: session } = await supabase.auth.getSession();
      if (session.session && existingConv.user_id !== session.session.user.id) {
        console.error('❌ User does not own this conversation');
        alert('You do not have permission to delete this conversation.');
        return;
      }
      
      // Delete the conversation itself (this should cascade delete all related messages)
      const { error: conversationError } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);
      
      console.log('🗑️ Delete result - error:', conversationError);
      
      if (conversationError) {
        console.error('❌ Error deleting conversation:', conversationError);
        throw conversationError;
      }
      
      console.log('✅ Conversation deleted successfully');
      
      // Refresh conversations list
      if (session.session) {
        console.log('🔄 Refreshing conversations list...');
        const { data: conversations, error } = await supabase
          .from('conversations')
          .select('id, created_at')
          .eq('user_id', session.session.user.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('❌ Error fetching conversations:', error);
          throw error;
        }
        
        console.log('📋 Updated conversations:', conversations);
        setHasConversations(!!conversations && conversations.length > 0);
        setConversations(conversations || []);
        
        // If the deleted conversation was selected, clear the selection
        if (selectedConversationId === conversationId) {
          setSelectedConversationId(null);
        }
      }
    } catch (error) {
      console.error('❌ Error in handleDeleteConversation:', error);
      alert('Failed to delete conversation. Please try again.');
    }
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
                  <div className="flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all font-medium"
                    style={{ 
                      color: 'var(--color-text-primary)',
                      background: 'var(--color-bg-secondary)',
                    }}>
                    <button
                      className="flex-1 text-left"
                      onClick={() => {
                        setSelectedConversationId(conv.id)
                        setHasStartedChat(true)
                      }}
                    >
                      Conversation started {new Date(conv.created_at).toLocaleString()}
                    </button>
                    <button
                      className="ml-2 px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out hover:scale-105"
                      style={{ 
                        background: 'var(--color-danger, #e53e3e)', 
                        color: '#fff' 
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteConversation(conv.id);
                      }}
                      title="Delete Conversation"
                    >
                      Delete
                    </button>
                  </div>
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
        <ChatWelcome onStart={handleStartChat} hasConversations={hasConversations} />
      ) : (
        <ChatInterface 
          initialQuery={initialQuery} 
          onBack={handleBack} 
          conversationId={selectedConversationId} 
          onConversationCreated={handleConversationCreated} 
        />
      )}
    </div>
  );
} 
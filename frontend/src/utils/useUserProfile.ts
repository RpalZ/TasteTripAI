import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

interface UserProfile {
  id: string;
  username: string;
  has_onboarded: boolean;
  created_at: string;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          setError('No authenticated user found');
          setLoading(false);
          return;
        }

        // Fetch user profile from user_profile table
        const { data: profileData, error: profileError } = await supabase
          .from('user_profile')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setError('Failed to fetch user profile');
          setLoading(false);
          return;
        }

        setProfile(profileData);
      } catch (err) {
        console.error('Error in useUserProfile:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          fetchProfile();
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { profile, loading, error };
} 
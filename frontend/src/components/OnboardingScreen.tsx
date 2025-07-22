import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import axios from 'axios';
import { useTheme } from './ThemeContext'

const TOPICS = [
  'Gaming', 'Music', 'Films', 'Food', 'Sports', 'Travel', 'Books', 'Art', 'Tech', 'Fashion', 'Fitness', 'Nature',
];

interface OnboardingScreenProps {
  onComplete: () => void;
  userID: string | undefined
}

export default function OnboardingScreen({ onComplete, userID }: OnboardingScreenProps) {
  const { theme } = useTheme();
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Username
  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setUsernameError('');
    try {
      // Check uniqueness
      const { data: existing, error } = await supabase
        .from('user_profile')
        .select('id')
        .eq('username', username)
        .single();
      if (existing) {
        setUsernameError('Username already taken.');
        setIsLoading(false);
        return;
      }
      // Insert profile (if not exists)
    
      console.log(userID)
     
      await supabase.from('user_profile').upsert({
        id: userID,
        username,
        has_onboarded: false,
      });
      setStep(1);
    } catch (err: any) {
      setUsernameError(err.message || 'Error creating profile.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Preferences
  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  // Step 3: Complete
  const handleComplete = async () => {
    if (selectedTopics.length === 0) return;
    setIsLoading(true);
    try {
      // Save preferences as taste
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error('No auth token');
      const preferences = `I like ${selectedTopics.join(', ')}`;
      await axios.post(
        process.env.NEXT_PUBLIC_API_BASE_URL + '/api/taste',
        { input: preferences },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update has_onboarded
      const { data: user } = await supabase.auth.getUser();
      await supabase.from('user_profile').update({ has_onboarded: true }).eq('id', user.user?.id);
      onComplete();
    } catch (err) {
      alert('Failed to save preferences. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
      className="min-h-screen flex flex-col items-center justify-center p-4"
    >
      {step === 0 && (
        <form
          onSubmit={handleUsernameSubmit}
          className="w-full max-w-sm rounded-2xl shadow-lg p-8 flex flex-col items-center"
          style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-card-border)' }}
        >
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>How should we call you?</h2>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border focus:border-sky-400 outline-none mb-2"
            style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
            placeholder="Enter a unique username"
            required
            minLength={3}
            maxLength={20}
            disabled={isLoading}
          />
          {usernameError && <div className="text-red-500 text-sm mb-2">{usernameError}</div>}
          <button
            type="submit"
            className="btn-primary w-full mt-2"
            disabled={isLoading || !username.trim()}
          >
            {isLoading ? 'Checking...' : 'Next'}
          </button>
        </form>
      )}
      {step === 1 && (
        <div
          className="w-full max-w-lg rounded-2xl shadow-lg p-8 flex flex-col items-center"
          style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-card-border)' }}
        >
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>What do you like?</h2>
          <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>Pick as many as you want</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 w-full">
            {TOPICS.map(topic => (
              <button
                key={topic}
                type="button"
                className={`px-4 py-2 rounded-xl border transition-all duration-200 ${selectedTopics.includes(topic) ? 'bg-sky-500 text-white border-sky-500' : ''}`}
                style={
                  selectedTopics.includes(topic)
                    ? {}
                    : {
                        background: 'var(--color-bg-secondary)',
                        color: 'var(--color-text-primary)',
                        borderColor: 'var(--color-border)'
                      }
                }
                onClick={() => toggleTopic(topic)}
                disabled={isLoading}
              >
                {topic}
              </button>
            ))}
          </div>
          <button
            className="btn-primary w-full"
            disabled={isLoading || selectedTopics.length === 0}
            onClick={handleComplete}
          >
            {isLoading ? 'Saving...' : 'Start your journey'}
          </button>
        </div>
      )}
    </div>
  );
} 
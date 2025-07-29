import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { MapPin, MessageCircle, Clock, Heart } from 'lucide-react';

interface StatTileProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  loading?: boolean;
}

function StatTile({ icon, label, value, loading }: StatTileProps) {
  return (
    <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-900 rounded-2xl shadow p-6 min-h-[120px] border border-gray-200 dark:border-gray-800">
      <div className="mb-2 text-3xl">{icon}</div>
      <div className="text-lg font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>{loading ? 'Loading...' : value}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  );
}

export default function DashboardStats() {
  const [location, setLocation] = useState<string>('Fetching...');
  const [interactions, setInteractions] = useState<number | null>(null);
  const [lastSession, setLastSession] = useState<string>('Fetching...');
  const [savedPlaces, setSavedPlaces] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      // Get user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLocation('Not signed in');
        setInteractions(0);
        setLastSession('Unknown');
        setSavedPlaces(0);
        setLoading(false);
        return;
      }
      // 1. Get geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          // Google Maps Geocoding API
          const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
          if (!apiKey) {
            setLocation('API key missing');
            return;
          }
          try {
            const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`);
            const data = await res.json();
            if (data.status === 'OK' && data.results.length > 0) {
              // Find city or region
              const city = data.results[0].address_components.find((c: any) => c.types.includes('locality'))?.long_name;
              const region = data.results[0].address_components.find((c: any) => c.types.includes('administrative_area_level_1'))?.long_name;
              setLocation(city || region || 'Unknown');
            } else {
              setLocation('Unknown');
            }
          } catch {
            setLocation('Unknown');
          }
        }, () => setLocation('Unavailable'));
      } else {
        setLocation('Unavailable');
      }
      // 2. Total Interactions (user messages in chats)
      const { count: msgCount } = await supabase
        .from('chats')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('sender_type', 'user');
      setInteractions(msgCount ?? 0);
      // 3. Last Session
      setLastSession(user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Unknown');
      // 4. Saved Places
      const { count: savedCount } = await supabase
        .from('saved_places')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);
      setSavedPlaces(savedCount ?? 0);
      setLoading(false);
    }
    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
      <StatTile icon={<MapPin />} label="You're currently in" value={location} loading={loading} />
      <StatTile icon={<MessageCircle />} label="Total Interactions" value={interactions ?? '...'} loading={loading} />
      <StatTile icon={<Clock />} label="Last Session" value={lastSession} loading={loading} />
      <StatTile icon={<Heart />} label="Saved Locations" value={savedPlaces ?? '...'} loading={loading} />
    </div>
  );
} 
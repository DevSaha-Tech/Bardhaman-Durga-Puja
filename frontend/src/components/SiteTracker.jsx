"use client";

import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Users } from 'lucide-react';

export default function SiteTracker() {
  const [visitorCount, setVisitorCount] = useState(null);

  useEffect(() => {
    const trackVisitor = async () => {
      let visitorId = localStorage.getItem('puja_visitor_id');
      let lastVisit = localStorage.getItem('puja_last_visit');
      const now = Date.now();
      const TWELVE_HOURS = 12 * 60 * 60 * 1000;

      // If no ID or 12 hours have passed, generate new session and count
      if (!visitorId || !lastVisit || (now - parseInt(lastVisit) > TWELVE_HOURS)) {
        visitorId = crypto.randomUUID();
        localStorage.setItem('puja_visitor_id', visitorId);
        localStorage.setItem('puja_last_visit', now.toString());
        
        if (isSupabaseConfigured) {
          try {
            // Using insert because generating a new UUID acts as a new unique session
            await supabase.from('site_views').insert([{ user_uuid: visitorId }]);
          } catch (e) {
            console.error('Failed to log site view', e);
          }
        }
      }

      // Fetch total visitor count
      if (isSupabaseConfigured) {
        try {
          const { count, error } = await supabase
            .from('site_views')
            .select('*', { count: 'exact', head: true });
            
          if (!error && count !== null) {
            setVisitorCount(count);
          }
        } catch (e) {
          console.error('Failed to fetch count', e);
        }
      }
    };
    
    trackVisitor();
  }, []);

  if (visitorCount === null) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-red-900/95 backdrop-blur-md text-white text-[11px] md:text-xs py-1.5 px-4 flex items-center justify-center gap-2 z-[9999] shadow-[0_-4px_15px_rgba(0,0,0,0.1)] font-bold">
      <Users className="w-3.5 h-3.5 opacity-80" />
      মোট ওয়েবসাইট দর্শনার্থী: {visitorCount.toLocaleString('en-IN')}
    </div>
  );
}

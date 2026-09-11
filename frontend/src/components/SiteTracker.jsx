"use client";

import { useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function SiteTracker() {
  useEffect(() => {
    const trackVisitor = async () => {
      let visitorId = localStorage.getItem('puja_visitor_id');
      if (!visitorId) {
        visitorId = crypto.randomUUID();
        localStorage.setItem('puja_visitor_id', visitorId);
        
        if (isSupabaseConfigured) {
          try {
            await supabase.from('site_views').upsert([{ user_uuid: visitorId }], { onConflict: 'user_uuid' });
          } catch (e) {
            console.error('Failed to log site view', e);
          }
        }
      }
    };
    
    trackVisitor();
  }, []);

  return null;
}

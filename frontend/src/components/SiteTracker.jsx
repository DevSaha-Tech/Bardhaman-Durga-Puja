"use client";

import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Users } from 'lucide-react';

function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
  return null;
}

function setCookie(name, value, days) {
  if (typeof document === 'undefined') return;
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax;Secure";
}

export default function SiteTracker() {
  const { t } = useLanguage();
  const [visitorCount, setVisitorCount] = useState(null);

  useEffect(() => {
    const trackVisitor = async () => {
      if (!isSupabaseConfigured) return;

      const visitedCookie = getCookie('puja_visited');

      if (!visitedCookie) {
        try {
          const { error } = await supabase.rpc('increment_visits');
          if (!error) {
            setCookie('puja_visited', '1', 1);
          } else {
            console.warn('Failed to increment visits:', error);
          }
        } catch (e) {
          console.warn('Failed to call increment RPC:', e);
        }
      }

      // Fetch current total
      try {
        const { data, error } = await supabase
          .from('site_stats')
          .select('total_visits')
          .eq('id', 1)
          .single();

        if (!error && data) {
          setVisitorCount(data.total_visits);
        } else {
          console.warn('Failed to fetch total_visits:', error);
        }
      } catch (e) {
        console.warn('Failed to fetch count:', e);
      }
    };
    
    trackVisitor();
  }, []);

  if (visitorCount === null) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-red-900/95 backdrop-blur-md text-white text-[11px] md:text-xs py-1.5 px-4 flex items-center justify-center gap-2 z-[9999] shadow-[0_-4px_15px_rgba(0,0,0,0.1)] font-bold">
      <Users className="w-3.5 h-3.5 opacity-80" />
      {t('site_visitors')}: {visitorCount.toLocaleString('en-IN')}
    </div>
  );
}

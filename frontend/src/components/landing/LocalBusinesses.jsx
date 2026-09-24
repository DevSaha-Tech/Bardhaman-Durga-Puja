"use client";

import React, { useEffect, useState } from 'react';
import { Store, Utensils, Coffee, CupSoda, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import SectionCornerPatterns from './SectionCornerPatterns';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function LocalBusinesses() {
  const { t, lang } = useLanguage();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    async function fetchBusinesses() {
      try {
        if (!supabase) {
          setLoading(false);
          return;
        }
        const { data, error } = await supabase
          .from('businesses')
          .select('id, name, name_en, category, distance, maps_url')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching businesses:', error);
          setBusinesses([]);
        } else {
          setBusinesses(data || []);
        }
      } catch (err) {
        console.error('Error fetching businesses:', err);
        setBusinesses([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBusinesses();
  }, []);

  if (loading) {
    return (
      <section className="relative py-12 md:py-16 bg-[#FAF6EE] border-b border-[#E5DBC8] overflow-hidden">
        <SectionCornerPatterns />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <p className="text-sm md:text-base text-[#6B6257] font-medium animate-pulse">
            {t('biz_loading') || 'Loading...'}
          </p>
        </div>
      </section>
    );
  }

  // If no businesses are fetched, hide the grid and only show the banner
  if (businesses.length === 0) {
    return (
      <section className="relative py-12 md:py-16 bg-[#FAF6EE] border-b border-[#E5DBC8] overflow-hidden">
        <SectionCornerPatterns />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal animation="fade-up" duration={700} className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1F1B16] font-serif mb-3">
              {t('biz_sec_title')}
            </h2>
            <p className="text-base md:text-lg text-[#6B6257]">
              {t('biz_sec_sub')}
            </p>
          </ScrollReveal>
          
          <ScrollReveal animation="scale-up" delay={100} duration={700}>
            <div className="bg-[#FFFEFA] border border-dashed border-[#8B1E3F]/40 p-6 rounded-2xl text-center max-w-xl mx-auto card-hover-lift">
              <p className="text-sm md:text-base text-[#1F1B16] font-medium">
                {t('biz_empty')}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    );
  }

  const getIcon = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('মিষ্টি') || cat.includes('sweet')) return Store;
    if (cat.includes('কফি') || cat.includes('cafe')) return Coffee;
    if (cat.includes('রেস্তোরাঁ') || cat.includes('restaurant') || cat.includes('খাবার')) return Utensils;
    if (cat.includes('চা') || cat.includes('tea')) return CupSoda;
    return Store;
  };

  const handleShowMore = () => setVisibleCount((v) => v + 3);
  const handleShowLess = () => setVisibleCount(3);

  const visibleBusinesses = businesses.slice(0, visibleCount);

  return (
    <section className="relative py-12 md:py-16 bg-[#FAF6EE] border-b border-[#E5DBC8] overflow-hidden">
      <SectionCornerPatterns />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal animation="fade-up" duration={700} className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1F1B16] font-serif mb-3">
            {t('biz_sec_title')}
          </h2>
          <p className="text-base md:text-lg text-[#6B6257]">
            {t('biz_sec_sub')}
          </p>
        </ScrollReveal>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {visibleBusinesses.map((biz, idx) => {
            const IconComp = getIcon(biz.category);
            const displayName = lang === 'en' ? (biz.name_en || biz.name) : biz.name;
            return (
              <ScrollReveal
                key={biz.id}
                animation="fade-up"
                delay={idx * 100}
                duration={750}
                className="h-full"
              >
                <div className="bg-[#FFFEFA] p-5 rounded-2xl border border-[#E5DBC8] shadow-sm card-hover-lift flex flex-col justify-between h-full">
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-[#E8A33D]/10 text-[#E8A33D] flex items-center justify-center mb-4">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-[#1F1B16] text-lg font-serif mb-1">
                      {displayName}
                    </h3>
                    {biz.category && (
                      <span className="inline-block bg-[#FAF6EE] border border-[#E5DBC8] text-[#8B1E3F] text-xs px-2.5 py-0.5 rounded-full font-medium mb-3">
                        {biz.category}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between border-t border-[#E5DBC8]/60 pt-3 mt-2">
                    {biz.distance && (
                      <p className="text-xs text-[#6B6257] font-medium flex items-center gap-1">
                        📍 {biz.distance}
                      </p>
                    )}
                    {biz.maps_url && (
                      <button
                        onClick={() => window.open(biz.maps_url, '_blank')}
                        className="text-[#8B1E3F] hover:bg-[#8B1E3F]/10 p-1.5 rounded-full transition-colors focus:outline-none cursor-pointer"
                        title="Open in Maps"
                      >
                        <MapPin className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Show More / Show Less */}
        <div className="flex justify-center gap-4 mb-10">
          {businesses.length > visibleCount && (
            <button
              onClick={handleShowMore}
              className="px-6 py-2 border border-[#8B1E3F] text-[#8B1E3F] rounded-full text-sm font-medium hover:bg-[#8B1E3F] hover:text-white transition-colors cursor-pointer"
            >
              {t('biz_show_more') || 'Show more'}
            </button>
          )}
          {businesses.length <= visibleCount && visibleCount > 3 && (
            <button
              onClick={handleShowLess}
              className="px-6 py-2 border border-[#6B6257] text-[#6B6257] rounded-full text-sm font-medium hover:bg-[#6B6257] hover:text-white transition-colors cursor-pointer"
            >
              {t('biz_show_less') || 'Show less'}
            </button>
          )}
        </div>

        {/* Business Feature Invitation Banner */}
        <ScrollReveal animation="scale-up" delay={200} duration={700}>
          <div className="bg-[#FFFEFA] border border-dashed border-[#8B1E3F]/40 p-6 rounded-2xl text-center max-w-xl mx-auto card-hover-lift">
            <p className="text-sm md:text-base text-[#1F1B16] font-medium">
              {t('biz_empty')}
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

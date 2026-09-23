"use client";

import React from 'react';
import { Store, Utensils, Coffee, CupSoda } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import SectionCornerPatterns from './SectionCornerPatterns';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function LocalBusinesses() {
  const { t } = useLanguage();

  const businesses = [
    {
      nameKey: 'item1_name',
      catKey: 'item1_cat',
      distKey: 'item1_dist',
      icon: Store,
    },
    {
      nameKey: 'item2_name',
      catKey: 'item2_cat',
      distKey: 'item2_dist',
      icon: Coffee,
    },
    {
      nameKey: 'item3_name',
      catKey: 'item3_cat',
      distKey: 'item3_dist',
      icon: Utensils,
    },
    {
      nameKey: 'item4_name',
      catKey: 'item4_cat',
      distKey: 'item4_dist',
      icon: CupSoda,
    },
  ];

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {businesses.map((biz, idx) => {
            const IconComp = biz.icon;
            return (
              <ScrollReveal
                key={idx}
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
                      {t(biz.nameKey)}
                    </h3>
                    <span className="inline-block bg-[#FAF6EE] border border-[#E5DBC8] text-[#8B1E3F] text-xs px-2.5 py-0.5 rounded-full font-medium mb-3">
                      {t(biz.catKey)}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B6257] font-medium border-t border-[#E5DBC8]/60 pt-3 mt-2">
                    📍 {t(biz.distKey)}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Business Feature Invitation Banner */}
        <ScrollReveal animation="scale-up" delay={400} duration={700}>
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

"use client";

import React from 'react';
import { Clock, Users, Smartphone, Heart } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import SectionCornerPatterns from './SectionCornerPatterns';
import SectionDivider from './SectionDivider';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function WhyCholoPujo() {
  const { t } = useLanguage();

  const benefits = [
    {
      icon: Clock,
      titleKey: 'why1_t',
      descKey: 'why1_d',
      iconClass: 'w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#80132F]',
    },
    {
      icon: Users,
      titleKey: 'why2_t',
      descKey: 'why2_d',
      iconClass: 'w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#80132F]',
    },
    {
      icon: Smartphone,
      titleKey: 'why3_t',
      descKey: 'why3_d',
      iconClass: 'w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#80132F]',
    },
    {
      icon: Heart,
      titleKey: 'why4_t',
      descKey: 'why4_d',
      iconClass: 'w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#80132F] fill-[#80132F]',
    },
  ];

  return (
    <section className="relative py-12 md:py-16 bg-[#FAF6EE] border-b border-[#E5DBC8] overflow-hidden">
      <SectionCornerPatterns />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading with decorative Lotus Divider */}
        <ScrollReveal animation="fade-up" duration={700} className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#80132F] font-serif mb-1">
            {t('why_sec_title')}
          </h2>
          <SectionDivider />
          <p className="text-sm sm:text-base text-[#6B6257] font-medium">
            {t('why_sec_sub')}
          </p>
        </ScrollReveal>

        {/* Benefits Cards Grid with Option A adaptive layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5 items-stretch">
          {benefits.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <ScrollReveal
                key={idx}
                animation="fade-up"
                delay={idx * 100}
                duration={700}
                className="h-full"
              >
                <div className="bg-white p-3.5 sm:p-4 md:p-4.5 rounded-2xl border border-[#F0EAE1] shadow-[0_4px_16px_-2px_rgba(139,30,63,0.05),0_1px_3px_rgba(0,0,0,0.03)] card-hover-lift hover:border-[#80132F]/20 hover:shadow-md transition-all duration-300 flex flex-row items-start gap-3 sm:gap-3.5 h-full">
                  {/* Pale circular icon container */}
                  <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-[#FAF0E6] border border-[#F3E5D4] flex items-center justify-center shrink-0 mt-0.5">
                    <IconComp className={item.iconClass} strokeWidth={2.2} />
                  </div>
                  {/* Card Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-[#80132F] font-serif mb-0.5 tracking-tight">
                      {t(item.titleKey)}
                    </h3>
                    <p className="text-[#5A524A] text-xs sm:text-[13px] leading-relaxed">
                      {t(item.descKey)}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

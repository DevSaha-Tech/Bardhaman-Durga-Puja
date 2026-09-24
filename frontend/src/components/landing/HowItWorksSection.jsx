"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import SectionCornerPatterns from './SectionCornerPatterns';
import SectionDivider from './SectionDivider';
import ScrollReveal from '@/components/ui/ScrollReveal';

// Custom icons matching the reference design for How It Works
function LocationRadarIcon({ className = "w-9 h-9" }) {
  return (
    <svg className={className} viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Ground ripple concentric rings */}
      <ellipse cx="26" cy="38" rx="14" ry="4.5" stroke="#D9A86C" strokeWidth="2" strokeDasharray="3 2.5" />
      <ellipse cx="26" cy="38" rx="8" ry="2.6" stroke="#C26724" strokeWidth="1.8" />
      {/* Location Pin */}
      <path 
        d="M26 12C21.858 12 18.5 15.358 18.5 19.5C18.5 25.5 26 35 26 35C26 35 33.5 25.5 33.5 19.5C33.5 15.358 30.142 12 26 12Z" 
        fill="#80132F" 
      />
      <circle cx="26" cy="19.5" r="3" fill="#FAF0E6" />
    </svg>
  );
}

function PandalChecklistIcon({ className = "w-9 h-9" }) {
  return (
    <svg className={className} viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Checkbox 1 */}
      <rect x="13" y="14" width="10" height="10" rx="2.5" fill="#D97736" />
      <path d="M15.5 19L17.5 21L21 16.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* Lines 1 */}
      <line x1="27" y1="17" x2="39" y2="17" stroke="#D9A86C" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="27" y1="21" x2="35" y2="21" stroke="#D9A86C" strokeWidth="2.4" strokeLinecap="round" />

      {/* Checkbox 2 */}
      <rect x="13" y="28" width="10" height="10" rx="2.5" fill="#D97736" />
      <path d="M15.5 33L17.5 35L21 30.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* Lines 2 */}
      <line x1="27" y1="31" x2="39" y2="31" stroke="#D9A86C" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="27" y1="35" x2="35" y2="35" stroke="#D9A86C" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function RoutePlaneIcon({ className = "w-9 h-9" }) {
  return (
    <svg className={className} viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Flight trajectory trail */}
      <path 
        d="M12 38C15 36 19 32 23 28" 
        stroke="#D9A86C" 
        strokeWidth="2.4" 
        strokeLinecap="round" 
        strokeDasharray="2.5 3.5" 
      />
      {/* Flying Paper Plane */}
      <path d="M41 12L20 23.5L26.5 28L41 12Z" fill="#80132F" />
      <path d="M41 12L30 38L26.5 28L41 12Z" fill="#A82346" />
      <path d="M26.5 28L23 33.5V29L26.5 28Z" fill="#5F0A20" />
    </svg>
  );
}

function NavigationVoiceIcon({ className = "w-9 h-9" }) {
  return (
    <svg className={className} viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Simple navigation arrow */}
      <path d="M26 12L14 36L26 31L38 36L26 12Z" fill="#80132F" />
      {/* Voice waves */}
      <path d="M12 24C12 24 16 20 26 20C36 20 40 24 40 24" stroke="#D9A86C" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export default function HowItWorksSection() {
  const { t } = useLanguage();

  const steps = [
    {
      numberKey: 'hiw1_n',
      titleKey: 'hiw1_t',
      textKey: 'hiw1_d',
      Icon: LocationRadarIcon,
    },
    {
      numberKey: 'hiw2_n',
      titleKey: 'hiw2_t',
      textKey: 'hiw2_d',
      Icon: PandalChecklistIcon,
    },
    {
      numberKey: 'hiw3_n',
      titleKey: 'hiw3_t',
      textKey: 'hiw3_d',
      Icon: RoutePlaneIcon,
    },
    {
      numberKey: 'hiw4_n',
      titleKey: 'hiw4_t',
      textKey: 'hiw4_d',
      Icon: NavigationVoiceIcon,
    },
  ];

  return (
    <section id="how-it-works" className="relative py-12 md:py-16 bg-[#FAF6EE] border-b border-[#E5DBC8] scroll-mt-16 overflow-hidden">
      <SectionCornerPatterns />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading with decorative Lotus Divider */}
        <ScrollReveal animation="fade-up" duration={700} className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#80132F] font-serif mb-1">
            {t('hiw_sec_title')}
          </h2>
          <SectionDivider />
          <p className="text-sm sm:text-base text-[#6B6257] font-medium">
            {t('hiw_sec_sub')}
          </p>
        </ScrollReveal>

        {/* Steps Grid matching Reference Image with Option A proportions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 relative mb-12 items-stretch">
          {steps.map((step, idx) => {
            const IconComp = step.Icon;
            return (
              <ScrollReveal
                key={idx}
                animation="fade-up"
                delay={idx * 140}
                duration={750}
                className="h-full"
              >
                <div className="bg-white p-4 sm:p-5 md:p-6 rounded-2xl border border-[#F0EAE1] shadow-[0_4px_20px_-2px_rgba(139,30,63,0.05),0_1px_3px_rgba(0,0,0,0.03)] card-hover-lift hover:border-[#80132F]/20 hover:shadow-md transition-all duration-300 flex flex-row items-start gap-3.5 sm:gap-4 md:gap-5 h-full relative">
                  {/* Pale circular icon container with overlapping Step Badge */}
                  <div className="relative w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] md:w-[68px] md:h-[68px] rounded-full bg-[#FAF0E6] border border-[#F3E5D4] flex items-center justify-center shrink-0 mt-0.5">
                    {/* Badge overlapping on top-left of circle */}
                    <span className="absolute -top-1 -left-1 w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full bg-[#80132F] text-white text-[10px] sm:text-[11px] font-bold flex items-center justify-center shadow-sm z-10">
                      {t(step.numberKey)}
                    </span>
                    <IconComp className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" />
                  </div>

                  {/* Card Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-[#80132F] font-serif mb-1 leading-snug tracking-tight">
                      {t(step.titleKey)}
                    </h3>
                    <p className="text-[#5A524A] text-xs sm:text-[13.5px] leading-relaxed">
                      {t(step.textKey)}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* CTA Button */}
        <ScrollReveal animation="fade-up" delay={450} duration={600} className="text-center">
          <Link
            href="/planner"
            className="inline-block bg-[#8B1E3F] text-[#FFFEFA] border-2 border-[#8B1E3F] hover:bg-[#FFFEFA] hover:text-[#8B1E3F] font-bold text-base sm:text-lg px-8 py-3.5 rounded-full shadow-md hover:shadow-xl transform transition-all duration-300 ease-out text-center focus:outline-none focus:ring-2 focus:ring-[#8B1E3F] focus:ring-offset-2 focus:ring-offset-[#FAF6EE] hover:scale-105 active:scale-95 cursor-pointer"
          >
            {t('hiw_cta_btn')}
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

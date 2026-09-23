"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import SectionCornerPatterns from './SectionCornerPatterns';
import SectionDivider from './SectionDivider';
import ScrollReveal from '@/components/ui/ScrollReveal';

// Custom icons matching the reference design
function MapRouteIcon({ className = "w-9 h-9" }) {
  return (
    <svg className={className} viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Folded Map Canvas */}
      <path 
        d="M7 16L19 10L33 16L45 10V36L33 42L19 36L7 42V16Z" 
        fill="#FDF6ED" 
        stroke="#D9A86C" 
        strokeWidth="2.2" 
        strokeLinejoin="round" 
      />
      <path 
        d="M19 10V36" 
        stroke="#D9A86C" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeDasharray="2.5 3" 
      />
      <path 
        d="M33 16V42" 
        stroke="#D9A86C" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeDasharray="2.5 3" 
      />
      {/* Central Route Pin */}
      <path 
        d="M26 12C22.134 12 19 15.134 19 19C19 24.5 26 31 26 31C26 31 33 24.5 33 19C33 15.134 29.866 12 26 12Z" 
        fill="#80132F" 
      />
      <circle cx="26" cy="19" r="3" fill="#FAF0E6" />
    </svg>
  );
}

function VoiceMicIcon({ className = "w-9 h-9" }) {
  return (
    <svg className={className} viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left sound waves */}
      <path d="M11 22V30" stroke="#D9A86C" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M16 18V34" stroke="#D9A86C" strokeWidth="2.8" strokeLinecap="round" />
      {/* Mic capsule */}
      <rect x="22" y="11" width="8" height="17" rx="4" fill="#80132F" />
      {/* Mic holder bracket */}
      <path 
        d="M18 22.5C18 26.918 21.582 30.5 26 30.5C30.418 30.5 34 26.918 34 22.5" 
        stroke="#80132F" 
        strokeWidth="2.8" 
        strokeLinecap="round" 
      />
      <path d="M26 30.5V38M21 38H31" stroke="#80132F" strokeWidth="2.8" strokeLinecap="round" />
      {/* Right sound waves */}
      <path d="M36 18V34" stroke="#D9A86C" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M41 22V30" stroke="#D9A86C" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}

function ShareNodesIcon({ className = "w-9 h-9" }) {
  return (
    <svg className={className} viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Connection lines */}
      <line x1="18" y1="26" x2="34" y2="17" stroke="#D9A86C" strokeWidth="3" strokeLinecap="round" />
      <line x1="18" y1="26" x2="34" y2="35" stroke="#D9A86C" strokeWidth="3" strokeLinecap="round" />
      {/* Main Left Node */}
      <circle cx="17" cy="26" r="7.5" fill="#80132F" />
      <circle cx="17" cy="26" r="2.5" fill="#FAF0E6" />
      {/* Top Right Node */}
      <circle cx="35" cy="16" r="6" fill="#80132F" />
      <circle cx="35" cy="16" r="2" fill="#FAF0E6" />
      {/* Bottom Right Node */}
      <circle cx="35" cy="36" r="6" fill="#80132F" />
      <circle cx="35" cy="36" r="2" fill="#FAF0E6" />
    </svg>
  );
}

export default function FeatureCards() {
  const { t } = useLanguage();

  const features = [
    {
      Icon: MapRouteIcon,
      titleKey: 'feat1_card_t',
      descKey: 'feat1_card_d',
    },
    {
      Icon: VoiceMicIcon,
      titleKey: 'feat2_card_t',
      descKey: 'feat2_card_d',
    },
    {
      Icon: ShareNodesIcon,
      titleKey: 'feat3_card_t',
      descKey: 'feat3_card_d',
    },
  ];

  return (
    <section className="relative py-12 md:py-16 bg-[#FAF6EE] border-b border-[#E5DBC8] overflow-hidden">
      <SectionCornerPatterns />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading with decorative Lotus Divider */}
        <ScrollReveal animation="fade-up" duration={700} className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#80132F] font-serif mb-1">
            {t('feat_sec_title')}
          </h2>
          <SectionDivider />
          <p className="text-sm sm:text-base text-[#6B6257] font-medium">
            {t('feat_sec_sub')}
          </p>
        </ScrollReveal>

        {/* Feature Cards Grid - Option A Adaptive proportions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 items-stretch">
          {features.map((feat, idx) => {
            const IconComp = feat.Icon;
            return (
              <ScrollReveal
                key={idx}
                animation="fade-up"
                delay={idx * 120}
                duration={750}
                className="h-full"
              >
                <div className="bg-white p-4 sm:p-5 md:p-6 rounded-2xl border border-[#F0EAE1] shadow-[0_4px_20px_-2px_rgba(139,30,63,0.05),0_1px_3px_rgba(0,0,0,0.03)] card-hover-lift hover:border-[#80132F]/20 hover:shadow-md transition-all duration-300 flex flex-row items-start gap-3.5 sm:gap-4 md:gap-5 h-full">
                  {/* Pale circular icon container with responsive scaling */}
                  <div className="w-13 h-13 sm:w-15 sm:h-15 md:w-17 md:h-17 w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] md:w-[68px] md:h-[68px] rounded-full bg-[#FAF0E6] border border-[#F3E5D4] flex items-center justify-center shrink-0 mt-0.5">
                    <IconComp className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" />
                  </div>
                  {/* Card Content with ample reading room */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-[#80132F] font-serif mb-1 leading-snug tracking-tight">
                      {t(feat.titleKey)}
                    </h3>
                    <p className="text-[#5A524A] text-xs sm:text-[13.5px] leading-relaxed">
                      {t(feat.descKey)}
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

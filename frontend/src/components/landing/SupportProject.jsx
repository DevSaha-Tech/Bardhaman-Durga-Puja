"use client";

import React from 'react';
import { Heart, QrCode } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

import SectionCornerPatterns from './SectionCornerPatterns';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function SupportProject() {
  const { t } = useLanguage();

  return (
    <section className="relative py-12 md:py-16 bg-[#FAF6EE] border-b border-[#E5DBC8] overflow-hidden">
      <SectionCornerPatterns />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal animation="scale-up" duration={800}>
          <div className="bg-[#FFFEFA] p-8 md:p-12 rounded-3xl border border-[#E5DBC8] shadow-sm text-center relative overflow-hidden card-hover-lift">
            <div className="w-12 h-12 rounded-full bg-[#8B1E3F]/10 text-[#8B1E3F] flex items-center justify-center mx-auto mb-6">
              <Heart className="w-6 h-6 fill-[#8B1E3F]/20" />
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1F1B16] font-serif mb-3">
              {t('supp_sec_title')}
            </h2>
            <p className="text-sm md:text-base font-semibold text-[#8B1E3F] mb-6">
              {t('supp_sec_sub')}
            </p>

            <p className="text-[#6B6257] text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              {t('supp_body')}
            </p>

            {/* QR Code Container Card */}
            <div className="bg-[#FAF6EE] p-6 rounded-2xl border border-[#E5DBC8] max-w-xs mx-auto flex flex-col items-center card-hover-lift">
              <div className="w-40 h-40 bg-white border border-[#E5DBC8] rounded-xl flex flex-col items-center justify-center text-[#6B6257] mb-4 p-4 shadow-inner">
                <QrCode className="w-16 h-16 text-[#8B1E3F] mb-2 opacity-80" />
                <span className="text-xs font-semibold text-[#1F1B16]">
                  {t('supp_qr_soon')}
                </span>
              </div>
              <p className="font-bold text-[#1F1B16] text-sm mb-1">
                {t('supp_qr_scan')}
              </p>
              <p className="text-xs text-[#6B6257] font-medium">
                {t('supp_qr_note')}
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

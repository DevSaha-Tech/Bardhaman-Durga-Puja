"use client";

import React from 'react';
import { Phone, Shield, Cross, Truck, Flame } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import SectionCornerPatterns from './SectionCornerPatterns';
import SectionDivider from './SectionDivider';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function EmergencyNumbers() {
  const { t } = useLanguage();

  const emergencyContacts = [
    {
      nameKey: 'emerg1_name',
      numKey: 'emerg1_num',
      phone: '100',
      icon: Shield,
    },
    {
      nameKey: 'emerg2_name',
      numKey: 'emerg2_num',
      phone: '108',
      icon: Cross,
    },
    {
      nameKey: 'emerg3_name',
      numKey: 'emerg3_num',
      phone: '102',
      icon: Truck,
    },
    {
      nameKey: 'emerg4_name',
      numKey: 'emerg4_num',
      phone: '101',
      icon: Flame,
    },
  ];

  return (
    <section className="relative py-12 md:py-16 bg-[#FAF6EE] border-b border-[#E5DBC8] overflow-hidden">
      <SectionCornerPatterns />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal animation="fade-up" duration={700} className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#80132F] font-serif mb-1">
            {t('emerg_sec_title')}
          </h2>
          <SectionDivider />
          <p className="text-sm sm:text-base text-[#6B6257] font-medium">
            {t('emerg_sec_sub')}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {emergencyContacts.map((contact, idx) => {
            const IconComp = contact.icon;
            return (
              <ScrollReveal
                key={idx}
                animation="fade-up"
                delay={idx * 100}
                duration={700}
                className="h-full"
              >
                <a
                  href={`tel:${contact.phone}`}
                  className="bg-white p-5 rounded-2xl border border-[#F0EAE1] shadow-[0_4px_16px_-2px_rgba(139,30,63,0.05),0_1px_3px_rgba(0,0,0,0.03)] card-hover-lift hover:border-[#80132F]/30 hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group h-full"
                >
                  <div className="w-12 h-12 rounded-full bg-[#FAF0E6] border border-[#F3E5D4] text-[#80132F] group-hover:bg-[#80132F] group-hover:text-white transition-colors flex items-center justify-center mb-3.5">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#1F1B16] font-serif mb-2 line-clamp-2">
                    {t(contact.nameKey)}
                  </h3>
                  <div className="flex items-center gap-1.5 text-base sm:text-lg font-extrabold text-[#80132F]">
                    <Phone className="w-4 h-4" />
                    <span>{t(contact.numKey)}</span>
                  </div>
                </a>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import FeedbackModal from '../FeedbackModal';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function LandingFooter() {
  const { t } = useLanguage();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <footer className="bg-[#FAF6EE] border-t border-[#E5DBC8] pt-16 pb-12 text-[#1F1B16]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fade-up" duration={700}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#E5DBC8]">
            {/* Column 1: Logo & Branding */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 shrink-0">
                  <Image
                    src="/logo.png"
                    alt="Cholo Pujo Logo"
                    fill
                    className="object-contain"
                    sizes="32px"
                  />
                </div>
                <span className="text-xl font-bold font-serif text-[#8B1E3F]">
                  Cholo Pujo
                </span>
              </div>
              <p className="text-sm font-semibold text-[#8B1E3F] font-serif">
                &quot;{t('foot_tagline')}&quot;
              </p>
              <p className="text-xs text-[#6B6257] font-medium">
                {t('foot_init')}
              </p>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-[#1F1B16] font-serif uppercase tracking-wider">
                {t('foot_nav_title')}
              </h4>
              <ul className="space-y-2 text-sm text-[#6B6257]">
                <li>
                  <Link href="/" className="hover:text-[#8B1E3F] transition-colors">
                    {t('foot_home')}
                  </Link>
                </li>
                <li>
                  <Link href="/planner" className="hover:text-[#8B1E3F] transition-colors">
                    {t('foot_start')}
                  </Link>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-[#8B1E3F] transition-colors">
                    {t('foot_hiw')}
                  </a>
                </li>
                <li>
                  <Link href="/planner" className="hover:text-[#8B1E3F] transition-colors">
                    {t('foot_list')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Cities */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-[#1F1B16] font-serif uppercase tracking-wider">
                {t('foot_cities_title')}
              </h4>
              <ul className="space-y-2 text-sm text-[#6B6257]">
                <li>
                  <Link href="/planner?city=bardhaman" className="hover:text-[#8B1E3F] transition-colors">
                    {t('foot_bwn')}
                  </Link>
                </li>
                <li>
                  <Link href="/planner?city=katwa" className="hover:text-[#8B1E3F] transition-colors">
                    {t('foot_ktw')}
                  </Link>
                </li>
                <li>
                  <span className="text-xs text-[#6B6257]/70 italic">
                    {t('foot_more')}
                  </span>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact & Social */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-[#1F1B16] font-serif uppercase tracking-wider">
                {t('foot_contact_title')}
              </h4>
              <ul className="space-y-2 text-sm text-[#6B6257]">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#8B1E3F]" />
                  <a href="mailto:contact@devsaha.tech" className="hover:text-[#8B1E3F] transition-colors">
                    contact@devsaha.tech
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => setIsFeedbackOpen(true)}
                    className="flex items-center gap-2 text-left hover:text-[#8B1E3F] transition-colors focus:outline-none cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-[#8B1E3F]" />
                    <span>{t('foot_feedback')}</span>
                  </button>
                </li>
                <li className="flex items-center gap-2 pt-1">
                  <svg className="w-4 h-4 fill-current text-[#1F1B16]" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  <a
                    href="https://github.com/DevSaha-Tech/Bardhaman-Durga-Puja"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#8B1E3F] transition-colors"
                  >
                    {t('foot_github')}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </ScrollReveal>

        {/* Bottom copyright bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B6257]">
          <p>{t('foot_copy')}</p>
          <p className="text-center sm:text-right">{t('foot_terms')}</p>
        </div>
      </div>

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </footer>
  );
}

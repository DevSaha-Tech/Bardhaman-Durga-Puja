"use client";

import React from 'react';
import { MapPin, MousePointerClick, Navigation } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function HowItWorks() {
  const { t } = useLanguage();

  return (
    <section id="how-it-works" className="py-24 bg-[#FAF8F5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold text-red-900 mb-6 drop-shadow-sm">{t('hiw_title')}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('hiw_desc')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-amber-300 to-transparent z-0 border-t-2 border-dashed border-amber-300/50"></div>

          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center text-center hover:-translate-y-2 transition-all duration-500 group">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl shadow-amber-900/5 border-4 border-amber-50 mb-8 relative group-hover:border-amber-200 transition-colors">
              <span className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-red-700 to-red-900 text-white rounded-full flex items-center justify-center font-bold text-lg border-4 border-[#FAF8F5] shadow-sm font-sans">1</span>
              <MapPin className="w-10 h-10 text-red-700 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('hiw1_t')}</h3>
            <p className="text-gray-600 text-lg leading-relaxed">{t('hiw1_d')}</p>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center text-center hover:-translate-y-2 transition-all duration-500 group delay-100">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl shadow-amber-900/5 border-4 border-amber-50 mb-8 relative group-hover:border-amber-200 transition-colors">
              <span className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-red-700 to-red-900 text-white rounded-full flex items-center justify-center font-bold text-lg border-4 border-[#FAF8F5] shadow-sm font-sans">2</span>
              <MousePointerClick className="w-10 h-10 text-amber-500 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('hiw2_t')}</h3>
            <p className="text-gray-600 text-lg leading-relaxed">{t('hiw2_d')}</p>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center text-center hover:-translate-y-2 transition-all duration-500 group delay-200">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl shadow-amber-900/5 border-4 border-amber-50 mb-8 relative group-hover:border-amber-200 transition-colors">
              <span className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-red-700 to-red-900 text-white rounded-full flex items-center justify-center font-bold text-lg border-4 border-[#FAF8F5] shadow-sm font-sans">3</span>
              <Navigation className="w-10 h-10 text-green-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('hiw3_t')}</h3>
            <p className="text-gray-600 text-lg leading-relaxed">{t('hiw3_d')}</p>
          </div>

        </div>
      </div>
    </section>
  );
}

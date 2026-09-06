"use client";

import React from 'react';
import Image from 'next/image';
import { Navigation, MapPin, ShieldCheck, Zap, Sparkles, Landmark, Code } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <div className="relative bg-gradient-to-br from-[#FAF8F5] to-amber-50/30 pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
      
      {/* Background Graphic/Image Overlay with slow zoom animation */}
      <div className="absolute inset-0 z-0 opacity-15 md:opacity-25 overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1601662528567-526cd06f6582?auto=format&fit=crop&w=1200&q=80"
          alt="Durga Puja Festive Background"
          className="object-cover w-full h-full animate-[spin_120s_linear_infinite]"
          fill
          priority
          style={{ transform: 'scale(1.2)', animationName: 'none' }} // Removing spin for premium zoom
        />
        {/* CSS for custom slow zoom - added inline for simplicity and zero config overhead */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes slowZoom {
            0% { transform: scale(1.05); }
            50% { transform: scale(1.15); }
            100% { transform: scale(1.05); }
          }
          .animate-slow-zoom { animation: slowZoom 20s ease-in-out infinite; }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
          .animation-delay-200 { animation-delay: 200ms; }
          .animation-delay-400 { animation-delay: 400ms; }
        `}} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5]/80 via-transparent to-[#FAF8F5]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        
        {/* Header Pill */}
        <div className="opacity-0 animate-fade-in-up inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-amber-200 mb-8 shadow-sm hover:shadow-md transition-shadow">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-amber-900 text-xs sm:text-sm font-bold tracking-wider uppercase">{t('hero_pill')}</span>
        </div>

        {/* Main Headline */}
        <h1 className="opacity-0 animate-fade-in-up animation-delay-200 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.15] mb-8 max-w-5xl drop-shadow-sm">
          {t('hero_title1')} <br className="hidden md:block"/> 
          <span className="text-red-700 bg-clip-text">{t('hero_title2')}</span>
        </h1>

        {/* Sub-headline */}
        <p className="opacity-0 animate-fade-in-up animation-delay-400 text-base sm:text-lg md:text-xl text-gray-600 mb-12 max-w-3xl leading-relaxed px-2">
          {t('hero_desc')}
        </p>

        {/* Action CTAs */}
        <div className="opacity-0 animate-fade-in-up animation-delay-400 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 mb-20 w-full px-4 sm:px-0">
          <a href="/planner" className="group w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-red-700 to-red-900 text-white px-8 py-4 sm:py-5 rounded-2xl sm:rounded-full font-bold text-lg shadow-xl shadow-red-900/20 hover:shadow-2xl hover:shadow-red-900/30 transition-all duration-300 hover:-translate-y-1 border border-red-600/50">
            <MapPin className="w-5 h-5 group-hover:animate-bounce" />
            {t('hero_btn1')}
          </a>
          <a href="#features" className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-red-900 border-2 border-red-100 px-8 py-4 sm:py-5 rounded-2xl sm:rounded-full font-bold text-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-red-200">
            <Landmark className="w-5 h-5 text-red-700" />
            {t('hero_btn2')}
          </a>
        </div>

        {/* Visual Grid & Stats Badges */}
        <div className="opacity-0 animate-fade-in-up animation-delay-400 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-5xl px-2">
          <div className="bg-white/95 backdrop-blur-md border border-amber-200/50 p-5 sm:p-6 rounded-3xl shadow-lg shadow-amber-900/5 flex flex-col items-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 group-hover:bg-amber-100 transition-colors flex items-center justify-center mb-3">
              <ShieldCheck className="w-6 h-6 text-amber-600" />
            </div>
            <span className="font-extrabold text-2xl text-gray-900 font-sans">20+</span>
            <span className="text-sm text-gray-500 font-medium text-center mt-1">{t('stat_verified')}</span>
          </div>
          <div className="bg-white/95 backdrop-blur-md border border-amber-200/50 p-5 sm:p-6 rounded-3xl shadow-lg shadow-amber-900/5 flex flex-col items-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 group-hover:bg-amber-100 transition-colors flex items-center justify-center mb-3">
              <Zap className="w-6 h-6 text-amber-600" />
            </div>
            <span className="font-extrabold text-2xl text-gray-900 font-sans">0</span>
            <span className="text-sm text-gray-500 font-medium text-center mt-1">{t('stat_lag')}</span>
          </div>
          <div className="bg-white/95 backdrop-blur-md border border-amber-200/50 p-5 sm:p-6 rounded-3xl shadow-lg shadow-amber-900/5 flex flex-col items-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 group-hover:bg-amber-100 transition-colors flex items-center justify-center mb-3">
              <Code className="w-6 h-6 text-amber-600" />
            </div>
            <span className="font-extrabold text-2xl text-gray-900 font-sans">100%</span>
            <span className="text-sm text-gray-500 font-medium text-center mt-1">{t('stat_free')}</span>
          </div>
          <div className="bg-white/95 backdrop-blur-md border border-amber-200/50 p-5 sm:p-6 rounded-3xl shadow-lg shadow-amber-900/5 flex flex-col items-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 group-hover:bg-amber-100 transition-colors flex items-center justify-center mb-3">
              <Navigation className="w-6 h-6 text-amber-600" />
            </div>
            <span className="font-extrabold text-2xl text-gray-900 font-sans">{t('stat_lang')}</span>
            <span className="text-sm text-gray-500 font-medium text-center mt-1">{t('stat_turn')}</span>
          </div>
        </div>

      </div>
    </div>
  );
}

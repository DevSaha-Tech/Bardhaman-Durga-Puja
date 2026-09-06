"use client";

import React from 'react';
import { Map, Navigation } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-xl border-b border-amber-200/50 shadow-sm transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-red-700 to-red-900 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/20">
               <Map className="w-6 h-6 text-amber-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl text-red-900 leading-tight tracking-tight">{t('brand_title')} <span className="font-sans">2026</span></span>
              <span className="text-[11px] text-amber-600 font-bold tracking-widest uppercase">{t('brand_subtitle')}</span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-10">
            <a href="/#how-it-works" className="text-gray-600 hover:text-red-700 font-bold text-sm tracking-wide transition-colors">{t('how_it_works')}</a>
            <a href="/#features" className="text-gray-600 hover:text-red-700 font-bold text-sm tracking-wide transition-colors">{t('pandal_list')}</a>
            <a href="/planner" className="text-gray-600 hover:text-red-700 font-bold text-sm tracking-wide transition-colors">{t('route_planner')}</a>
            <a href="/#map" className="text-gray-600 hover:text-red-700 font-bold text-sm tracking-wide transition-colors">{t('live_map')}</a>
          </div>

          {/* Quick CTA & Language Selector */}
          <div className="flex items-center gap-4">
            
            <select 
              suppressHydrationWarning
              value={lang} 
              onChange={(e) => setLang(e.target.value)}
              className="bg-gray-100 border border-gray-200 text-gray-800 text-sm font-bold rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
            >
              <option value="bn">বাংলা</option>
              <option value="bng">বাংলিশ</option>
              <option value="en">English</option>
            </select>

            <a 
              href="/planner"
              className="group flex items-center gap-2 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-red-900/20 hover:shadow-xl hover:shadow-red-900/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              <Navigation className="w-4 h-4 text-amber-300 group-hover:animate-pulse" />
              <span className="hidden sm:inline">{t('start_tour')}</span>
              <span className="sm:hidden">Plan</span>
            </a>
          </div>

        </div>
      </div>
    </nav>
  );
}

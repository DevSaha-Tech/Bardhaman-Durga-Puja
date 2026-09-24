"use client";

import React from 'react';
import Image from 'next/image';
import { Navigation } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from './LanguageSelector';

export default function Navbar() {
  const { t } = useLanguage();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#FAF6EE]/90 backdrop-blur-md border-b border-[#E5DBC8] shadow-xs transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* Logo & Brand */}
          <a href="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 shrink-0 transition-transform group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="Cholo Pujo Logo"
                fill
                priority
                className="object-contain"
                sizes="44px"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg md:text-xl text-[#8B1E3F] font-serif leading-tight">Cholo Pujo</span>
              <span className="block text-right text-[9px] text-[#6B6257] font-semibold tracking-wide leading-tight mt-0.5">by DevSaha Tech</span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-[#6B6257] hover:text-[#8B1E3F] font-semibold text-sm transition-colors">{t('how_it_works')}</a>
            <a href="/planner" className="text-[#6B6257] hover:text-[#8B1E3F] font-semibold text-sm transition-colors">{t('route_planner')}</a>
          </div>

          {/* Quick CTA & Language Selector */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <LanguageSelector />

            <a 
              href="/planner"
              className="group flex items-center gap-2 bg-[#8B1E3F] text-[#FFFEFA] border-2 border-[#8B1E3F] hover:bg-[#FFFEFA] hover:text-[#8B1E3F] px-4 md:px-5 py-1.5 md:py-2 rounded-full font-bold text-xs md:text-sm shadow-sm hover:shadow-lg transform transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-[#8B1E3F] hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#E8A33D] group-hover:text-[#8B1E3F] transition-colors duration-300" />
              <span className="hidden sm:inline">{t('start_tour')}</span>
              <span className="sm:hidden">Start</span>
            </a>
          </div>

        </div>
      </div>
    </nav>
  );
}

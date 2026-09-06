"use client";

import React from 'react';
import { Heart, Phone, Shield } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-8 border-t-4 border-red-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 border-b border-stone-800 pb-12">
          
          {/* Brand & Greeting */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-4">{t('brand_title')} 2026</h2>
            <p className="text-amber-500 font-medium mb-6 text-lg">{t('foot_greeting')}</p>
            <p className="max-w-md text-sm leading-relaxed text-stone-400">
              {t('foot_desc')}
            </p>
          </div>

          {/* Emergency Helplines */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-500" />
              {t('foot_emergency')}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-stone-800 rounded-full">
                  <Phone className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <span className="block text-stone-400 text-xs">{t('foot_police')}</span>
                  <span className="text-white font-medium font-sans">100 / 112</span>
                </div>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-stone-800 rounded-full">
                  <Phone className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <span className="block text-stone-400 text-xs">{t('foot_hospital')}</span>
                  <span className="text-white font-medium font-sans">102 / 0342-2662788</span>
                </div>
              </li>
            </ul>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 Puja Parikrama (Bardhaman). All rights reserved.</p>
          
          <div className="flex items-center gap-1 font-medium text-stone-400">
            Made with <Heart className="w-3 h-3 text-red-600 fill-red-600 mx-1 animate-pulse" /> by <a href="https://devsaha.tech" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-400 underline decoration-amber-500/30 underline-offset-4 transition-colors font-bold">DevSaha Tech</a>
          </div>
          
          <a href="#" className="hover:text-amber-500 transition-colors">
            GitHub Open Source Repository
          </a>
        </div>

      </div>
    </footer>
  );
}

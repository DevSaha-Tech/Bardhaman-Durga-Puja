"use client";

import React from 'react';
import { Route, Clock, Volume2, ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Features() {
  const { t } = useLanguage();

  const features = [
    {
      id: 1,
      icon: <Route className="w-8 h-8 text-amber-500" />,
      title: t('feat1_t'),
      description: t('feat1_d')
    },
    {
      id: 2,
      icon: <Clock className="w-8 h-8 text-amber-500" />,
      title: t('feat2_t'),
      description: t('feat2_d')
    },
    {
      id: 3,
      icon: <Volume2 className="w-8 h-8 text-amber-500" />,
      title: t('feat3_t'),
      description: t('feat3_d')
    },
    {
      id: 4,
      icon: <ShieldAlert className="w-8 h-8 text-amber-500" />,
      title: t('feat4_t'),
      description: t('feat4_d')
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-red-800 mb-4">{t('feat_title')}</h2>
          <p className="text-lg text-gray-600">{t('feat_desc')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature) => (
            <div key={feature.id} className="bg-[#FAF8F5] border border-amber-100 p-8 rounded-3xl hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-amber-50">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Cultural Showcase Story */}
        <div className="mt-20 bg-red-800 rounded-3xl overflow-hidden relative shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M20 0L40 20L20 40L0 20L20 0Z" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#pattern)" />
            </svg>
          </div>
          
          <div className="relative z-10 p-8 md:p-12 text-center text-white max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-amber-300">{t('culture_title')}</h3>
            <p className="text-lg text-red-100 mb-4 leading-relaxed">
              {t('culture_desc1')}
            </p>
            <p className="text-md text-red-200 font-medium italic">
              {t('culture_desc2')}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

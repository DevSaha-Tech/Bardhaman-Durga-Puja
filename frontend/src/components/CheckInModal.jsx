import React, { useState, useEffect } from 'react';
import { CheckCircle, X, MapPin, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { safeStorage } from '@/utils/storage';

const FAST_TAGS = [
  { id: 'long_line', label: 'প্রচণ্ড ভিড়', labelEn: 'Long Line' },
  { id: 'general', label: 'মাঝারি ভিড়', labelEn: 'Medium Crowd' },
  { id: 'best_light', label: 'সেরা আলোকসজ্জা', labelEn: 'Best Light' },
  { id: 'great_idol', label: 'অসাধারণ প্রতিমা', labelEn: 'Great Idol' },
];

export default function CheckInModal({ pandal, onDismiss }) {
  const { lang, t } = useLanguage();
  const [checkingIn, setCheckingIn] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCheckIn = async () => {
    setCheckingIn(true);
    try {
      if (isSupabaseConfigured) {
        // Record check-in to Supabase
        await supabase.from('pandal_visits').insert([{ pandal_id: String(pandal.id) }]);
      }
      
      // Lock check-in for 2 hours in localStorage
      safeStorage.set(`last_checkin_${pandal.id}`, Date.now().toString());
      setSuccess(true);
      setTimeout(onDismiss, 2000);
    } catch (err) {
      console.error('Check-in failed:', err);
      onDismiss();
    }
  };

  const pName = lang === 'en' ? (pandal.name_en || pandal.name) : (pandal.name_bn || pandal.name);

  if (success) {
    return (
      <div className="absolute inset-0 z-[1000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-3xl p-6 flex flex-col items-center gap-3 animate-bounce shadow-2xl">
          <CheckCircle className="w-12 h-12 text-green-500" />
          <h3 className="text-xl font-bold text-gray-900">{t('checked_in') || 'চেক-ইন সফল!'}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-[1000] flex items-end justify-center p-4 pb-24 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2rem] p-6 shadow-2xl flex flex-col gap-4 animate-slide-up relative">
        <button onClick={onDismiss} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200">
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mt-2">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-3">
            <MapPin className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">
            আপনি কি {pName}-এ পৌঁছে গেছেন?
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            onClick={handleCheckIn}
            disabled={checkingIn}
            className="py-3 px-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-base transition-colors shadow-md shadow-green-600/20 disabled:opacity-50 flex items-center justify-center"
          >
            {checkingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : (lang === 'en' ? 'Yes, Reached' : 'হ্যাঁ, পৌঁছে গেছি')}
          </button>
          
          <button
            onClick={onDismiss}
            disabled={checkingIn}
            className="py-3 px-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-base transition-colors disabled:opacity-50"
          >
            {lang === 'en' ? 'Not Yet' : 'না, পৌঁছাইনি'}
          </button>
        </div>
      </div>
    </div>
  );
}

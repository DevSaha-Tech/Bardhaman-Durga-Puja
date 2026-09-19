"use client";

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import FeedbackModal from './FeedbackModal';

export default function FeedbackButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        aria-label={t('feedback_button_aria')}
        className="fixed right-3 md:right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-red-800 hover:bg-red-900 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-40"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      <FeedbackModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}

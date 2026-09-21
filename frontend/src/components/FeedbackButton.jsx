"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import FeedbackModal from './FeedbackModal';

export default function FeedbackButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFullyVisible, setIsFullyVisible] = useState(false);
  const { t } = useLanguage();
  const timerRef = useRef(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!isModalOpen && isFullyVisible) {
      timerRef.current = setTimeout(() => {
        setIsFullyVisible(false);
      }, 5000);
    }
  }, [isModalOpen, isFullyVisible]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isFullyVisible, isModalOpen, resetTimer]);

  useEffect(() => {
    const handleModalInteraction = () => {
      if (isModalOpen) resetTimer();
    };
    if (isModalOpen) {
      document.addEventListener('mousemove', handleModalInteraction);
      document.addEventListener('mousedown', handleModalInteraction);
      document.addEventListener('touchstart', handleModalInteraction);
    }
    return () => {
      document.removeEventListener('mousemove', handleModalInteraction);
      document.removeEventListener('mousedown', handleModalInteraction);
      document.removeEventListener('touchstart', handleModalInteraction);
    };
  }, [isModalOpen, resetTimer]);

  const handleClick = () => {
    resetTimer();
    if (!isFullyVisible) {
      setIsFullyVisible(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleMouseEnter = () => {
    resetTimer();
  };

  return (
    <>
      <button
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        aria-label={t('feedback_button_aria')}
        className={`fixed right-3 md:right-6 top-[calc(50%-80px)] -translate-y-1/2 w-12 h-12 bg-red-800 hover:bg-red-900 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl z-40 transition-transform duration-300 ease-out ${!isFullyVisible && !isModalOpen ? 'translate-x-[80%]' : 'translate-x-0'}`}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      <FeedbackModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setIsFullyVisible(false);
        }} 
      />
    </>
  );
}

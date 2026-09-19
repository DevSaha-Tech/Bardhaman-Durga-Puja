"use client";

import { useRef, useCallback, useState, useEffect } from 'react';

export function useVoice({ lang }) {
  const isVoiceMutedRef = useRef(false);
  const [isVoiceMuted, setIsVoiceMutedState] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const lastSpokenRef = useRef('');

  const setIsVoiceMuted = (val) => {
    setIsVoiceMutedState(val);
    isVoiceMutedRef.current = val;
    if (val && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };
  const langRef = useRef(lang);
  useEffect(() => { langRef.current = lang; }, [lang]);

  const speak = useCallback((text) => {
    if (isVoiceMutedRef.current || typeof window === 'undefined' || !window.speechSynthesis) return;
    
    if (lastSpokenRef.current === text) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (langRef.current === 'en') {
      utterance.lang = 'en-IN';
      utterance.rate = 0.9; 
      utterance.pitch = 1.0; 
    } else {
      utterance.lang = 'bn-IN';
      utterance.rate = 0.8; 
      utterance.pitch = 0.8; 
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    
    lastSpokenRef.current = text;
    
    setTimeout(() => {
      lastSpokenRef.current = '';
    }, 15000);
  }, []);

  return { speak, isVoiceMuted, setIsVoiceMuted, isSpeaking };
}

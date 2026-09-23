"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const languages = [
  { code: 'bn', label: 'বাংলা' },
  { code: 'bng', label: 'বাংলিশ' },
  { code: 'en', label: 'English' },
];

export default function LanguageSelector() {
  const { lang, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = languages.find((l) => l.code === lang) || languages[0];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (code) => {
    setLang(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button matching Website UI */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`flex items-center gap-1.5 bg-[#FFFEFA] border transition-all duration-200 text-[#1F1B16] text-xs md:text-sm font-semibold rounded-xl px-3 py-1.5 cursor-pointer shadow-xs focus:outline-none ${
          isOpen
            ? 'border-[#80132F] ring-2 ring-[#80132F]/15 shadow-sm'
            : 'border-[#E5DBC8] hover:border-[#80132F]/50 hover:bg-white'
        }`}
      >
        <span>{currentLang.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#6B6257] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#80132F]' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu Popup matching Website Theme */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-32 sm:w-36 bg-[#FFFEFA] border border-[#E5DBC8] rounded-xl shadow-lg shadow-black/8 py-1.5 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md"
        >
          {languages.map((item) => {
            const isSelected = item.code === lang;
            return (
              <button
                key={item.code}
                role="option"
                aria-selected={isSelected}
                type="button"
                onClick={() => handleSelect(item.code)}
                className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-[#FAF0E6] text-[#80132F] font-bold'
                    : 'text-[#1F1B16] font-medium hover:bg-[#FAF6EE] hover:text-[#80132F]'
                }`}
              >
                <span>{item.label}</span>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-[#80132F] stroke-[2.5]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

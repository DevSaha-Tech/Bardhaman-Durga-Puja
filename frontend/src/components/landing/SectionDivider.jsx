"use client";

import React from 'react';

export default function SectionDivider({ className = "my-3" }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <div className="w-10 sm:w-16 h-[1.5px] bg-[#E8D9C5]" />
      <svg className="w-5 h-5 text-[#C88A3C]" viewBox="0 0 24 24" fill="currentColor">
        {/* Elegant traditional Lotus/Padma Motif */}
        <path d="M12 4.2c-1.3 2.3-2.3 5-2.3 7.2 0 1.9 1 3.3 2.3 3.3s2.3-1.4 2.3-3.3c0-2.2-1-4.9-2.3-7.2z" />
        <path d="M8.8 8.2c-.9 1.6-1.8 3.8-1.8 5.4 0 1.6.8 2.7 2 2.7 1 0 1.8-.8 2.2-1.8-.6-1.2-1.1-2.7-1.4-4.2-.3-.7-.6-1.4-1-2.1z" />
        <path d="M15.2 8.2c-.4.7-.7 1.4-1 2.1-.3 1.5-.8 3-1.4 4.2.4 1 1.2 1.8 2.2 1.8 1.2 0 2-1.1 2-2.7 0-1.6-.9-3.8-1.8-5.4z" />
        <path d="M5.5 12.8c-.6.9-1 2-1 2.8 0 1.3.8 2.1 1.8 2.1 1.2 0 2.2-1 2.6-2.3-.8-.4-1.5-1-2.1-1.7-.5-.3-.9-.6-1.3-.9z" />
        <path d="M18.5 12.8c-.4.3-.8.6-1.3.9-.6.7-1.3 1.3-2.1 1.7.4 1.3 1.4 2.3 2.6 2.3 1 0 1.8-.8 1.8-2.1 0-.8-.4-1.9-1-2.8z" />
      </svg>
      <div className="w-10 sm:w-16 h-[1.5px] bg-[#E8D9C5]" />
    </div>
  );
}

"use client";

import React from 'react';
import Image from 'next/image';

export default function SectionCornerPatterns() {
  return (
    <>
      {/* Top-Right Mandala Corner Accent */}
      <div 
        className="absolute top-0 right-0 w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 pointer-events-none opacity-15 select-none z-0 overflow-hidden -translate-y-2 translate-x-2"
        aria-hidden="true"
      >
        <Image
          src="/pattern.png"
          alt=""
          fill
          priority
          className="object-contain object-top-right mix-blend-multiply"
          sizes="(max-width: 768px) 144px, 224px"
        />
      </div>

      {/* Bottom-Left Mandala Corner Accent */}
      <div 
        className="absolute bottom-0 left-0 w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 pointer-events-none opacity-15 select-none z-0 overflow-hidden translate-y-2 -translate-x-2"
        aria-hidden="true"
      >
        <Image
          src="/pattern.png"
          alt=""
          fill
          priority
          className="object-contain object-bottom-left rotate-180 mix-blend-multiply"
          sizes="(max-width: 768px) 144px, 224px"
        />
      </div>
    </>
  );
}

import React from 'react';

export const BlackCatLogo: React.FC<{ className?: string }> = ({ className = "h-16 w-16" }) => (
  <svg viewBox="0 0 200 200" className={`${className} drop-shadow-md transform hover:scale-105 transition-transform duration-300`}>
    {/* Black Head */}
    <circle cx="100" cy="110" r="70" fill="#1f2937" />
    
    {/* Ears */}
    <path d="M40 60 L30 10 L90 50 Z" fill="#1f2937" />
    <path d="M160 60 L170 10 L110 50 Z" fill="#1f2937" />
    
    {/* Inner Ears */}
    <path d="M45 55 L40 25 L80 50 Z" fill="#4b5563" />
    <path d="M155 55 L160 25 L120 50 Z" fill="#4b5563" />

    {/* Eyes */}
    <ellipse cx="70" cy="100" rx="18" ry="22" fill="#ffffff" />
    <ellipse cx="130" cy="100" rx="18" ry="22" fill="#ffffff" />
    
    {/* Pupils (Teal) */}
    <circle cx="70" cy="100" r="10" fill="#14b8a6" />
    <circle cx="130" cy="100" r="10" fill="#14b8a6" />
    
    {/* Eye Shine */}
    <circle cx="75" cy="95" r="4" fill="white" />
    <circle cx="135" cy="95" r="4" fill="white" />

    {/* Nose */}
    <path d="M94 125 L106 125 L100 132 Z" fill="#14b8a6" />

    {/* Whiskers */}
    <path d="M30 115 L50 120 M30 125 L50 125 M30 135 L50 130" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
    <path d="M170 115 L150 120 M170 125 L150 125 M170 135 L150 130" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
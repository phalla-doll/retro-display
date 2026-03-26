'use client';

import { useState, useEffect } from 'react';

const CHARACTERS = [
  ' ', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 
  '!', '@', '#', '$', '%', '&', '*', '(', ')', '-', '+', '=', ':', ';', "'", '"', ',', '.', '/', '?',
  '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '⬜'
];

export function Flap({ targetChar }: { targetChar: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Find target index, default to space if not found
  let targetIndex = CHARACTERS.indexOf(targetChar.toUpperCase());
  if (targetIndex === -1) {
    // Check if it's a color emoji that might have variation selectors
    const colorMatch = CHARACTERS.findIndex(c => c.startsWith(targetChar[0]));
    if (colorMatch !== -1) {
      targetIndex = colorMatch;
    } else {
      targetIndex = 0;
    }
  }

  useEffect(() => {
    if (currentIndex === targetIndex) return;

    // Randomize the flip speed slightly for a more mechanical feel
    // Real split flaps take a moment to cycle through
    const speed = 25 + Math.random() * 15;

    const timeout = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % CHARACTERS.length);
    }, speed);

    return () => clearTimeout(timeout);
  }, [currentIndex, targetIndex]);

  const char = CHARACTERS[currentIndex];
  
  const isColor = ['🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '⬜'].includes(char);
  
  let bgColor = '#111';
  let topBg = '#1a1a1a';
  let bottomBg = '#151515';
  let textColor = 'text-white';
  
  if (isColor) {
    switch(char) {
      case '🟥': bgColor = '#ef4444'; topBg = '#f87171'; bottomBg = '#dc2626'; break;
      case '🟧': bgColor = '#f97316'; topBg = '#fb923c'; bottomBg = '#ea580c'; break;
      case '🟨': bgColor = '#eab308'; topBg = '#facc15'; bottomBg = '#ca8a04'; break;
      case '🟩': bgColor = '#22c55e'; topBg = '#4ade80'; bottomBg = '#16a34a'; break;
      case '🟦': bgColor = '#3b82f6'; topBg = '#60a5fa'; bottomBg = '#2563eb'; break;
      case '🟪': bgColor = '#a855f7'; topBg = '#c084fc'; bottomBg = '#9333ea'; break;
      case '⬜': bgColor = '#f4f4f5'; topBg = '#ffffff'; bottomBg = '#e4e4e7'; textColor = 'text-black'; break;
    }
  }

  return (
    <div 
      className={`relative flex-1 aspect-[3/4] flex items-center justify-center text-[clamp(12px,2.5vw,48px)] font-bold font-sans rounded-[2px] sm:rounded-sm overflow-hidden border border-black/40 shadow-sm transition-colors duration-75 ${textColor}`}
      style={{ backgroundColor: bgColor }}
    >
      {/* Top half */}
      <div 
        className="absolute top-0 left-0 right-0 bottom-1/2 overflow-hidden flex items-end justify-center pb-[1%] transition-colors duration-75"
        style={{ backgroundColor: topBg }}
      >
        {!isColor && <span className="translate-y-[50%] leading-none">{char}</span>}
      </div>
      {/* Bottom half */}
      <div 
        className="absolute top-1/2 left-0 right-0 bottom-0 overflow-hidden flex items-start justify-center pt-[1%] transition-colors duration-75"
        style={{ backgroundColor: bottomBg }}
      >
        {!isColor && <span className="-translate-y-[50%] leading-none">{char}</span>}
      </div>
      {/* Center hinge */}
      <div className="absolute top-1/2 left-0 right-0 h-[1px] sm:h-[2px] bg-black/80 -translate-y-1/2 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.5)]"></div>
      
      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
      
      {/* Inner shadow for physical depth */}
      <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] pointer-events-none"></div>
    </div>
  );
}

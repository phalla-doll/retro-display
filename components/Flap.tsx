'use client';

import { useState, useEffect } from 'react';

const CHARACTERS = [
  ' ', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 
  '!', '@', '#', '$', '%', '&', '*', '(', ')', '-', '+', '=', ':', ';', "'", '"', ',', '.', '/', '?',
  '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '⬜'
];

function getColors(char: string) {
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
  return { bgColor, topBg, bottomBg, textColor, isColor };
}

function HalfPiece({ char, colors, position, isFlipping, speed }: any) {
  const isTop = position === 'top';
  
  let animationStyle: any = {};
  if (isFlipping === 'top') {
    animationStyle = {
      animation: `flipTopFull ${speed}ms linear forwards`,
      transformOrigin: 'bottom',
      transformStyle: 'preserve-3d',
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      zIndex: 10,
    };
  } else if (isFlipping === 'bottom') {
    animationStyle = {
      animation: `flipBottomFull ${speed}ms linear forwards`,
      transformOrigin: 'top',
      transformStyle: 'preserve-3d',
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      zIndex: 10,
    };
  }

  return (
    <div 
      className={`absolute left-0 right-0 overflow-hidden flex justify-center ${colors.textColor} ${
        isTop ? 'top-0 bottom-1/2 items-end pb-[1%]' : 'top-1/2 bottom-0 items-start pt-[1%]'
      }`}
      style={{ 
        backgroundColor: isTop ? colors.topBg : colors.bottomBg,
        ...animationStyle
      }}
    >
      {!colors.isColor && (
        <span className={`leading-none font-bold font-sans text-[52px] ${isTop ? 'translate-y-[50%]' : '-translate-y-[50%]'}`}>
          {char}
        </span>
      )}
    </div>
  );
}

export function Flap({ targetChar }: { targetChar: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [speed] = useState(() => 60 + Math.random() * 40); // 60-100ms per flap
  
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
    if (currentIndex === targetIndex) {
      setIsFlipping(false);
      return;
    }

    setIsFlipping(true);

    const timeout = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % CHARACTERS.length);
    }, speed);

    return () => clearTimeout(timeout);
  }, [currentIndex, targetIndex, speed]);

  const char = CHARACTERS[currentIndex];
  const nextChar = CHARACTERS[(currentIndex + 1) % CHARACTERS.length];
  
  const currentColors = getColors(char);
  const nextColors = getColors(nextChar);

  const staticTopChar = isFlipping ? nextChar : char;
  const staticTopColors = isFlipping ? nextColors : currentColors;

  return (
    <div 
      className="relative w-[72px] h-[96px] rounded-md overflow-hidden border border-black/40 shadow-sm shrink-0"
      style={{ backgroundColor: currentColors.bgColor, perspective: '800px' }}
    >
      {/* Static Top */}
      <HalfPiece char={staticTopChar} colors={staticTopColors} position="top" />
      
      {/* Static Bottom */}
      <HalfPiece char={char} colors={currentColors} position="bottom" />

      {/* Flipping Top (Current Char) */}
      {isFlipping && (
        <HalfPiece 
          key={`flip-top-${currentIndex}`}
          char={char} 
          colors={currentColors} 
          position="top" 
          isFlipping="top"
          speed={speed}
        />
      )}

      {/* Flipping Bottom (Next Char) */}
      {isFlipping && (
        <HalfPiece 
          key={`flip-bottom-${currentIndex}`}
          char={nextChar} 
          colors={nextColors} 
          position="bottom" 
          isFlipping="bottom"
          speed={speed}
        />
      )}

      {/* Center hinge */}
      <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-black/80 -translate-y-1/2 z-20 shadow-[0_1px_2px_rgba(0,0,0,0.5)]"></div>
      
      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-30"></div>
      
      {/* Inner shadow for physical depth */}
      <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] pointer-events-none z-30"></div>
    </div>
  );
}

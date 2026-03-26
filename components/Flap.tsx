'use client';

import { useState, useEffect } from 'react';
import { CHARACTERS, getFlapColors, findCharIndex, type FlapColors } from '@/lib/vestaboard';
import { soundEngine } from '@/lib/audio';

interface HalfPieceProps {
  char: string;
  colors: FlapColors;
  position: 'top' | 'bottom';
  isFlipping?: 'top' | 'bottom';
  speed?: number;
}

function HalfPiece({ char, colors, position, isFlipping, speed }: HalfPieceProps) {
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
  
  const targetIndex = findCharIndex(targetChar);

  useEffect(() => {
    if (currentIndex === targetIndex) {
      setIsFlipping(false);
      return;
    }

    setIsFlipping(true);

    const timeout = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % CHARACTERS.length);
      soundEngine?.playFlap();
    }, speed);

    return () => clearTimeout(timeout);
  }, [currentIndex, targetIndex, speed]);

  const char = CHARACTERS[currentIndex];
  const nextChar = CHARACTERS[(currentIndex + 1) % CHARACTERS.length];
  
  const currentColors = getFlapColors(char);
  const nextColors = getFlapColors(nextChar);

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

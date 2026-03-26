'use client';

import { useState, useEffect, useRef } from 'react';
import { Flap } from './Flap';

const ROWS = 6;
const COLS = 22;
const TOTAL_FLAPS = ROWS * COLS;

// The exact pixel dimensions of the board based on fixed flap sizes
// 22 cols * 72px + 21 gaps * 8px + 2 padding * 24px + 2 border * 8px = 1816px
const BOARD_WIDTH = 1816;
// 6 rows * 96px + 5 gaps * 8px + 2 padding * 24px + 2 border * 8px = 680px
const BOARD_HEIGHT = 680;

export type BoardTheme = 'dark-grey' | 'wood' | 'metal';

const THEMES = {
  'dark-grey': {
    bg: 'bg-[#161616]',
    border: 'border-t-[#2a2a2a] border-x-[#1a1a1a] border-b-[#0a0a0a]',
    texture: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
    opacity: 'opacity-[0.15]'
  },
  'wood': {
    bg: 'bg-[#2a1610]',
    border: 'border-t-[#3d231a] border-x-[#20100b] border-b-[#100704]',
    texture: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
    opacity: 'opacity-[0.25]'
  },
  'metal': {
    bg: 'bg-[#4a4c50]',
    border: 'border-t-[#6b6d72] border-x-[#3f4145] border-b-[#252629]',
    texture: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 4px), url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
    opacity: 'opacity-[0.35]'
  }
};

export function Vestaboard({ message, theme = 'dark-grey' }: { message: string, theme?: BoardTheme }) {
  // Pad or truncate message to exactly TOTAL_FLAPS
  // We need to handle emojis correctly, so we use Array.from to count characters properly
  const chars = Array.from(message);
  const paddedChars = [...chars];
  
  while (paddedChars.length < TOTAL_FLAPS) {
    paddedChars.push(' ');
  }
  
  const finalChars = paddedChars.slice(0, TOTAL_FLAPS);
  
  // Create a 2D array for rows and cols
  const grid = [];
  for (let r = 0; r < ROWS; r++) {
    const row = [];
    for (let c = 0; c < COLS; c++) {
      row.push(finalChars[r * COLS + c]);
    }
    grid.push(row);
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (!entries[0]) return;
      const { width, height } = entries[0].contentRect;
      
      const targetRatio = BOARD_WIDTH / BOARD_HEIGHT;
      const containerRatio = width / height;
      
      let newScale = 1;
      if (containerRatio > targetRatio) {
        // Container is wider than needed, constrain by height
        newScale = height / BOARD_HEIGHT;
      } else {
        // Container is taller than needed, constrain by width
        newScale = width / BOARD_WIDTH;
      }
      
      setScale(newScale);
      setIsReady(true);
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const currentTheme = THEMES[theme];

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center">
      <div 
        style={{ 
          width: BOARD_WIDTH, 
          height: BOARD_HEIGHT, 
          transform: `scale(${scale})`,
          opacity: isReady ? 1 : 0,
          transition: 'opacity 0.3s ease, background-color 0.5s ease, border-color 0.5s ease'
        }}
        className={`${currentTheme.bg} p-6 rounded-[2rem] border-[8px] ${currentTheme.border} shadow-[0_40px_80px_rgba(0,0,0,0.95),0_0_0_2px_rgba(0,0,0,1)] relative flex flex-col gap-2 origin-center shrink-0 transition-colors duration-500`}
      >
        {/* Hardware Texture Overlay (covers the entire board including border) */}
        <div 
          className={`absolute -inset-[8px] rounded-[2rem] ${currentTheme.opacity} pointer-events-none mix-blend-overlay transition-opacity duration-500`} 
          style={{ backgroundImage: currentTheme.texture }}
        ></div>
        
        {/* Outer Bezel Highlight (Rim light on the border) */}
        <div className="absolute -inset-[8px] rounded-[2rem] border border-white/10 pointer-events-none"></div>
        
        {/* Inner Cavity (The recessed area where flaps sit) */}
        <div className="absolute inset-0 rounded-[1.25rem] bg-[#050505] shadow-[inset_0_15px_40px_rgba(0,0,0,0.9),inset_0_2px_5px_rgba(0,0,0,0.8)] pointer-events-none"></div>
        
        {/* Inner Bezel Highlight (Edge of the cavity) */}
        <div className="absolute inset-0 rounded-[1.25rem] border border-black/90 pointer-events-none"></div>
        <div className="absolute inset-[1px] rounded-[1.15rem] border border-white/5 pointer-events-none"></div>
        
        {/* Flaps Grid */}
        <div className="relative z-10 flex flex-col gap-2">
          {grid.map((row, rIndex) => (
            <div key={rIndex} className="flex gap-2">
              {row.map((char, cIndex) => (
                <Flap key={`${rIndex}-${cIndex}`} targetChar={char} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

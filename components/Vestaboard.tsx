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

export function Vestaboard({ message }: { message: string }) {
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

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center">
      <div 
        style={{ 
          width: BOARD_WIDTH, 
          height: BOARD_HEIGHT, 
          transform: `scale(${scale})`,
          opacity: isReady ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}
        className="bg-[#050505] p-6 rounded-2xl border-[8px] border-[#111] shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative flex flex-col gap-2 origin-center shrink-0"
      >
        {/* Inner bezel */}
        <div className="absolute inset-0 border border-white/5 rounded-xl pointer-events-none"></div>
        
        {grid.map((row, rIndex) => (
          <div key={rIndex} className="flex gap-2">
            {row.map((char, cIndex) => (
              <Flap key={`${rIndex}-${cIndex}`} targetChar={char} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

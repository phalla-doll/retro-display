'use client';

import { Flap } from './Flap';

const ROWS = 6;
const COLS = 22;
const TOTAL_FLAPS = ROWS * COLS;

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

  return (
    <div className="w-full max-w-[1800px] mx-auto bg-[#050505] p-2 sm:p-4 md:p-6 lg:p-8 rounded-xl sm:rounded-2xl border-[4px] sm:border-[8px] border-[#111] shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative">
      {/* Inner bezel */}
      <div className="absolute inset-0 border border-white/5 rounded-lg sm:rounded-xl pointer-events-none"></div>
      
      <div className="flex flex-col gap-1 sm:gap-1.5 md:gap-2">
        {grid.map((row, rIndex) => (
          <div key={rIndex} className="flex gap-1 sm:gap-1.5 md:gap-2">
            {row.map((char, cIndex) => (
              <Flap key={`${rIndex}-${cIndex}`} targetChar={char} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

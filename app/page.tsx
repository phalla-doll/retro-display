'use client';

import { useState, useEffect, useRef } from 'react';
import { Vestaboard } from '@/components/Vestaboard';

const COLORS = [
  { emoji: '🟥', name: 'Red' },
  { emoji: '🟧', name: 'Orange' },
  { emoji: '🟨', name: 'Yellow' },
  { emoji: '🟩', name: 'Green' },
  { emoji: '🟦', name: 'Blue' },
  { emoji: '🟪', name: 'Purple' },
  { emoji: '⬜', name: 'White' },
];

function formatMessage(input: string): string {
  const lines = input.split('\n');
  let formattedChars: string[] = [];
  let currentRow = 0;

  for (let i = 0; i < lines.length; i++) {
    if (currentRow >= 6) break;
    
    let lineChars = Array.from(lines[i]);
    
    if (lineChars.length === 0) {
      for (let j = 0; j < 22; j++) formattedChars.push(' ');
      currentRow++;
      continue;
    }

    while (lineChars.length > 0 && currentRow < 6) {
      const chunk = lineChars.slice(0, 22);
      formattedChars.push(...chunk);
      
      // Pad the rest of the line
      for (let j = chunk.length; j < 22; j++) {
        formattedChars.push(' ');
      }
      
      lineChars = lineChars.slice(22);
      currentRow++;
    }
  }

  // Pad the rest of the board if needed
  while (formattedChars.length < 132) {
    formattedChars.push(' ');
  }

  return formattedChars.slice(0, 132).join('');
}

export default function Home() {
  const [message, setMessage] = useState(formatMessage("HELLO WORLD\n\nWELCOME TO THE\nRETRO SPLIT FLAP\nDISPLAY!\n\nTYPE BELOW..."));
  const [inputValue, setInputValue] = useState("");
  const [showControls, setShowControls] = useState(true);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-hide controls after inactivity
  useEffect(() => {
    const resetHideTimeout = () => {
      setShowControls(true);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
      hideTimeout.current = setTimeout(() => {
        // Only hide if not focused on textarea
        if (document.activeElement !== textareaRef.current) {
          setShowControls(false);
        }
      }, 4000);
    };

    window.addEventListener('mousemove', resetHideTimeout);
    window.addEventListener('keydown', resetHideTimeout);
    window.addEventListener('touchstart', resetHideTimeout);

    resetHideTimeout();

    return () => {
      window.removeEventListener('mousemove', resetHideTimeout);
      window.removeEventListener('keydown', resetHideTimeout);
      window.removeEventListener('touchstart', resetHideTimeout);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() || inputValue.includes('\n') || COLORS.some(c => inputValue.includes(c.emoji))) {
      setMessage(formatMessage(inputValue.toUpperCase()));
      setInputValue("");
      textareaRef.current?.blur();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e as any);
    }
  };

  const insertColor = (emoji: string) => {
    setInputValue(prev => prev + emoji);
    textareaRef.current?.focus();
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-2 sm:p-4 md:p-8 overflow-hidden relative">
      <div className="w-full max-w-[1800px] flex-1 flex flex-col justify-center">
        <Vestaboard message={message} />
      </div>

      {/* Controls Overlay */}
      <div 
        className={`absolute bottom-0 left-0 right-0 p-4 sm:p-8 bg-gradient-to-t from-black via-black/90 to-transparent transition-opacity duration-700 flex justify-center ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <form onSubmit={handleSubmit} className="w-full max-w-4xl flex flex-col gap-4 bg-zinc-900/95 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-zinc-800 shadow-2xl pointer-events-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message... (Cmd/Ctrl + Enter to send)"
                className="w-full bg-black/50 text-white px-4 py-3 rounded-xl border border-zinc-700 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 text-base sm:text-lg font-mono uppercase resize-none h-28 sm:h-32"
              />
              <div className="absolute bottom-3 right-3 text-xs text-zinc-500 font-mono bg-black/50 px-2 py-1 rounded">
                {Array.from(inputValue).length}/132
              </div>
            </div>
            <div className="flex flex-col gap-2 justify-end">
              <button 
                type="submit"
                className="bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-zinc-200 transition-colors uppercase tracking-wider h-14 sm:h-auto shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              >
                Update Board
              </button>
              <p className="text-xs text-zinc-500 text-center hidden sm:block">
                Supports 6 lines<br/>22 chars per line
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/50 overflow-x-auto pb-1">
            <span className="text-xs text-zinc-500 uppercase tracking-wider font-bold mr-2 whitespace-nowrap">Colors:</span>
            {COLORS.map(c => (
              <button
                key={c.name}
                type="button"
                onClick={() => insertColor(c.emoji)}
                className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-md flex items-center justify-center hover:scale-110 transition-transform bg-black/30 border border-zinc-700/50 text-lg sm:text-xl"
                title={c.name}
              >
                {c.emoji}
              </button>
            ))}
          </div>
        </form>
      </div>
    </main>
  );
}

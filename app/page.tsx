'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';
import { Vestaboard, type BoardTheme, type BackgroundTheme } from '@/components/Vestaboard';
import { soundEngine } from '@/lib/audio';

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

const FONTS = [
  { name: 'Inter', class: 'font-[family-name:var(--font-inter)]' },
  { name: 'Geist Mono', class: 'font-[family-name:var(--font-geist-mono)]' },
  { name: 'Space Mono', class: 'font-[family-name:var(--font-space-mono)]' },
];

export default function Home() {
  const [message, setMessage] = useState(formatMessage("HELLO WORLD\n\nWELCOME TO THE\nRETRO SPLIT FLAP\nDISPLAY!\n\nTYPE BELOW..."));
  const [inputValue, setInputValue] = useState("");
  const [showControls, setShowControls] = useState(true);
  const [boardTheme, setBoardTheme] = useState<BoardTheme>('dark-grey');
  const [backgroundTheme, setBackgroundTheme] = useState<BackgroundTheme>('dark-grey');
  const [fontClass, setFontClass] = useState(FONTS[0].class);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    soundEngine?.setEnabled(newState);
  };

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
    <main className="min-h-screen bg-[#0a0a0a] overflow-hidden relative">
      <div className="absolute inset-0 p-2 sm:p-4 md:p-8 flex items-center justify-center">
        <Vestaboard message={message} theme={boardTheme} backgroundTheme={backgroundTheme} fontClass={fontClass} />
      </div>

      {/* Controls Overlay */}
      <motion.div 
        initial={false}
        animate={{ 
          opacity: showControls ? 1 : 0,
          y: showControls ? 0 : 20,
          pointerEvents: showControls ? 'auto' : 'none'
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 bg-gradient-to-t from-black via-black/90 to-transparent flex justify-center"
      >
        <form onSubmit={handleSubmit} className="w-full max-w-4xl flex flex-col gap-4 bg-zinc-900/90 backdrop-blur-xl p-5 sm:p-6 rounded-2xl border border-zinc-800 shadow-2xl pointer-events-auto">
          <div className="flex flex-col gap-2">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={132}
                placeholder="Type a message... (Cmd/Ctrl + Enter to send)"
                className="w-full bg-black/40 text-white px-4 py-3 sm:px-5 sm:py-4 rounded-xl border border-zinc-700/50 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 text-base sm:text-lg font-mono uppercase resize-none h-28 sm:h-32 transition-colors"
              />
            </div>
            
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-3">
                <p className="text-xs text-zinc-500 font-medium hidden sm:block">
                  Supports 6 lines • 22 chars per line
                </p>
                <div className="flex items-center gap-2 sm:border-l sm:border-zinc-700 sm:pl-3">
                  <span className="text-xs text-zinc-500 font-medium">Frame:</span>
                  <div className="flex gap-1.5">
                    <button 
                      type="button"
                      onClick={() => setBoardTheme('dark-grey')} 
                      className={`w-5 h-5 rounded-full bg-[#161616] border-2 transition-colors ${boardTheme === 'dark-grey' ? 'border-white' : 'border-zinc-700 hover:border-zinc-500'}`} 
                      title="Dark Grey"
                    />
                    <button 
                      type="button"
                      onClick={() => setBoardTheme('wood')} 
                      className={`w-5 h-5 rounded-full bg-[#2a1610] border-2 transition-colors ${boardTheme === 'wood' ? 'border-white' : 'border-zinc-700 hover:border-zinc-500'}`} 
                      title="Dark Wood"
                    />
                    <button 
                      type="button"
                      onClick={() => setBoardTheme('metal')} 
                      className={`w-5 h-5 rounded-full bg-[#4a4c50] border-2 transition-colors ${boardTheme === 'metal' ? 'border-white' : 'border-zinc-700 hover:border-zinc-500'}`} 
                      title="Brushed Metal"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 border-l border-zinc-700 pl-3">
                  <span className="text-xs text-zinc-500 font-medium">Background:</span>
                  <div className="flex gap-1.5">
                    <button 
                      type="button"
                      onClick={() => setBackgroundTheme('dark-grey')} 
                      className={`w-5 h-5 rounded-full bg-[#050505] border-2 transition-colors ${backgroundTheme === 'dark-grey' ? 'border-white' : 'border-zinc-700 hover:border-zinc-500'}`} 
                      title="Dark Grey"
                    />
                    <button 
                      type="button"
                      onClick={() => setBackgroundTheme('wood')} 
                      className={`w-5 h-5 rounded-full bg-[#1a0b05] border-2 transition-colors ${backgroundTheme === 'wood' ? 'border-white' : 'border-zinc-700 hover:border-zinc-500'}`} 
                      title="Dark Wood"
                    />
                    <button 
                      type="button"
                      onClick={() => setBackgroundTheme('metal')} 
                      className={`w-5 h-5 rounded-full bg-[#1a1c20] border-2 transition-colors ${backgroundTheme === 'metal' ? 'border-white' : 'border-zinc-700 hover:border-zinc-500'}`} 
                      title="Brushed Metal"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 border-l border-zinc-700 pl-3">
                  <button 
                    type="button"
                    onClick={toggleSound}
                    className={`p-1 rounded-md transition-colors ${soundEnabled ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                    title={soundEnabled ? "Mute Sound" : "Enable Sound"}
                  >
                    {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  </button>
                </div>
                <div className="flex items-center gap-2 border-l border-zinc-700 pl-3">
                  <span className="text-xs text-zinc-500 font-medium">Font:</span>
                  <select 
                    value={fontClass}
                    onChange={(e) => setFontClass(e.target.value)}
                    className="bg-[#161616] text-white text-xs px-3 py-1.5 rounded-md border border-zinc-700/50 hover:border-zinc-500 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-500 transition-colors cursor-pointer shadow-sm"
                  >
                    {FONTS.map(font => (
                      <option key={font.name} value={font.class} className="bg-zinc-900 py-1">{font.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={`text-xs font-mono bg-black/30 px-2 py-1 rounded-md transition-colors ${
                Array.from(inputValue).length >= 132 ? 'text-red-400 font-bold' : 
                Array.from(inputValue).length >= 110 ? 'text-yellow-400' : 
                'text-zinc-500'
              }`}>
                {Array.from(inputValue).length}/132
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-zinc-800/50">
            <div className="flex items-center gap-2 overflow-x-auto overflow-y-hidden no-scrollbar py-2 -my-2 w-full sm:w-auto">
              <span className="text-xs text-zinc-500 uppercase tracking-wider font-bold mr-2 whitespace-nowrap pl-1">Colors:</span>
              <div className="flex gap-1.5 px-1">
                {COLORS.map(c => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => insertColor(c.emoji)}
                    className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-lg flex items-center justify-center hover:scale-110 transition-transform bg-black/40 border border-zinc-700/50 text-lg sm:text-xl shadow-sm"
                    title={c.name}
                  >
                    {c.emoji}
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit"
              className="w-full sm:w-auto bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-colors uppercase tracking-wider text-sm shadow-[0_0_15px_rgba(255,255,255,0.1)] shrink-0"
            >
              Update Board
            </button>
          </div>
        </form>
      </motion.div>
    </main>
  );
}

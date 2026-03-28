'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
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
  { name: 'Inter Regular', class: 'font-[family-name:var(--font-inter)] font-normal' },
  { name: 'Inter Bold', class: 'font-[family-name:var(--font-inter)] font-bold' },
  { name: 'Geist Mono Regular', class: 'font-[family-name:var(--font-geist-mono)] font-normal' },
  { name: 'Geist Mono Bold', class: 'font-[family-name:var(--font-geist-mono)] font-bold' },
  { name: 'Space Mono Regular', class: 'font-[family-name:var(--font-space-mono)] font-normal' },
  { name: 'Space Mono Bold', class: 'font-[family-name:var(--font-space-mono)] font-bold' },
];

export default function Home() {
  const [message, setMessage] = useState(formatMessage("HELLO WORLD\n\nWELCOME TO THE\nRETRO SPLIT FLAP\nDISPLAY!\n\nTYPE BELOW..."));
  const [inputValue, setInputValue] = useState("");
  const [showControls, setShowControls] = useState(true);
  const [boardTheme, setBoardTheme] = useState<BoardTheme>('dark-grey');
  const [backgroundTheme, setBackgroundTheme] = useState<BackgroundTheme>('dark-grey');
  const [fontClass, setFontClass] = useState(FONTS[1].class); // Default to Inter Bold
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [animatedBackground, setAnimatedBackground] = useState(true);
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
        <Vestaboard message={message} theme={boardTheme} backgroundTheme={backgroundTheme} fontClass={fontClass} animatedBackground={animatedBackground} />
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
        className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 flex justify-center"
      >
        <form onSubmit={handleSubmit} className="w-full max-w-3xl flex flex-col gap-3 bg-zinc-950/80 backdrop-blur-md p-4 rounded-2xl border border-zinc-800/60 shadow-2xl pointer-events-auto">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={132}
              placeholder="Type a message... (Cmd/Ctrl + Enter to send)"
              className="w-full bg-transparent text-white px-3 py-2 rounded-xl border border-transparent focus:outline-none focus:border-zinc-700/50 focus:bg-zinc-900/50 text-sm sm:text-base font-mono uppercase resize-none h-20 sm:h-24 transition-all placeholder:text-zinc-600"
            />
            <div className={`absolute bottom-2 right-3 text-[10px] font-mono transition-colors ${
              Array.from(inputValue).length >= 132 ? 'text-red-400 font-bold' : 
              Array.from(inputValue).length >= 110 ? 'text-yellow-400' : 
              'text-zinc-600'
            }`}>
              {Array.from(inputValue).length}/132
            </div>
          </div>
          
          {/* Colors Row */}
          <div className="flex items-center gap-3 pt-2 border-t border-zinc-800/40">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Colors</span>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {COLORS.map(c => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => insertColor(c.emoji)}
                  className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded flex items-center justify-center hover:scale-110 transition-transform bg-zinc-800/50 border border-zinc-700/30 text-sm sm:text-base"
                  title={c.name}
                >
                  {c.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-zinc-800/40">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {/* Theme Controls */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Frame</span>
                <div className="flex gap-1">
                  <button type="button" onClick={() => setBoardTheme('dark-grey')} className={`w-4 h-4 rounded-full bg-[#161616] border transition-colors ${boardTheme === 'dark-grey' ? 'border-zinc-400' : 'border-zinc-700 hover:border-zinc-500'}`} title="Dark Grey" />
                  <button type="button" onClick={() => setBoardTheme('wood')} className={`w-4 h-4 rounded-full bg-[#2a1610] border transition-colors ${boardTheme === 'wood' ? 'border-zinc-400' : 'border-zinc-700 hover:border-zinc-500'}`} title="Dark Wood" />
                  <button type="button" onClick={() => setBoardTheme('metal')} className={`w-4 h-4 rounded-full bg-[#4a4c50] border transition-colors ${boardTheme === 'metal' ? 'border-zinc-400' : 'border-zinc-700 hover:border-zinc-500'}`} title="Brushed Metal" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">BG</span>
                <div className="flex gap-1">
                  <button type="button" onClick={() => setBackgroundTheme('dark-grey')} className={`w-4 h-4 rounded-full bg-[#050505] border transition-colors ${backgroundTheme === 'dark-grey' ? 'border-zinc-400' : 'border-zinc-700 hover:border-zinc-500'}`} title="Dark Grey" />
                  <button type="button" onClick={() => setBackgroundTheme('wood')} className={`w-4 h-4 rounded-full bg-[#1a0b05] border transition-colors ${backgroundTheme === 'wood' ? 'border-zinc-400' : 'border-zinc-700 hover:border-zinc-500'}`} title="Dark Wood" />
                  <button type="button" onClick={() => setBackgroundTheme('metal')} className={`w-4 h-4 rounded-full bg-[#1a1c20] border transition-colors ${backgroundTheme === 'metal' ? 'border-zinc-400' : 'border-zinc-700 hover:border-zinc-500'}`} title="Brushed Metal" />
                </div>
              </div>

              {/* Font Selector */}
              <div className="flex items-center gap-2">
                <select 
                  value={fontClass}
                  onChange={(e) => setFontClass(e.target.value)}
                  className="bg-transparent text-zinc-300 text-[11px] py-1 rounded-md border-none focus:outline-none focus:ring-0 cursor-pointer hover:text-white transition-colors"
                >
                  {FONTS.map(font => (
                    <option key={font.name} value={font.class} className="bg-zinc-900">{font.name}</option>
                  ))}
                </select>
              </div>

              {/* Sound Toggle */}
              <button 
                type="button"
                onClick={toggleSound}
                className={`p-1 rounded-md transition-colors ${soundEnabled ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
                title={soundEnabled ? "Mute Sound" : "Enable Sound"}
              >
                {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              </button>

              {/* Animation Toggle */}
              <button 
                type="button"
                onClick={() => setAnimatedBackground(!animatedBackground)}
                className={`p-1 rounded-md transition-colors ${animatedBackground ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
                title={animatedBackground ? "Disable Animated Background" : "Enable Animated Background"}
              >
                <Sparkles size={14} />
              </button>
            </div>

            <div className="flex items-center justify-end w-full sm:w-auto mt-2 sm:mt-0">
              {/* Submit Button */}
              <button 
                type="submit"
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-1.5 rounded-lg text-xs font-medium transition-colors tracking-wide shrink-0 border border-white/5 w-full sm:w-auto"
              >
                Update Board
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </main>
  );
}

export const CHARACTERS = [
  ' ', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 
  '!', '@', '#', '$', '%', '&', '*', '(', ')', '-', '+', '=', ':', ';', "'", '"', ',', '.', '/', '?',
  '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '⬜'
];

export interface FlapColors {
  bgColor: string;
  topBg: string;
  bottomBg: string;
  textColor: string;
  isColor: boolean;
}

export function getFlapColors(char: string): FlapColors {
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

export function findCharIndex(targetChar: string): number {
  let targetIndex = CHARACTERS.indexOf(targetChar.toUpperCase());
  
  if (targetIndex === -1) {
    // Check if it's a color emoji that might have variation selectors
    const colorMatch = CHARACTERS.findIndex(c => c.startsWith(targetChar[0]));
    if (colorMatch !== -1) {
      targetIndex = colorMatch;
    } else {
      targetIndex = 0; // Default to space
    }
  }
  
  return targetIndex;
}

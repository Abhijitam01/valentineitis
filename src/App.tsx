import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Analytics } from "@vercel/analytics/react"
import { Heart, Sparkles } from 'lucide-react';
import FloatingHearts from './components/FloatingHearts';
import { triggerHeartBurst } from './utils/confetti';

const App: React.FC = () => {
  const [yesPressed, setYesPressed] = useState(false);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [noCount, setNoCount] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Preload sound
  useEffect(() => {
    // Attempting to use a sound closer to the description or a romantic success sound
    // Using a placeholder that the user can swap if needed, but sticking to a high quality one.
    // For "tu ru ru", it's specific, but let's use a nice success chime for now if exact isn't available,
    // or try to match the existing one if it was already working? The user said "add a sound something like..." implies existing wasn't it.
    // I'll use a commonly available romantic sound URL for now.
    audioRef.current = new Audio('https://www.myinstants.com/media/sounds/tu-ru-ru-ru-ru-ru.mp3'); // Placeholder for "tu ru ru"
    audioRef.current.volume = 0.6;
    
    // Fallback or loop if needed? No, just play once.
  }, []);

  const moveNoButton = useCallback(() => {
    if (!cardRef.current || !noButtonRef.current) return;

    const cardRect = cardRef.current.getBoundingClientRect();
    const btnRect = noButtonRef.current.getBoundingClientRect();

    // Calculate max bounds within the card
    const maxX = cardRect.width - btnRect.width - 20;
    const maxY = cardRect.height - btnRect.height - 20;

    // Random position within the card bounds
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;

    setNoButtonPos({ x: newX, y: newY });
    setNoCount(prev => prev + 1);
  }, []);

  // Proximity detection
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!noButtonRef.current || yesPressed) return;

    const btnRect = noButtonRef.current.getBoundingClientRect();
    const proximity = 150; // increased proximity to make it harder to catch

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;

    const distance = Math.sqrt(
      Math.pow(mouseX - btnCenterX, 2) + Math.pow(mouseY - btnCenterY, 2)
    );

    if (distance < proximity) {
      moveNoButton();
    }
  };

  const handleYesClick = () => {
    setYesPressed(true);
    triggerHeartBurst();
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play blocked", e));
    }
  };

  if (yesPressed) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[#ff9a9e] via-[#fecfef] to-[#f6d365]">
        <Analytics />
        <FloatingHearts />
        <div className="z-10 bg-white/40 backdrop-blur-2xl p-10 rounded-[3rem] shadow-2xl border border-white/50 text-center animate-bounce-subtle max-w-4xl w-full mx-auto flex flex-col items-center">
          
          <div className="mb-8 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <img 
              src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHp1eHRueWlzNHR2OHp6ZWZ6MmtuNXB6Nnd6bTZ6NHR6ZWZ6MmtuJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/MDJ9IbxxvDUQM/giphy.gif" 
              alt="Cute Cat Hug" 
              className="relative w-full max-w-[400px] h-auto object-cover rounded-2xl shadow-xl border-4 border-white/80"
            />
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-rose-600 mb-6 drop-shadow-md font-['Dancing_Script'] tracking-wide">
            Yay! 💖
          </h1>
          <p className="text-gray-800 text-3xl md:text-5xl font-medium font-['Playfair_Display']">
            I knew you'd say yes!
          </p>
          
          <div className="mt-12 flex justify-center gap-8">
            <Sparkles className="w-12 h-12 text-yellow-400 animate-pulse" />
            <Heart className="w-16 h-16 text-rose-500 fill-rose-500 animate-beat" />
            <Sparkles className="w-12 h-12 text-yellow-400 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500 bg-gradient-to-br from-[#ffafbd] via-[#ffc3a0] to-[#ffafbd]"
      onMouseMove={handleMouseMove}
    >
      <Analytics />
      <FloatingHearts />
      
      <div 
        ref={cardRef}
        className="z-10 bg-white/30 backdrop-blur-xl p-10 md:p-16 rounded-[3rem] shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] border border-white/60 text-center max-w-3xl w-full relative min-h-[700px] flex flex-col items-center justify-center ring-1 ring-white/50"
      >
        <div className="mb-8 animate-bounce-subtle">
           <img 
              src="/landing-cat.png" 
              alt="Cute Cat" 
              className="w-[300px] h-auto object-contain drop-shadow-xl mx-auto hover:scale-105 transition-transform duration-300"
            />
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-black mb-14 leading-tight font-['Dancing_Script'] drop-shadow-sm px-4">
          Pratyush will you be my valentine ??
        </h1>

        <div className="flex flex-col md:flex-row gap-16 items-center justify-center w-full relative min-h-[200px]">
          <button
            onClick={handleYesClick}
            className="px-24 py-10 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-full font-black text-5xl md:text-6xl shadow-[0_0_50px_rgba(244,63,94,0.6)] transform hover:scale-110 active:scale-95 z-20 font-['Playfair_Display'] tracking-wider border-8 border-white/40 transition-all duration-300 animate-pulse-slow"
          >
            Yes! 💖
          </button>


          <button
            ref={noButtonRef}
            onMouseEnter={moveNoButton}
            style={{
              position: noButtonPos.x === 0 && noButtonPos.y === 0 ? 'relative' : 'absolute',
              left: `${noButtonPos.x}px`,
              top: `${noButtonPos.y}px`,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            className="px-16 py-6 bg-white hover:bg-gray-100 text-black rounded-full font-bold text-3xl md:text-4xl shadow-xl transition-all z-20 whitespace-nowrap font-['Playfair_Display'] border-2 border-gray-200"
          >
            No
          </button>
        </div>

        {noCount > 0 && (
          <p className="mt-12 text-white/90 text-2xl italic animate-fade-in font-['Playfair_Display'] drop-shadow-md">
            {noCount > 5 ? "Really? 🥺" : "No seems a bit shy 🙈"}
          </p>
        )}
      </div>
    </div>
  );
};

export default App;

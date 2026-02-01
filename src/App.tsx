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
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'); // Pop sound
    audioRef.current.volume = 0.5;
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
    const proximity = 100; // pixels

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
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[#ff758c] via-[#ff7eb3] to-[#ffa6c1]">
        <Analytics />
        <FloatingHearts />
        <div className="z-10 bg-white/30 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border border-white/40 text-center animate-bounce-subtle max-w-6xl w-full mx-auto flex flex-col items-center">
          
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center mb-10 w-full flex-wrap">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full max-w-[280px] h-[280px] object-cover rounded-2xl shadow-xl border-4 border-white/50"
            >
              <source src="/gif-valentine.mp4" type="video/mp4" />
            </video>
            
            <img 
              src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHp1eHRueWlzNHR2OHp6ZWZ6MmtuNXB6Nnd6bTZ6NHR6ZWZ6MmtuJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/MDJ9IbxxvDUQM/giphy.gif" 
              alt="Cute Cat Hug" 
              className="w-full max-w-[280px] h-[280px] object-cover rounded-2xl shadow-xl border-4 border-white/50"
            />

            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full max-w-[280px] h-[280px] object-cover rounded-2xl shadow-xl border-4 border-white/50"
            >
              <source src="/gif-valentine-2.mp4" type="video/mp4" />
            </video>
          </div>

          <h1 className="text-5xl md:text-8xl font-bold text-white mb-6 drop-shadow-md font-['Dancing_Script']">
            Yay! 💖
          </h1>
          <p className="text-white text-2xl md:text-4xl font-medium font-['Playfair_Display']">
            I knew you'd say yes!
          </p>
          
          <div className="mt-10 flex justify-center gap-6">
            <Sparkles className="w-10 h-10 text-yellow-300 animate-pulse" />
            <Heart className="w-12 h-12 text-red-500 fill-red-500 animate-ping" />
            <Sparkles className="w-10 h-10 text-yellow-300 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500 bg-gradient-to-br from-[#ff9a9e] via-[#fad0c4] to-[#fad0c4]"
      onMouseMove={handleMouseMove}
    >
      <Analytics />
      <FloatingHearts />
      
      <div 
        ref={cardRef}
        className="z-10 bg-white/30 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-white/60 text-center max-w-2xl w-full relative min-h-[600px] flex flex-col items-center justify-center"
      >
        <div className="mb-10 animate-bounce">
          <Heart className="w-28 h-28 text-red-500 fill-red-500 drop-shadow-xl" />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-12 leading-tight font-['Dancing_Script'] drop-shadow-sm">
          Pratyush will you be my valentine ??
        </h1>

        <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full relative min-h-[150px]">
          <button
            onClick={handleYesClick}
            className="px-16 py-6 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-black rounded-full font-bold text-3xl md:text-4xl shadow-2xl hover:shadow-pink-300/50 transition-all duration-300 transform hover:scale-110 active:scale-95 z-20 font-['Playfair_Display'] tracking-wide"
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
              transition: 'all 0.2s ease-out',
            }}
            className="px-16 py-6 bg-white/80 hover:bg-white text-black rounded-full font-bold text-3xl md:text-4xl border-2 border-white shadow-xl transition-all z-20 whitespace-nowrap font-['Playfair_Display'] backdrop-blur-sm"
          >
            No {noCount > 0 && <span className="text-lg ml-2 opacity-60 font-sans">Wait...</span>}
          </button>
        </div>

        {noCount > 0 && (
          <p className="mt-16 text-zinc-600 text-xl italic animate-fade-in font-['Playfair_Display']">
            No seems a bit shy 🙈
          </p>
        )}
      </div>
    </div>
  );
};

export default App;

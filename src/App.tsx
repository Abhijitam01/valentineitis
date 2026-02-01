import React, { useState, useRef, useEffect, useCallback } from 'react';
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
        <FloatingHearts />
        <div className="z-10 bg-white/30 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border border-white/40 text-center animate-bounce-subtle max-w-4xl w-full mx-auto">
          
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-8">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-64 h-64 object-cover rounded-2xl shadow-xl border-4 border-white/50"
            >
              <source src="/gif-valentine.mp4" type="video/mp4" />
            </video>
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-64 h-64 object-cover rounded-2xl shadow-xl border-4 border-white/50"
            >
              <source src="/gif-valentine-2.mp4" type="video/mp4" />
            </video>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-md font-['Dancing_Script']">
            Yay! 💖
          </h1>
          <p className="text-white text-2xl md:text-3xl font-medium font-['Playfair_Display']">
            I knew you'd say yes!
          </p>
          
          <div className="mt-8 flex justify-center gap-4">
            <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
            <Heart className="w-10 h-10 text-red-500 fill-red-500 animate-ping" />
            <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
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
      <FloatingHearts />
      
      <div 
        ref={cardRef}
        className="z-10 bg-white/30 backdrop-blur-xl p-12 rounded-[2.5rem] shadow-2xl border border-white/60 text-center max-w-xl w-full relative min-h-[500px] flex flex-col items-center justify-center"
      >
        <div className="mb-8 animate-bounce">
          <Heart className="w-24 h-24 text-red-500 fill-red-500 drop-shadow-xl" />
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-10 leading-tight font-['Dancing_Script'] drop-shadow-sm">
          Pratyush will you be my valentine ??
        </h1>

        <div className="flex flex-col sm:flex-row gap-6 items-center justify-center w-full relative min-h-[120px]">
          <button
            onClick={handleYesClick}
            className="px-12 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full font-bold text-2xl shadow-xl hover:shadow-pink-300/50 transition-all duration-300 transform hover:scale-110 active:scale-95 z-20 font-['Playfair_Display'] tracking-wide"
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
            className="px-12 py-4 bg-white/80 hover:bg-white text-gray-700 rounded-full font-bold text-2xl border-2 border-white shadow-lg transition-all z-20 whitespace-nowrap font-['Playfair_Display'] backdrop-blur-sm"
          >
            No {noCount > 0 && <span className="text-sm ml-1 opacity-60 font-sans">Wait...</span>}
          </button>
        </div>

        {noCount > 0 && (
          <p className="mt-12 text-zinc-600 text-lg italic animate-fade-in font-['Playfair_Display']">
            No seems a bit shy 🙈
          </p>
        )}
      </div>
    </div>
  );
};

export default App;

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Heart, HeartCrack, Sparkles } from 'lucide-react';
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
      <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-pink-50">
        <FloatingHearts />
        <div className="z-10 bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-pink-100 text-center animate-bounce-subtle max-w-sm w-full">
          <img 
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHp1eHRueWlzNHR2OHp6ZWZ6MmtuNXB6Nnd6bTZ6NHR6ZWZ6MmtuJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/MDJ9IbxxvDUQM/giphy.gif" 
            alt="Cute Cat Hug" 
            className="w-48 h-48 mx-auto rounded-2xl mb-6 shadow-lg"
          />
          <h1 className="text-4xl font-bold text-pink-600 mb-2 drop-shadow-sm">Yay! 💖</h1>
          <p className="text-pink-500 text-xl font-medium">I knew you'd say yes!</p>
          <div className="mt-6 flex justify-center gap-2">
            <Sparkles className="text-yellow-400 animate-pulse" />
            <Heart className="text-pink-500 fill-pink-500 animate-ping" />
            <Sparkles className="text-yellow-400 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500"
      onMouseMove={handleMouseMove}
    >
      <FloatingHearts />
      
      <div 
        ref={cardRef}
        className="z-10 bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-white/50 text-center max-w-sm w-full relative min-h-[400px] flex flex-col items-center justify-center"
      >
        <div className="mb-8 animate-bounce">
          <Heart className="w-20 h-20 text-pink-500 fill-pink-500 drop-shadow-lg" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-8 leading-tight">
          Will you be my Valentine?
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full relative min-h-[100px]">
          <button
            onClick={handleYesClick}
            className="px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-pink-200 transition-all duration-300 transform hover:scale-110 active:scale-95 z-20"
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
            className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full font-medium text-lg border border-gray-200 transition-colors z-20 whitespace-nowrap"
          >
            No {noCount > 0 && <span className="text-sm ml-1 opacity-60">Wait...</span>}
          </button>
        </div>

        {noCount > 0 && (
          <p className="mt-12 text-sm text-gray-400 italic animate-fade-in">
            No seems a bit shy 🙈
          </p>
        )}
      </div>
    </div>
  );
};

export default App;

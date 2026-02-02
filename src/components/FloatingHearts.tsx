import React, { useState } from 'react';

const FloatingHearts: React.FC = () => {
  const [hearts] = useState(() => 
    Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: `${6 + Math.random() * 8}s`,
      size: `${15 + Math.random() * 25}px`,
      delay: `${-Math.random() * 10}s`,
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute bottom-[-50px] animate-heart opacity-0"
          style={{
            left: heart.left,
            width: heart.size,
            height: heart.size,
            //@ts-expect-error - Custom CSS property
            '--duration': heart.duration,
            animationDelay: heart.delay,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="#f472b6"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default FloatingHearts;

import confetti from 'canvas-confetti';

export const triggerConfetti = () => {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  const interval: ReturnType<typeof setInterval> = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    
    // Heart shapes are not built-in, but we can use emojis or colors
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#ff69b4', '#ff1493', '#ff0000', '#fce7f3'],
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#ff69b4', '#ff1493', '#ff0000', '#fce7f3'],
    });
  }, 250);
};

export const triggerHeartBurst = () => {
  const scalar = 2;
  const heart = confetti.shapeFromText({ text: '❤️', scalar });

  confetti({
    shapes: [heart],
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#ff69b4', '#ff1493', '#ff0000'],
  });
};

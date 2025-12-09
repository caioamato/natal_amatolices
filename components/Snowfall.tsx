import React, { useEffect, useState } from 'react';

const Snowfall: React.FC = () => {
  const [snowflakes, setSnowflakes] = useState<Array<{ id: number; left: string; duration: string; delay: string; size: string }>>([]);

  useEffect(() => {
    // Generate static snowflakes on mount to avoid re-renders causing jitter
    const count = 50;
    const newFlakes = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      duration: `${Math.random() * 3 + 5}s`, // 5-8s duration
      delay: `${Math.random() * 5}s`,
      size: `${Math.random() * 0.5 + 0.2}rem`
    }));
    setSnowflakes(newFlakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute bg-white rounded-full opacity-80"
          style={{
            left: flake.left,
            top: '-10px',
            width: flake.size,
            height: flake.size,
            animation: `fall ${flake.duration} linear infinite`,
            animationDelay: flake.delay,
          }}
        />
      ))}
    </div>
  );
};

export default Snowfall;
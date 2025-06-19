import React, { useEffect, useState } from 'react';
import './TurnTimer.scss';

interface TurnTimerProps {
  isCurrentPlayer: boolean;
}

export const TurnTimer: React.FC<TurnTimerProps> = ({ isCurrentPlayer }) => {
  const [timeLeft, setTimeLeft] = useState<number>(120); // 2 minutes in seconds

  useEffect(() => {
    // Reset timer when player changes
    if (isCurrentPlayer) {
      setTimeLeft(120);
    }

    // Start countdown if it's current player's turn
    let interval: number | null = null;
    if (isCurrentPlayer && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            if (interval) window.clearInterval(interval);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isCurrentPlayer, timeLeft]);

  // Format time as MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  // Add warning class when less than 30 seconds left
  const className = timeLeft <= 30 ? 'timer-warning' : '';

  return <span className={className}>{formattedTime}</span>;
}; 
import React, { useEffect, useState } from 'react';
import './DiceRoll.scss';

// Import dice faces
import Die1 from '../assets/dice/die.face.1.fill.svg';
import Die2 from '../assets/dice/die.face.2.fill.svg';
import Die3 from '../assets/dice/die.face.3.fill.svg';
import Die4 from '../assets/dice/die.face.4.fill.svg';
import Die5 from '../assets/dice/die.face.5.fill.svg';
import Die6 from '../assets/dice/die.face.6.fill.svg';
import Die1Red from '../assets/dice/die.face.1.red.svg';
import Die2Red from '../assets/dice/die.face.2.red.svg';
import Die3Red from '../assets/dice/die.face.3.red.svg';
import Die4Red from '../assets/dice/die.face.4.red.svg';
import Die5Red from '../assets/dice/die.face.5.red.svg';
import Die6Red from '../assets/dice/die.face.6.red.svg';

const yellowDice = [Die1, Die2, Die3, Die4, Die5, Die6];
const redDice = [Die1Red, Die2Red, Die3Red, Die4Red, Die5Red, Die6Red];

interface DiceRollProps {
  values: [number, number] | null;
}

const DiceRoll: React.FC<DiceRollProps> = ({ values }) => {
  const [isRolling, setIsRolling] = useState(false);

  useEffect(() => {
    if (values) {
      setIsRolling(true);
      const timer = setTimeout(() => setIsRolling(false), 500);
      return () => clearTimeout(timer);
    }
  }, [values]);

  if (!values) return null;

  const [die1, die2] = values;

  return (
    <div className="dice-roll">
      <img 
        src={yellowDice[die1 - 1]} 
        alt={`Die 1: ${die1}`} 
        className={`die ${isRolling ? 'die-rolling' : ''}`} 
      />
      <img 
        src={redDice[die2 - 1]} 
        alt={`Die 2: ${die2}`} 
        className={`die ${isRolling ? 'die-rolling' : ''}`} 
      />
    </div>
  );
};

export default DiceRoll; 
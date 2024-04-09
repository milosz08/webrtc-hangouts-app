'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import { createRef, useEffect, useState } from 'react';
import clsx from 'clsx';

const PinInput = () => {
  const correctPin = '12345678';
  const [pin, setPin] = useState(Array(8).fill(''));
  const [isValid, setIsValid] = useState(null);
  const refs = Array(8)
    .fill()
    .map(() => createRef());

  const updatePin = (newPin, i) => {
    setPin(newPin);
    if (i < 7) {
      refs[i + 1].current.focus();
    }
    setIsValid(
      newPin.join('') === correctPin ? true : newPin.includes('') ? null : false
    );
  };

  const handleChange = (digit, i) =>
    updatePin([...pin.slice(0, i), digit, ...pin.slice(i + 1)], i);

  const handleKeyDown = (e, i) => {
    if (e.key === 'Backspace') {
      if (pin[i] !== '') {
        setPin([...pin.slice(0, i), '', ...pin.slice(i + 1)]);
        refs[i].current.focus();
        setIsValid(null);
      } else if (i > 0) {
        setPin([...pin.slice(0, i - 1), '', ...pin.slice(i)]);
        refs[i - 1].current.focus();
        setIsValid(null);
      }
    } else if (e.key.startsWith('Arrow')) {
      refs[
        Math.min(Math.max(i + (e.key === 'ArrowRight' ? 1 : -1), 0), 7)
      ].current.focus();
    }
  };

  const handlePaste = e => {
    e.preventDefault();
    const newPin = [...e.clipboardData.getData('text').slice(0, 8)];
    while (newPin.length < 8) newPin.push('');
    {
      updatePin(newPin, newPin.length - 1);
    }
  };

  useEffect(() => refs[0].current.focus(), []);

  return (
    <div className="flex flex-wrap justify-center gap-4" onPaste={handlePaste}>
      {pin.map((digit, i) => (
        <input
          key={i}
          type="text"
          className={clsx(
            'w-12 text-center text-2xl rounded-xl border-xl border-blue-400 dark:border-white dark:text-white text-black',
            {
              'dark:bg-dark-pininput': isValid === null,
              'bg-green-400': isValid,
              'animate-shake bg-red-400': isValid === false,
            }
          )}
          maxLength="1"
          ref={refs[i]}
          value={digit}
          onChange={e => handleChange(e.target.value, i)}
          onKeyDown={e => handleKeyDown(e, i)}
        />
      ))}
    </div>
  );
};

export default PinInput;

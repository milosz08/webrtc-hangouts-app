'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import { createRef, useEffect, useState } from 'react';
import { codeInputFieldRegex } from '../utils/const';

const usePinHandler = updatePin => {
  const [pin, setPin] = useState(Array(8).fill(''));
  const refs = Array(8)
    .fill()
    .map(() => createRef());

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => refs[0].current.focus(), []);

  const handleChange = (digit, i) => {
    if (codeInputFieldRegex.test(digit)) {
      updatePin([...pin.slice(0, i), digit, ...pin.slice(i + 1)], i);
    }
  };

  const handleKeyDown = (e, i) => {
    if (e.key === 'Backspace') {
      if (pin[i] !== '') {
        setPin([...pin.slice(0, i), '', ...pin.slice(i + 1)]);
        refs[i].current.focus();
      } else if (i > 0) {
        setPin([...pin.slice(0, i - 1), '', ...pin.slice(i)]);
        refs[i - 1].current.focus();
      }
    } else if (e.key.startsWith('Arrow')) {
      refs[
        Math.min(Math.max(i + (e.key === 'ArrowRight' ? 1 : -1), 0), 7)
      ].current.focus();
    }
  };

  const handlePaste = e => {
    e.preventDefault();
    let newPin = [...e.clipboardData.getData('text').slice(0, 8)];
    newPin = newPin.filter(character => codeInputFieldRegex.test(character));
    while (newPin.length < 8) {
      newPin.push('');
    }
    updatePin(newPin, newPin.length - 1);
  };

  return {
    refs,
    handleChange,
    handleKeyDown,
    handlePaste,
    setPin,
    pin,
  };
};

export default usePinHandler;

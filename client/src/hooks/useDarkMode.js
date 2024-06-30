'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import { useEffect, useState } from 'react';

const useDarkMode = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return JSON.parse(window.localStorage.getItem('darkMode')) || false;
  });

  useEffect(() => {
    const setDarkModeClass = isDarkMode => {
      const htmlElement = document.querySelector('html');
      if (isDarkMode) {
        htmlElement.classList.add('dark');
      } else {
        htmlElement.classList.remove('dark');
      }
    };
    setDarkModeClass(darkMode);
    window.localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return [darkMode, setDarkMode];
};

export default useDarkMode;

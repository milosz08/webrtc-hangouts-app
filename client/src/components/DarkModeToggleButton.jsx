'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import { useEffect, useState } from 'react';
import { MdNightlightRound, MdOutlineWbSunny } from 'react-icons/md';

const DarkModeToggleButton = () => {
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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <button
      id="theme-toggle"
      type="button"
      className="cursor-pointer w-10 h-10 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5"
      onClick={toggleDarkMode}>
      <MdNightlightRound className={darkMode ? 'hidden w-5 h-5' : 'w-5 h-5'} />
      <MdOutlineWbSunny className={!darkMode ? 'hidden w-5 h-5' : 'w-5 h-5'} />
    </button>
  );
};

export default DarkModeToggleButton;
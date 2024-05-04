'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import { useRef, useState } from 'react';
import clsx from 'clsx';
import { useOnClickOutside } from 'usehooks-ts';
import { actionType, useAppContext } from '../context/AppContextProvider';
import DarkModeToggleButton from './DarkModeToggleButton';
import NicknameDropdown from './NicknameDropdown';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { state, dispatch } = useAppContext();
  const nicknameInput = useRef(null);

  const toggleDropdown = () => {
    if (!state.roomKey) {
      setIsOpen(prev => !prev);
    }
  };

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  const handleSave = () => {
    const inputValue = nicknameInput.current.value;
    if (inputValue.length > 0) {
      dispatch({ type: actionType.setNickname, value: inputValue });
      localStorage.setItem('nickname', inputValue);
      setIsOpen(false);
    }
  };

  return (
    <nav
      className="bg-gradient-to-r from-custom-blue via-custom-purple to-custom-blue dark:from-dark-blue dark:via-dark-purple-nav 
                dark:to-dark-blue border-b-2 border-border-color dark:border-dark-border">
      <div className="max-w-screen-xl flex justify-between items-center p-3 sm:p-4 px-8 mx-auto">
        <DarkModeToggleButton />
        <div className="relative inline-block text-left" ref={dropdownRef}>
          <span
            className={clsx(
              'relative text-gray-600 dark:text-white tracking-wide',
              {
                'cursor-pointer after:absolute after:bg-gray-700 after:h-[3px] after:w-0 after:left-0 after:bottom-[-5px] after:transition-[0.3s] dark:after:bg-white hover:after:w-full':
                  !state.roomKey,
              }
            )}
            onClick={toggleDropdown}>
            {state.nickname}
          </span>
          {isOpen && (
            <NicknameDropdown
              nicknameInput={nicknameInput}
              handleSave={handleSave}
            />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

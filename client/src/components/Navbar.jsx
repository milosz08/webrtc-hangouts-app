'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import { useEffect, useRef, useState } from 'react';
import CustomButton from './CustomButton';
import DarkModeToggleButton from './DarkModeToggleButton';
import NicknameDropdown from './NicknameDropdown';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isMeetingPage = location.pathname === '/meeting';
  const [nickname, setNickname] = useState(() => {
    const storedNickname = localStorage.getItem('nickname');
    if (
      storedNickname &&
      storedNickname.length > 30 &&
      storedNickname.length < 0
    ) {
      return storedNickname.substring(0, 30);
    }
    return storedNickname || 'Guest';
  });

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSave = () => {
    const inputValue = document.getElementById('default-input').value;
    if (inputValue.length > 0) {
      setNickname(inputValue);
      localStorage.setItem('nickname', inputValue);
    }
  };

  return (
    <nav
      className="bg-gradient-to-r from-custom-blue via-custom-purple to-custom-blue dark:from-dark-blue dark:via-dark-purple-nav 
                dark:to-dark-blue border-b-2 border-border-color dark:border-dark-border">
      <div className="max-w-screen-xl gap-3 p-3 sm:p-4 grid grid-cols-4 sm:grid-cols-3 mx-auto">
        <DarkModeToggleButton />
        <div className="col-span-3 sm:col-span-1 flex justify-center">
          {!isMeetingPage ? <CustomButton text="Create meeting" /> : null}
        </div>
        <div className="relative sm:inline-block text-left col-span-4 sm:col-span-1 w-full items-center justify-center flex">
          <div className="flex justify-center sm:justify-end items-center h-full w-full">
            <div className="relative inline-block text-left" ref={dropdownRef}>
              <span
                className="relative text-gray-600 dark:text-white cursor-pointer tracking-wide
                after:absolute after:bg-gray-700 after:h-[3px] after:w-0 after:left-0 after:bottom-[-5px] after:transition-[0.3s] dark:after:bg-white hover:after:w-full"
                onClick={toggleDropdown}>
                {nickname}
              </span>
              {isOpen && (
                <NicknameDropdown handleSave={handleSave} nickname={nickname} />
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

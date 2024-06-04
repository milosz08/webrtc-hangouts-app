'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useOnClickOutside } from 'usehooks-ts';
import { actionType, useAppContext } from '../context/AppContextProvider';
import { useSocket } from '../context/SocketProvider';
import DarkModeToggleButton from './DarkModeToggleButton';
import NicknameDropdown from './NicknameDropdown';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { state, dispatch } = useAppContext();
  const socket = useSocket();
  const { enqueueSnackbar } = useSnackbar();

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  const changeNicknameSideEffect = useCallback(
    updatedNickname => {
      dispatch({ type: actionType.setNickname, value: updatedNickname });
      localStorage.setItem('nickname', updatedNickname);
      setIsOpen(false);
    },
    [dispatch]
  );

  const handleSave = nickname => {
    if (nickname.length > 0) {
      const { roomKey } = state;
      if (roomKey) {
        socket.emit('room:change-nickname', {
          newNickname: nickname,
          userSocketId: socket.id,
          roomKey,
        });
      } else {
        changeNicknameSideEffect(nickname);
      }
    }
  };

  const onFailedChangeUserNickname = useCallback(
    ({ reason }) => enqueueSnackbar(reason),
    [enqueueSnackbar]
  );

  const onUpdateNickname = useCallback(
    ({ updatedNickname }) => changeNicknameSideEffect(updatedNickname),
    [changeNicknameSideEffect]
  );

  useEffect(() => {
    socket.on('user:update-nickname', onUpdateNickname);
    socket.on('user:failed-update-nickname', onFailedChangeUserNickname);
    return () => {
      socket.off('user:update-nickname', onUpdateNickname);
      socket.off('user:failed-update-nickname', onFailedChangeUserNickname);
    };
  }, [
    socket,
    onFailedChangeUserNickname,
    changeNicknameSideEffect,
    onUpdateNickname,
  ]);

  return (
    <nav
      className="bg-gradient-to-r from-custom-blue via-custom-purple to-custom-blue dark:from-dark-blue dark:via-dark-purple-nav 
                dark:to-dark-blue border-b-2 border-border-color dark:border-dark-border">
      <div className="max-w-screen-xl flex justify-between items-center p-3 px-8 mx-auto">
        <DarkModeToggleButton />
        <div className="relative inline-block text-left" ref={dropdownRef}>
          <span
            className="relative text-gray-600 dark:text-white tracking-wide cursor-pointer after:absolute after:bg-gray-700 
            after:h-[3px] after:w-0 after:left-0 after:bottom-[-5px] after:transition-[0.3s] dark:after:bg-white hover:after:w-full"
            onClick={() => setIsOpen(prev => !prev)}>
            {state.nickname}
          </span>
          {isOpen && <NicknameDropdown handleSave={handleSave} />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

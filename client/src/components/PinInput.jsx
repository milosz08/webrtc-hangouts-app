'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import { createRef, useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { actionType, useAppContext } from '../context/AppContextProvider';
import { useSocket } from '../context/SocketProvider';

const PinInput = () => {
  const [pin, setPin] = useState(Array(8).fill(''));
  const [isChecking, setIsChecking] = useState(false);
  const socket = useSocket();
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const { enqueueSnackbar } = useSnackbar();
  const regex = /^[a-zA-Z0-9]*$/;

  const refs = Array(8)
    .fill()
    .map(() => createRef());

  const updatePin = (newPin, i) => {
    setPin(newPin);
    if (i < 7) {
      refs[i + 1].current.focus();
    } else {
      if (newPin.every(digit => digit !== '')) {
        socket.emit('room:join', {
          nickname: state.nickname,
          code: newPin.join(''),
        });
        setIsChecking(true);
      }
    }
  };

  const handleChange = (digit, i) => {
    if (regex.test(digit)) {
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
    newPin = newPin.filter(character => regex.test(character));
    while (newPin.length < 8) {
      newPin.push('');
    }
    updatePin(newPin, newPin.length - 1);
  };

  const onRoomSucceedJoin = useCallback(
    ({ meetingId, meetingKey }) => {
      setIsChecking(false);
      dispatch({ type: actionType.setRoomKey, value: meetingKey });
      navigate(`/meeting/${meetingId}`);
    },
    [dispatch, navigate]
  );

  const onRoomFailedJoin = useCallback(
    ({ reason }) => {
      setIsChecking(false);
      setPin(Array(8).fill(''));
      enqueueSnackbar(reason);
    },
    [enqueueSnackbar]
  );

  useEffect(() => refs[0].current.focus(), []);

  useEffect(() => {
    socket.on('room:join-succeed', onRoomSucceedJoin);
    socket.on('room:join-failed', onRoomFailedJoin);
    return () => {
      socket.off('room:join-succeed', onRoomSucceedJoin);
      socket.off('room:join-failed', onRoomFailedJoin);
    };
  }, [socket, onRoomSucceedJoin, onRoomFailedJoin]);

  return (
    <div className="flex flex-col items-center">
      <div
        className="flex flex-wrap justify-center gap-4"
        onPaste={handlePaste}>
        {pin.map((digit, i) => (
          <input
            key={i}
            type="text"
            className={clsx(
              'w-12 text-center text-2xl rounded-xl border-xl border-blue-400 dark:border-white dark:text-white text-black dark:bg-dark-pininput',
              {
                'opacity-50': isChecking,
              }
            )}
            maxLength="1"
            ref={refs[i]}
            value={digit}
            onChange={e => handleChange(e.target.value, i)}
            onKeyDown={e => handleKeyDown(e, i)}
            disabled={isChecking}
          />
        ))}
      </div>
      {isChecking && (
        <div className="mt-8">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent
          align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
            role="status"></div>
        </div>
      )}
    </div>
  );
};

export default PinInput;

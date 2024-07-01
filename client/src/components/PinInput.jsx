'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { actionType, useAppContext } from '../context/AppContextProvider';
import { usePeer } from '../context/PeerProvider';
import { useSocket } from '../context/SocketProvider';
import usePinHandler from '../hooks/usePinHandler';

const PinInput = () => {
  const [isChecking, setIsChecking] = useState(false);
  const socket = useSocket();
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const { enqueueSnackbar } = useSnackbar();
  const { createPeerConnection } = usePeer();

  const updatePin = (newPin, i) => {
    setPin(newPin);
    if (i < 7) {
      refs[i + 1].current.focus();
    } else {
      if (newPin.every(digit => digit !== '')) {
        setIsChecking(true);
        createPeerConnection(
          peerId => {
            socket.emit('room:join', {
              nickname: state.nickname,
              code: newPin.join(''),
              peerId,
              isVideoOn: state.isVideoOn,
              isAudioOn: state.isAudioOn,
            });
          },
          () => {
            setIsChecking(false);
            setPin(Array(8).fill(''));
          }
        );
      }
    }
  };

  const { refs, handleChange, handleKeyDown, handlePaste, setPin, pin } =
    usePinHandler(updatePin);

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
    [enqueueSnackbar, setPin]
  );

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
              'w-12',
              'text-center',
              'text-2xl',
              'rounded-xl',
              'border-xl',
              'border-blue-400',
              'dark:border-white',
              'dark:text-white',
              'text-black',
              'dark:bg-dark-pininput',
              'disabled:opacity-50',
              {
                'opacity-50': isChecking,
              }
            )}
            maxLength="1"
            ref={refs[i]}
            value={digit}
            onChange={e => handleChange(e.target.value, i)}
            onKeyDown={e => handleKeyDown(e, i)}
            disabled={
              isChecking ||
              (!state.selectedVideoDevice.id && !state.selectedAudioDevice.id)
            }
          />
        ))}
      </div>
      {isChecking && (
        <div className="mt-8">
          <div
            className={clsx(
              'inline-block',
              'h-8',
              'w-8',
              'animate-spin',
              'rounded-full',
              'border-4',
              'border-solid',
              'border-current',
              'border-e-transparent',
              'align-[-0.125em]',
              'text-surface',
              'motion-reduce:animate-[spin_1.5s_linear_infinite]',
              'dark:text-white'
            )}
            role="status"></div>
        </div>
      )}
    </div>
  );
};

export default PinInput;

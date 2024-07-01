'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import { useCallback, useEffect, useState } from 'react';
import convert from 'convert-seconds';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router';
import { actionType, useAppContext } from '../context/AppContextProvider';
import { useSocket } from '../context/SocketProvider';

const formatTime = time => time.toString().padStart(2, '0');

const MeetingTimer = () => {
  const { state, dispatch } = useAppContext();
  const socket = useSocket();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [elapsedTime, setElapsedTime] = useState();

  const onTimerTick = useCallback(({ elapsedTime }) => {
    setElapsedTime(elapsedTime);
  }, []);

  const onElapsedTime = useCallback(
    ({ message }) => {
      socket.emit('room:close', {
        roomKey: state.roomKey,
        invokeBy: 'ELAPSED SESSION TIME',
      });
      dispatch({ type: actionType.leaveSession });
      navigate('/');
      enqueueSnackbar(message);
    },
    [dispatch, enqueueSnackbar, navigate, socket, state.roomKey]
  );

  useEffect(() => {
    socket.on('room:timer-tick', onTimerTick);
    socket.on('room:time-elapsed', onElapsedTime);
    return () => {
      socket.off('room:timer-tick', onTimerTick);
      socket.off('room:time-elapsed', onElapsedTime);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="text-2xl text-dark-meeting dark:text-white -mt-1 absolute left-[50%] -translate-x-[50%]">
      {elapsedTime && (
        <>
          <span>{formatTime(convert(elapsedTime).hours)}</span>:
          <span>{formatTime(convert(elapsedTime).minutes)}</span>:
          <span>{formatTime(convert(elapsedTime).seconds)}</span>
        </>
      )}
    </div>
  );
};

export default MeetingTimer;

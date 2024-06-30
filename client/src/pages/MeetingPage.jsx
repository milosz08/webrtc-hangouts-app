'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import CameraWindow from '../components/CameraWindow';
import Chat from '../components/Chat';
import MeetingIcons from '../components/MeetingIcons';
import { actionType, useAppContext } from '../context/AppContextProvider';
import { useSocket } from '../context/SocketProvider';

const MeetingPage = () => {
  const [cameras, setCameras] = useState([]);
  const [visibleCameras, setVisibleCameras] = useState(1);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [isChatOpen, setChatOpen] = useState(false);
  const socket = useSocket();
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const updateVisibleCameras = () => {
    let visibleCameras;
    if (window.innerWidth < 768) {
      visibleCameras = 1;
    } else if (window.innerWidth >= 768 && window.innerWidth < 906) {
      visibleCameras = isChatOpen ? 2 : 4;
    } else if (window.innerWidth >= 906 && window.innerWidth < 1240) {
      visibleCameras = 4;
    } else if (window.innerWidth >= 1240 && window.innerWidth < 1536) {
      visibleCameras = isChatOpen ? 4 : 6;
    } else {
      visibleCameras = 6;
    }
    setVisibleCameras(visibleCameras);
  };

  useEffect(() => {
    window.addEventListener('resize', updateVisibleCameras);
    updateVisibleCameras();

    return () => {
      window.removeEventListener('resize', updateVisibleCameras);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChatOpen]);

  const onDragStart = (e, index) => {
    e.dataTransfer.setData('cameraIndex', index);
  };

  const onDragOver = (e, index) => {
    e.preventDefault();
    setHighlightedIndex(index);
  };

  const onDrop = (e, index) => {
    const draggedCameraIndex = e.dataTransfer.getData('cameraIndex');
    const newCameras = [...cameras];
    const temp = newCameras[draggedCameraIndex];
    newCameras[draggedCameraIndex] = newCameras[index];
    newCameras[index] = temp;
    setCameras(newCameras);
    setHighlightedIndex(null);
  };

  const toggleChat = () => {
    setChatOpen(prevState => !prevState);
  };

  const onSnackbarMessageAction = useCallback(
    ({ message }) => enqueueSnackbar(message),
    [enqueueSnackbar]
  );

  const getRoomParticipants = useCallback(
    ({ host, participants }) => {
      const cameras = participants.map(({ nickname, socketId }) => ({
        nickname,
        socketId,
        isHost: host.socketId === socketId,
      }));
      setCameras(cameras);
      dispatch({
        type: actionType.setIsHost,
        value: host.socketId === socket.id,
      });
    },
    [dispatch, socket.id]
  );

  const onDeleteRoom = useCallback(
    ({ message }) => {
      enqueueSnackbar(message);
      navigate('/');
    },
    [enqueueSnackbar, navigate]
  );

  const onUpdateUserNickname = useCallback(
    ({ updatedNickname, userSocketId, message }) => {
      const prevCameras = [...cameras];
      const userIndex = prevCameras.findIndex(
        ({ socketId }) => userSocketId === socketId
      );
      if (userIndex !== -1) {
        prevCameras[userIndex].nickname = updatedNickname;
      }
      setCameras(prevCameras);
      enqueueSnackbar(message);
    },
    [cameras, enqueueSnackbar]
  );

  useEffect(() => {
    socket.emit('room:participants', {
      roomKey: state.roomKey,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socket.on('room:participant-joined', onSnackbarMessageAction);
    socket.on('room:participant-leaved', onSnackbarMessageAction);
    socket.on('room:participants', getRoomParticipants);
    socket.on('room:update-nickname', onUpdateUserNickname);
    socket.on('room:reassigned-host', onSnackbarMessageAction);
    socket.on('room:deleted', onDeleteRoom);
    return () => {
      socket.off('room:participant-joined', onSnackbarMessageAction);
      socket.off('room:participant-leaved', onSnackbarMessageAction);
      socket.off('room:participants', getRoomParticipants);
      socket.off('room:update-nickname', onUpdateUserNickname);
      socket.off('room:reassigned-host', onSnackbarMessageAction);
      socket.off('room:deleted', onDeleteRoom);
    };
  }, [
    socket,
    onSnackbarMessageAction,
    getRoomParticipants,
    onUpdateUserNickname,
    onDeleteRoom,
  ]);

  return (
    <div className="bg-custom-meeting dark:bg-dark-meeting h-full flex-grow flex flex-col md:flex-row overflow-hidden">
      <div
        className={clsx('pb-2 w-full transition-all duration-700 ease-in-out', {
          'md:w-2/3 xl:w-3/4': isChatOpen,
          'md:w-full xl:w-full': !isChatOpen,
        })}>
        <div className="relative">
          {!isChatOpen ? (
            <button
              onClick={toggleChat}
              className={clsx(
                'absolute',
                'bottom-0',
                'left-0',
                'md:top-0',
                'md:right-0',
                'md:bottom-auto',
                'md:left-auto',
                'rotate-90',
                'md:rotate-0 m-2',
                'text-white z-20',
                'bg-blue-300',
                'dark:bg-blue-700',
                'p-1',
                'rounded-2xl',
                'dark:hover:bg-blue-600',
                'hover:bg-blue-200'
              )}>
              {isChatOpen ? <FaChevronRight /> : <FaChevronLeft />}
            </button>
          ) : null}
          <div
            id="content"
            className={clsx(
              'flex',
              'justify-around',
              'overflow-x-auto',
              'p-2',
              'scrollbar-thin',
              'scrollbar-thumb-purple-400',
              'scrollbar-track-blue-200',
              'dark:scrollbar-thumb-purple-800',
              'dark:scrollbar-track-blue-400',
              'scrollbar-thumb-rounded-full',
              'scrollbar-track-rounded-full',
              'shadow-inner'
            )}>
            <div className="inline-flex">
              {cameras.slice(visibleCameras).map((camera, index) => (
                <div className="w-40 flex-shrink-0 px-1" key={camera}>
                  <div
                    draggable
                    onDragStart={e => onDragStart(e, index + visibleCameras)}
                    onDragOver={e => onDragOver(e, index + visibleCameras)}
                    onDrop={e => onDrop(e, index + visibleCameras)}
                    key={camera.nickname}>
                    <CameraWindow
                      nickname={camera.nickname}
                      isHost={camera.isHost}
                      isHighlighted={
                        index + visibleCameras === highlightedIndex
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            id="content"
            className={clsx(
              'md:pt-2 pt-10 px-2 grid gap-2 xl:px-20  sm:px-12',
              {
                'grid-cols-2': visibleCameras === 4,
                'grid-cols-3': visibleCameras === 6,
              }
            )}>
            {cameras.slice(0, visibleCameras).map((camera, index) => (
              <div
                draggable
                onDragStart={e => onDragStart(e, index)}
                onDragOver={e => onDragOver(e, index)}
                onDrop={e => onDrop(e, index)}
                key={camera.nickname}>
                <CameraWindow
                  nickname={camera.nickname}
                  isHost={camera.isHost}
                  isHighlighted={index === highlightedIndex}
                />
              </div>
            ))}
          </div>
          <div className="justify-center flex mt-2 w-full">
            <MeetingIcons />
          </div>
        </div>
      </div>
      <div
        className={clsx(
          'w-full mt-auto md:mt-0 transition-all duration-700 ease-in-out transform',
          {
            'md:w-1/3 xl:w-1/4 translate-y-0': isChatOpen,
            'md:w-0 xl:w-0 translate-y-full md:transform-none': !isChatOpen,
          }
        )}>
        {isChatOpen ? (
          <div className="relative h-full">
            <button
              onClick={toggleChat}
              className={clsx(
                'absolute m-3.5 text-white z-20 p-1 rounded-2xl',
                'rotate-90 md:rotate-0',
                'top-0 left-0 md:top-0 md:bottom-auto md:left-auto',
                isChatOpen
                  ? 'bg-blue-300 dark:bg-blue-700 hover:bg-blue-200 dark:hover:bg-blue-600'
                  : 'bg-blue-200 dark:bg-blue-600 hover:bg-blue-300 dark:hover:bg-blue-700'
              )}>
              {isChatOpen ? <FaChevronRight /> : <FaChevronLeft />}
            </button>
            <Chat />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MeetingPage;

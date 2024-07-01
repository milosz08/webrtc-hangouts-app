'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import { useEffect } from 'react';
import clsx from 'clsx';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import CameraWindowContainer from '../components/CameraWindowContainer';
import ChatContainer from '../components/ChatContainer';
import MeetingIcons from '../components/MeetingIcons';
import { useAppContext } from '../context/AppContextProvider';
import { useSocket } from '../context/SocketProvider';
import useDraggableCameras from '../hooks/useDraggableCameras';
import useMeetingRoomPeerConnection from '../hooks/useMeetingRoomPeerConnection';
import useMeetingRoomSocket from '../hooks/useMeetingRoomSocket';

const MeetingPage = () => {
  const socket = useSocket();
  const { state } = useAppContext();

  const {
    cameras,
    visibleCameras,
    highlightedIndex,
    isChatOpen,
    toggleChat,
    onDragStart,
    onDragOver,
    onDrop,
    setCameras,
  } = useDraggableCameras();

  const { peers, setPeers, streams } = useMeetingRoomPeerConnection({
    setCameras,
  });

  useMeetingRoomSocket({ peers, setPeers, cameras, setCameras });

  useEffect(() => {
    socket.emit('room:participants', {
      roomKey: state.roomKey,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                <div className="w-40 flex-shrink-0 px-1" key={camera.peerId}>
                  <CameraWindowContainer
                    camera={camera}
                    stream={streams[camera.peerId]}
                    index={index}
                    highlightedIndex={highlightedIndex}
                    visibleCameras={visibleCameras}
                    onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    isSmallVariant={true}
                  />
                </div>
              ))}
            </div>
          </div>
          <div
            className={clsx(
              'md:pt-2 pt-10 px-2 grid gap-2 xl:px-20  sm:px-12',
              {
                'grid-cols-2': visibleCameras === 4,
                'grid-cols-3': visibleCameras === 6,
              }
            )}>
            {cameras.slice(0, visibleCameras).map((camera, index) => (
              <CameraWindowContainer
                key={camera.peerId}
                camera={camera}
                stream={streams[camera.peerId]}
                index={index}
                highlightedIndex={highlightedIndex}
                visibleCameras={0}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
                isSmallVariant={false}
              />
            ))}
          </div>
          <div className="justify-center flex mt-2 w-full">
            <MeetingIcons />
          </div>
        </div>
      </div>
      <ChatContainer isChatOpen={isChatOpen} toggleChat={toggleChat} />
    </div>
  );
};

export default MeetingPage;

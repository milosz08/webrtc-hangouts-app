'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { FaMicrophoneSlash } from 'react-icons/fa';
import { LuCrown } from 'react-icons/lu';
import ReactPlayer from 'react-player';

const CameraWindow = ({
  children,
  stream,
  nickname,
  isHost,
  isHighlighted,
  isVideoOn,
  isAudioOn,
  isMuted,
  isSmallVariant,
  videoRef,
}) => {
  return (
    <div
      className={clsx('relative w-full pb-[56.25%]', {
        'border border-red-700 dark:border-red-400': isHighlighted,
      })}>
      <div
        className={clsx(
          'dark:text-white absolute inset-0 border border-gray-300 dark:border-gray-700',
          {
            'bg-gray-300 dark:bg-gray-900': isHighlighted,
            'bg-gray-200 dark:bg-gray-800': !isHighlighted,
          }
        )}>
        <div className="h-full inset-0 flex items-center justify-center text-2xl relative">
          <div
            className={clsx('absolute top-0 left-0 w-full h-full', {
              hidden: !isVideoOn,
            })}>
            {stream && (
              <ReactPlayer
                url={stream}
                playing
                playsinline
                width="100%"
                height="100%"
                muted={!isAudioOn || isMuted}
              />
            )}
            {videoRef && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w=full h-full"
                muted={!isAudioOn}></video>
            )}
            <div
              className={clsx(
                'absolute',
                '-bottom-[1px]',
                'right-0',
                'pe-2',
                'flex',
                'justify-end',
                'items-center',
                'text-[19px]',
                'bg-[rgba(0,0,0,0.7)]',
                'w-full'
              )}>
              <span
                className={clsx('text-white -mt-1', {
                  'text-sm mt-0': isSmallVariant,
                })}>
                {nickname}
              </span>
              {isHost && (
                <LuCrown
                  color="orange"
                  className="ms-2"
                  size={isSmallVariant ? 10 : 18}
                />
              )}
            </div>
          </div>
          {(!isVideoOn || !videoRef) && (
            <div className="flex justify-center items-center">
              <span className={clsx({ 'text-sm': isSmallVariant })}>
                {nickname}
              </span>
              {isHost && (
                <LuCrown
                  color="orange"
                  className="ms-2"
                  size={isSmallVariant ? 15 : 25}
                />
              )}
            </div>
          )}
          {!isAudioOn && (
            <div
              className={clsx(
                'absolute top-0 right-0 p-2 dark:text-white',
                { 'text-dark-purple': !isVideoOn },
                { 'bg-[rgba(0,0,0,0.7)] text-white': isVideoOn }
              )}>
              <FaMicrophoneSlash size={isSmallVariant ? 12 : 17} />
            </div>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

CameraWindow.propTypes = {
  children: PropTypes.node,
  stream: PropTypes.any,
  nickname: PropTypes.any.isRequired,
  isHost: PropTypes.bool,
  onClick: PropTypes.func,
  isSwitch: PropTypes.bool,
  isHighlighted: PropTypes.bool,
  isVideoOn: PropTypes.bool.isRequired,
  isAudioOn: PropTypes.bool.isRequired,
  isMuted: PropTypes.bool,
  isSmallVariant: PropTypes.bool,
  videoRef: PropTypes.any,
};

export default CameraWindow;

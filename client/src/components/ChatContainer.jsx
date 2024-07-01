'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Chat from './Chat';

const ChatContainer = ({ isChatOpen, toggleChat }) => (
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
            'absolute',
            'm-3.5',
            'text-white',
            'z-20',
            'p-1',
            'rounded-2xl',
            'rotate-90',
            'md:rotate-0',
            'top-0',
            'left-0',
            'md:top-0',
            'md:bottom-auto',
            'md:left-auto',
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
);

ChatContainer.propTypes = {
  isChatOpen: PropTypes.bool.isRequired,
  toggleChat: PropTypes.func.isRequired,
};

export default ChatContainer;

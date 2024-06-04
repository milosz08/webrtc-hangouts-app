'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import clsx from 'clsx';
import PropTypes from 'prop-types';

const Message = ({ message, isUser, username }) => {
  return (
    <div
      className={clsx('flex flex-col text-gray-600 dark:text-white', {
        'text-right items-end': isUser,
        'text-left': !isUser,
      })}>
      <p className="px-4 font-bold">{username}</p>
      <div
        className={clsx('rounded-lg px-4 py-2 mx-2 mb-2 break-all w-fit', {
          'bg-blue-400 text-white': isUser,
          'bg-gray-200 dark:bg-[#1A314E] dark:text-white': !isUser,
        })}>
        {message}
      </div>
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.string.isRequired,
  isUser: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
};

export default Message;

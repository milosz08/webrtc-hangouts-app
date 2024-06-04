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
      className={clsx('flex', {
        'justify-end': isUser,
        'justify-start': !isUser,
      })}>
      <div
        className={clsx('text-gray-600 dark:text-white', {
          'text-right': isUser,
          'text-left': !isUser,
        })}>
        <p className="px-4 font-bold">{username}</p>
        <div
          className={clsx('rounded-lg px-4 py-2 mx-2 mb-2 break-all', {
            'bg-blue-400 text-white': isUser,
            'bg-gray-200 dark:bg-[#1A314E] dark:text-white': !isUser,
          })}>
          {message}
        </div>
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

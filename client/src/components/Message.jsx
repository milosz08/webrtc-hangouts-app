'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import PropTypes from 'prop-types';

const Message = ({ message, isUser, username }) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`text-gray-600 dark:text-white ${isUser ? 'text-right' : 'text-left'}`}>
        <p className="px-4 font-bold">{username}</p>
        <div
          className={`rounded-lg px-4 py-2 mx-2 mb-2 ${isUser ? 'bg-blue-400 text-white' : 'bg-gray-200 dark:bg-[#1A314E] dark:text-white'}`}>
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

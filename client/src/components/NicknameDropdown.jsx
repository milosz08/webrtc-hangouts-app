'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import PropTypes from 'prop-types';

const NicknameDropdown = ({ nickname, handleSave }) => {
  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div className="origin-top-right absolute sm:right-0 right-6 transform translate-x-1/2 sm:translate-x-1 mt-2 w-56 rounded-md shadow-lg bg-gray-200 dark:bg-[#293847] ring-1 ring-black ring-opacity-5">
      <div className="p-2">
        <label
          htmlFor="default-input"
          className="block mb-2 px-1 text-sm font-medium text-gray-900 dark:text-white">
          Change nickname
        </label>
        <input
          type="text"
          id="default-input"
          defaultValue={nickname}
          maxLength={30}
          onKeyDown={handleKeyDown}
          className="bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#3f315c]  dark:border-white border-xl border-blue-400 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <div className="my-2">
          <button
            type="submit"
            onClick={handleSave}
            className="w-full text-white bg-gradient-to-br from-purple-500 to-blue-400 dark:from-purple-800 dark:to-blue-400 
    focus:ring-4 focus:outline-none focus:ring-blue-400 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:from-purple-600 hover:to-blue-500 dark:hover:from-purple-900 dark:hover:to-blue-500">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

NicknameDropdown.propTypes = {
  nickname: PropTypes.string.isRequired,
  handleSave: PropTypes.func.isRequired,
};

export default NicknameDropdown;

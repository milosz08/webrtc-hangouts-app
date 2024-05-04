'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import PropTypes from 'prop-types';
import { useAppContext } from '../context/AppContextProvider';
import CustomButton from './CustomButton';

const NicknameDropdown = ({ nicknameInput, handleSave }) => {
  const { state } = useAppContext();

  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div
      className="absolute right-0 transform mt-2 w-56 rounded-md shadow-lg bg-gray-200 dark:bg-dark-dropdown
      ring-1 ring-black ring-opacity-5 z-30">
      <div className="p-2">
        <label
          htmlFor="default-input"
          className="block mb-2 px-1 text-sm font-medium text-gray-900 dark:text-white">
          Change nickname
        </label>
        <input
          type="text"
          ref={nicknameInput}
          defaultValue={state.nickname}
          maxLength={30}
          onKeyDown={handleKeyDown}
          className="bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full
          p-2.5 dark:bg-dark-textarea dark:border-white border-xl border-blue-400 dark:placeholder-gray-400 dark:text-white
          dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <div className="my-2">
          <CustomButton type="submit" onClick={handleSave}>
            Save
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

NicknameDropdown.propTypes = {
  nicknameInput: PropTypes.any.isRequired,
  handleSave: PropTypes.func.isRequired,
};

export default NicknameDropdown;

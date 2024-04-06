'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import PropTypes from 'prop-types';

const CustomButton = ({ text }) => {
  return (
    <button
      type="button"
      className=" w-full text-white bg-gradient-to-br from-purple-500 to-blue-400 dark:from-purple-800 dark:to-blue-400  transition ease-out
            hover:scale-110 duration-200 focus:ring-4 focus:outline-none focus:ring-blue-400
            dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:from-purple-600 hover:to-blue-500 dark:hover:from-purple-900 dark:hover:to-blue-500">
      {text}
    </button>
  );
};

CustomButton.propTypes = {
  text: PropTypes.string.isRequired,
};

export default CustomButton;

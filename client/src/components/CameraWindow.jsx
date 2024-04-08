'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import PropTypes from 'prop-types';
import { HiOutlineSwitchHorizontal } from 'react-icons/hi';

const CameraWindow = ({ children, camera, onClick, isSwitch }) => (
  <div className="relative w-full pb-[56.25%]">
    <div className="dark:text-white absolute inset-0 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
      <div className="h-full inset-0 flex items-center justify-center text-2xl">
        Cam {camera}
      </div>
      {isSwitch ? (
        <button
          onClick={onClick}
          title="Switch camera"
          className="absolute top-0 right-0 p-1 m-1  dark:text-white rounded dark:hover:text-blue-500">
          <HiOutlineSwitchHorizontal />
        </button>
      ) : null}
      {children}
    </div>
  </div>
);

CameraWindow.propTypes = {
  children: PropTypes.node.isRequired,
  camera: PropTypes.number.isRequired,
  onClick: PropTypes.func,
  isSwitch: PropTypes.bool,
};

export default CameraWindow;

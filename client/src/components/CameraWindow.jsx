'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import PropTypes from 'prop-types';

const CameraWindow = ({ children, camera, isHighlighted }) => (
  <div
    className={`relative w-full pb-[56.25%]  'border-xl border-red-700 dark:border-red-400' : ''}`}>
    <div
      className={`dark:text-white absolute inset-0  border  ${isHighlighted ? 'bg-gray-300 dark:bg-gray-900' : 'bg-gray-200  dark:bg-gray-800'} border-gray-300  dark:border-gray-700`}>
      <div className="h-full inset-0 flex items-center justify-center text-2xl">
        Cam {camera}
      </div>
      {children}
    </div>
  </div>
);

CameraWindow.propTypes = {
  children: PropTypes.node.isRequired,
  camera: PropTypes.number.isRequired,
  onClick: PropTypes.func,
  isSwitch: PropTypes.bool,
  isHighlighted: PropTypes.bool,
};

export default CameraWindow;

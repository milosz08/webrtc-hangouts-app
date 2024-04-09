'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import clsx from 'clsx';
import PropTypes from 'prop-types';

const CameraWindow = ({ children, camera, isHighlighted }) => (
  <div
    className={clsx('relative w-full pb-[56.25%]', {
      'border-xl border-red-700 dark:border-red-400': isHighlighted,
    })}>
    <div
      className={clsx('dark:text-white absolute inset-0 border', {
        'bg-gray-300 dark:bg-gray-900 border-gray-300 dark:border-gray-700':
          isHighlighted,
        'bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-700':
          !isHighlighted,
      })}>
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

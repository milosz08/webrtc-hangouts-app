'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { LuCrown } from 'react-icons/lu';

const CameraWindow = ({ children, nickname, isHost, isHighlighted }) => (
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
        {nickname}
        {isHost ? <LuCrown color="orange" className="ms-2" size={25} /> : null}
      </div>
      {children}
    </div>
  </div>
);

CameraWindow.propTypes = {
  children: PropTypes.node,
  nickname: PropTypes.string.isRequired,
  isHost: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
  isSwitch: PropTypes.bool,
  isHighlighted: PropTypes.bool,
};

export default CameraWindow;

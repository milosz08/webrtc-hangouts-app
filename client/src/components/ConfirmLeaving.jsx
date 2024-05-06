'use strict';
/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */

import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useOnClickOutside } from 'usehooks-ts'
import { useRef } from 'react';

const ConfirmLeaving = ({ handleLeave, handleStay }) => {
    const ref = useRef(null);
    useOnClickOutside(ref, handleStay);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={ref} className="w-96 bg-white rounded-lg shadow-lg p-6">
        <p className="text-lg mb-4">Czy na pewno chcesz opuścić spotkanie?</p>
        <div className="flex justify-end">
          <button
            onClick={handleStay}
            className={clsx(
              'mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg text-sm px-5 py-2.5',
              'text-center transition ease-out duration-200 focus:outline-none focus:ring-4 focus:ring-blue-400 dark:focus:ring-purple-800'
            )}>
            Stay
          </button>
          <button
            onClick={handleLeave}
            className={clsx(
              'bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm px-5 py-2.5',
              'text-center transition ease-out duration-200 focus:outline-none focus:ring-4 focus:ring-blue-400 dark:focus:ring-purple-800'
            )}>
            Leave the meeting
          </button>
        </div>
      </div>
    </div>
  );
};


ConfirmLeaving.propTypes = {
  handleLeave: PropTypes.func.isRequired,
  handleStay: PropTypes.func.isRequired,
};

export default ConfirmLeaving;

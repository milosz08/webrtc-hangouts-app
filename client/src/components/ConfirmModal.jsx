'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import { useRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useOnClickOutside } from 'usehooks-ts';

const ConfirmModal = ({ handleNeg, handlePos, question, pos, neg }) => {
  const ref = useRef(null);
  useOnClickOutside(ref, handlePos);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={ref} className="w-96 bg-white rounded-lg shadow-lg p-6">
        <p className="text-lg mb-4">{question}</p>
        <div className="flex justify-end">
          <button
            onClick={handlePos}
            className={clsx(
              'mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg text-sm px-5 py-2.5',
              'text-center transition ease-out duration-200 focus:outline-none focus:ring-4 focus:ring-blue-400 dark:focus:ring-purple-800'
            )}>
            {pos}
          </button>
          <button
            onClick={handleNeg}
            className={clsx(
              'bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm px-5 py-2.5',
              'text-center transition ease-out duration-200 focus:outline-none focus:ring-4 focus:ring-blue-400 dark:focus:ring-purple-800'
            )}>
            {neg}
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmModal.propTypes = {
  handleNeg: PropTypes.func.isRequired,
  handlePos: PropTypes.func.isRequired,
  question: PropTypes.string.isRequired,
  pos: PropTypes.string.isRequired,
  neg: PropTypes.string.isRequired,
};

export default ConfirmModal;

'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import { forwardRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const CustomButton = forwardRef(
  ({ type, hasAnimation, children, ...rest }, ref) => (
    <button
      ref={ref}
      type={type || 'button'}
      className={clsx(
        'w-full text-white bg-gradient-to-br from-purple-500 to-blue-400 dark:from-purple-800 dark:to-blue-400 font-medium',
        'rounded-lg text-sm px-5 py-2.5 text-center hover:from-purple-600 hover:to-blue-500 dark:hover:from-purple-900',
        'dark:hover:to-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-400 dark:focus:ring-purple-800',
        {
          'transition ease-out hover:scale-110 duration-200': hasAnimation,
        }
      )}
      {...rest}>
      {children}
    </button>
  )
);

CustomButton.displayName = 'button';

CustomButton.propTypes = {
  type: PropTypes.oneOf(['button', 'submit']),
  hasAnimation: PropTypes.bool,
  children: PropTypes.node.isRequired,
  rest: PropTypes.any,
};

export default CustomButton;

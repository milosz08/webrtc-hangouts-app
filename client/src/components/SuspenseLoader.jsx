'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import useDarkMode from '../hooks/useDarkMode';

const SuspenseLoader = () => {
  useDarkMode();

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-custom-blue dark:bg-dark-blue">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-500 dark:border-gray-300"></div>
    </div>
  );
};

export default SuspenseLoader;

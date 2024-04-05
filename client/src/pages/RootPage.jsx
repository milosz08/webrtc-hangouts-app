'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import { useState } from 'react';
import { Alert } from 'flowbite-react';
import DarkModeToggleButton from '../components/DarkModeToggleButton';

const RootPage = () => {
  const [modalVisibility, setmodalVisibility] = useState(true);

  return (
    <div className="bg-white dark:bg-gray-700 h-screen">
      <div className="p-2">
        <DarkModeToggleButton />
      </div>
      {modalVisibility && (
        <Alert
          color="success"
          onDismiss={() => setmodalVisibility(prevState => !prevState)}>
          <span className="font-medium">Info alert!</span> Change a few things
          up and try submitting again.
        </Alert>
      )}
    </div>
  );
};

export default RootPage;

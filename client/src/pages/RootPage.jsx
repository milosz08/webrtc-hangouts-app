'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import PinInput from '../components/PinInput';
import '../styles/RootPage.css';

const RootPage = () => {
  return (
    <div className="animated-background h-screen">
      <div className="pt-10 space-y-8">
        <h1 className="flex flex-wrap justify-center text-gray-600 dark:text-white text-2xl text-center">
          Enter pin to join meeting
        </h1>
        <PinInput />
      </div>
    </div>
  );
};

export default RootPage;

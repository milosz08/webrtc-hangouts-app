'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import MediaDevicePreview from '../components/MediaDevicePreview';
import PickMediaDevice from '../components/PickMediaDevice';
import PinInput from '../components/PinInput';
import MediaDevicesContextProvider from '../context/MediaDevicesContextProvider';
import '../styles/RootPage.css';

const RootPage = () => (
  <div className="animated-background animate-gradient flex-grow">
    <div className="pt-10 space-y-8 pb-10">
      <h1 className="flex flex-wrap justify-center text-gray-600 dark:text-white text-2xl text-center">
        Enter pin to join meeting
      </h1>
      <PinInput />
      <MediaDevicesContextProvider>
        <PickMediaDevice />
        <MediaDevicePreview />
      </MediaDevicesContextProvider>
    </div>
  </div>
);

export default RootPage;

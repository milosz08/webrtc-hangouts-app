'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import { useState } from 'react';
import {
  FaDoorOpen,
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
} from 'react-icons/fa';

const MeetingIcons = () => {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const toggleMic = () => {
    setMicOn(!micOn);
  };

  const toggleCam = () => {
    setCamOn(!camOn);
  };

  return (
    <div className="flex space-x-4 text-2xl">
      <button
        onClick={toggleMic}
        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-400">
        {micOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
      </button>
      <button
        onClick={toggleCam}
        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-400 ">
        {camOn ? <FaVideo /> : <FaVideoSlash />}
      </button>
      <button className="p-2 bg-red-500 text-white rounded-full hover:bg-red-400 ">
        <FaDoorOpen />
      </button>
    </div>
  );
};

export default MeetingIcons;

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
import { useNavigate } from 'react-router';
import { actionType, useAppContext } from '../context/AppContextProvider';
import { useSocket } from '../context/SocketProvider';

const MeetingIcons = () => {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const socket = useSocket();
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

  const toggleMic = () => {
    setMicOn(prevState => !prevState);
  };

  const toggleCam = () => {
    setCamOn(prevState => !prevState);
  };

  const leaveMeeting = () => {
    socket.emit('room:leave', {
      roomKey: state.roomKey,
      userSocketId: socket.id,
    });
    dispatch({ type: actionType.setRoomKey, value: '' });
    navigate('/');
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
      <button
        onClick={leaveMeeting}
        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-400 ">
        <FaDoorOpen />
      </button>
    </div>
  );
};

export default MeetingIcons;

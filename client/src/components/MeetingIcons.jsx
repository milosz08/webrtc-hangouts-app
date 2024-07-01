'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import { useState } from 'react';
import { Button } from 'flowbite-react';
import {
  FaBomb,
  FaDoorOpen,
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
} from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { actionType, useAppContext } from '../context/AppContextProvider';
import { useSocket } from '../context/SocketProvider';
import ConfirmModal from './ConfirmModal';

const iconProps = {
  size: 17,
};

const MeetingIcons = () => {
  const socket = useSocket();
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);
  const [showDestroyRoomConfirmation, setShowDestroyRoomConfirmation] =
    useState(false);
  const [showTurnOnVideoModal, setShowTurnOnVideoModal] = useState(false);
  const [showTurnOnAudioModal, setShowTurnOnAudioModal] = useState(false);

  const toggleMic = () => {
    if (state.isAudioOn) {
      dispatch({ type: actionType.toggleAudio, value: false });
    } else {
      setShowTurnOnAudioModal(true);
    }
  };

  const toggleCam = () => {
    if (state.isVideoOn) {
      dispatch({ type: actionType.toggleVideo, value: false });
    } else {
      setShowTurnOnVideoModal(true);
    }
  };

  const turnOnMic = () => {
    dispatch({ type: actionType.toggleAudio, value: true });
    setShowTurnOnAudioModal(false);
  };

  const turnOnCam = () => {
    dispatch({ type: actionType.toggleVideo, value: true });
    setShowTurnOnVideoModal(false);
  };

  const leaveMeeting = () => {
    socket.emit('room:leave', {
      roomKey: state.roomKey,
      userSocketId: socket.id,
    });
    dispatch({ type: actionType.leaveSession });
    navigate('/');
  };

  const destroyRoom = () => {
    socket.emit('room:close', {
      roomKey: state.roomKey,
      invokeBy: 'REMOTE HOST',
    });
    dispatch({ type: actionType.leaveSession });
    navigate('/');
  };

  const confirmLeaveMeeting = () => {
    leaveMeeting();
    setShowLeaveConfirmation(false);
  };

  const confirmDestroyRoomMeeting = () => {
    destroyRoom();
    setShowDestroyRoomConfirmation(false);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row w-full sm:w-fit items-center gap-2">
        <div className="flex gap-2">
          <Button
            onClick={toggleMic}
            className="items-center"
            disabled={!state.selectedAudioDevice.id}>
            {!state.isAudioOn || state.isMuted ? (
              <FaMicrophoneSlash {...iconProps} />
            ) : (
              <FaMicrophone {...iconProps} />
            )}
          </Button>
          <Button
            onClick={toggleCam}
            className="items-center"
            disabled={!state.selectedVideoDevice.id}>
            {state.isVideoOn ? (
              <FaVideo {...iconProps} />
            ) : (
              <FaVideoSlash {...iconProps} />
            )}
          </Button>
          <Button
            onClick={() => setShowLeaveConfirmation(true)}
            color="red"
            className="items-center">
            <FaDoorOpen {...iconProps} />
          </Button>
          {state.isHost && (
            <Button
              onClick={() => setShowDestroyRoomConfirmation(true)}
              color="red"
              className="items-center">
              <FaBomb {...iconProps} />
            </Button>
          )}
        </div>
      </div>
      {showLeaveConfirmation && (
        <ConfirmModal
          handleNeg={confirmLeaveMeeting}
          handlePos={() => setShowLeaveConfirmation(false)}
          question="Are you sure you want to leave this meeting?"
          neg="Leave the meeting"
          pos="Stay"
        />
      )}
      {showTurnOnVideoModal && (
        <ConfirmModal
          handleNeg={() => setShowTurnOnVideoModal(false)}
          handlePos={turnOnCam}
          question="Are you sure you want to turn on your camera?"
          neg="No"
          pos="Yes"
        />
      )}
      {showTurnOnAudioModal && (
        <ConfirmModal
          handleNeg={() => setShowTurnOnAudioModal(false)}
          handlePos={turnOnMic}
          question="Are you sure you want to turn on your microphone?"
          neg="No"
          pos="Yes"
        />
      )}
      {showDestroyRoomConfirmation && state.isHost && (
        <ConfirmModal
          handleNeg={() => setShowDestroyRoomConfirmation(false)}
          handlePos={confirmDestroyRoomMeeting}
          question="Are you sure you want to destroy this room and end session?"
          neg="No"
          pos="Yes"
        />
      )}
    </>
  );
};

export default MeetingIcons;

'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import { useCallback, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router';
import { actionType, useAppContext } from '../context/AppContextProvider';
import { useSocket } from '../context/SocketProvider';

const useMeetingRoomSocket = ({ peers, setPeers, cameras, setCameras }) => {
  const socket = useSocket();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { dispatch } = useAppContext();

  const onParticipantJoined = useCallback(
    participantData => {
      const { message, ...rest } = participantData;
      setCameras(prevCameras => [
        ...prevCameras,
        {
          ...rest,
          isHost: false,
        },
      ]);
      enqueueSnackbar(message);
    },
    [enqueueSnackbar, setCameras]
  );

  const onParticipantLeaved = useCallback(
    ({ message, participant, reassigned, newHost }) => {
      setCameras(prevCameras =>
        prevCameras
          .filter(cam => cam.socketId !== participant.socketId)
          .map(cam => {
            if (reassigned) {
              cam.isHost = cam.socketId === newHost.socketId;
              if (cam.isHost) {
                dispatch({ type: actionType.setIsHost, value: true });
              }
            }
            return cam;
          })
      );
      const peerId = participant.peerId;
      if (peers[peerId]) {
        peers[peerId].close();
      }
      enqueueSnackbar(message);
    },
    [dispatch, enqueueSnackbar, peers, setCameras]
  );

  const getRoomParticipants = useCallback(
    ({ host, participants }) => {
      setCameras(
        participants.map(participant => ({
          ...participant,
          isHost: host.socketId === participant.socketId,
        }))
      );
      dispatch({
        type: actionType.setIsHost,
        value: host.socketId === socket.id,
      });
    },
    [dispatch, setCameras, socket.id]
  );

  const onDeleteRoom = useCallback(
    ({ message }) => {
      Object.values(peers).forEach(call => call.close());
      setPeers({});
      setCameras([]);
      enqueueSnackbar(message);
      navigate('/');
    },
    [enqueueSnackbar, navigate, peers, setCameras, setPeers]
  );

  const onUpdateUserNickname = useCallback(
    ({ updatedNickname, userSocketId, message }) => {
      const prevCameras = [...cameras];
      const userIndex = prevCameras.findIndex(
        ({ socketId }) => userSocketId === socketId
      );
      if (userIndex !== -1) {
        prevCameras[userIndex].nickname = updatedNickname;
      }
      setCameras(prevCameras);
      enqueueSnackbar(message);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cameras, enqueueSnackbar]
  );

  useEffect(() => {
    socket.on('room:participant-joined', onParticipantJoined);
    socket.on('room:participant-leaved', onParticipantLeaved);
    socket.on('room:participants', getRoomParticipants);
    socket.on('room:update-nickname', onUpdateUserNickname);
    socket.on('room:deleted', onDeleteRoom);
    return () => {
      socket.off('room:participant-joined', onParticipantJoined);
      socket.off('room:participant-leaved', onParticipantLeaved);
      socket.off('room:participants', getRoomParticipants);
      socket.off('room:update-nickname', onUpdateUserNickname);
      socket.off('room:deleted', onDeleteRoom);

      // Object.values(peers).forEach(call => call.close());
    };
  }, [
    socket,
    onParticipantJoined,
    onParticipantLeaved,
    getRoomParticipants,
    onUpdateUserNickname,
    onDeleteRoom,
    peers,
  ]);
};

export default useMeetingRoomSocket;

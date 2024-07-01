'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router';
import { actionType, useAppContext } from '../context/AppContextProvider';
import { usePeer } from '../context/PeerProvider';
import { useSocket } from '../context/SocketProvider';
import { aspectRatio } from '../utils/const';
import useDidUpdateEffect from './useDidUpdateEffect';

const useMeetingRoomPeerConnection = ({ setCameras }) => {
  const { state, dispatch } = useAppContext();
  const socket = useSocket();
  const { peer } = usePeer();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [localStream, setLocalStream] = useState();
  const [peers, setPeers] = useState({});
  const [streams, setStreams] = useState({});

  const setVideoStream = (stream, peerId) => {
    setStreams(prevStreams => ({
      ...prevStreams,
      [peerId]: stream,
    }));
  };

  const deleteVideoStream = peerId => {
    setStreams(prevStreams => {
      const streams = { ...prevStreams };
      delete streams[peerId];
      return streams;
    });
  };

  const updateCamerasProperty = useCallback(
    (peerId, message, propName, value) => {
      setCameras(prevCams =>
        prevCams.map(cam => {
          if (cam.peerId === peerId) {
            cam[propName] = value;
          }
          return cam;
        })
      );
      if (peerId !== peer.id) {
        enqueueSnackbar(message);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enqueueSnackbar, setCameras]
  );

  const videoToggleResponse = useCallback(
    ({ peerId, state, message }) =>
      updateCamerasProperty(peerId, message, 'isVideoOn', state),
    [updateCamerasProperty]
  );

  const audioToggleResponse = useCallback(
    ({ peerId, state, message }) =>
      updateCamerasProperty(peerId, message, 'isAudioOn', state),
    [updateCamerasProperty]
  );

  const onNewPeerConnection = useCallback(
    ({ peerId }) => {
      if (peerId != peer.id && !peers[peerId]) {
        const call = peer.call(peerId, localStream);
        call.on('stream', userVideoStream => {
          setVideoStream(userVideoStream, peerId);
          setPeers(prevState => ({
            ...prevState,
            [peerId]: call,
          }));
        });
        call.on('close', () => deleteVideoStream(peerId));
      }
    },
    [localStream, peer, peers]
  );

  const onMediaDeviceDisconnected = () => {
    socket.emit('room:leave', {
      roomKey: state.roomKey,
      userSocketId: socket.id,
    });
    dispatch({ type: actionType.setDevicesInitState });
    dispatch({ type: actionType.leaveSession });
    navigate('/');
    enqueueSnackbar('Media device has been disconnected.');
  };

  // toggle video
  useDidUpdateEffect(() => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = state.isVideoOn;
      });
      socket.emit('peer:video-toggle', {
        roomKey: state.roomKey,
        peerId: peer.id,
        state: state.isVideoOn,
      });
    }
  }, [state.isVideoOn]);

  // toggle audio
  useDidUpdateEffect(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = state.isAudioOn;
      });
      socket.emit('peer:audio-toggle', {
        roomKey: state.roomKey,
        peerId: peer.id,
        state: state.isAudioOn,
      });
    }
  }, [state.isAudioOn]);

  // on new peer connection request
  useDidUpdateEffect(() => {
    if (localStream) {
      socket.emit('peer:connection-request', {
        roomKey: state.roomKey,
        peerId: peer.id,
      });
    }
  }, [localStream]);

  useEffect(() => {
    const videoId = state.selectedVideoDevice.id;
    const audioId = state.selectedAudioDevice.id;
    const grabVideoStream = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoId
          ? {
              deviceId: { exact: videoId },
              aspectRatio: aspectRatio,
            }
          : false,
        audio: audioId ? { exact: audioId } : false,
      });
      if (videoId) {
        stream.getVideoTracks().forEach(track => {
          track.enabled = state.isVideoOn;
          track.onended = onMediaDeviceDisconnected;
        });
      }
      if (audioId) {
        stream.getAudioTracks().forEach(track => {
          track.enabled = state.isAudioOn;
          track.onended = onMediaDeviceDisconnected;
        });
      }
      setVideoStream(stream, peer.id);
      peer.on('call', call => {
        call.answer(stream);
        call.on('stream', userVideoStream => {
          if (!peers[call.peer]) {
            setVideoStream(userVideoStream, call.peer);
          }
        });
        call.on('close', () => deleteVideoStream(call.peer));
      });
      setLocalStream(stream);
    };
    grabVideoStream();
    return () => {
      localStream?.getTracks().forEach(track => track?.stop());
      Object.values(streams).forEach(stream =>
        stream?.getTracks().forEach(track => track?.stop())
      );
      setPeers({});
      setStreams({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socket.on('peer:connection-accepted', onNewPeerConnection);
    socket.on('peer:video-toggle-response', videoToggleResponse);
    socket.on('peer:audio-toggle-response', audioToggleResponse);
    return () => {
      socket.off('peer:connection-accepted', onNewPeerConnection);
      socket.off('peer:video-toggle-response', videoToggleResponse);
      socket.off('peer:audio-toggle-response', audioToggleResponse);
    };
  }, [socket, onNewPeerConnection, videoToggleResponse, audioToggleResponse]);

  return {
    peers,
    setPeers,
    streams,
    setStreams,
  };
};

export default useMeetingRoomPeerConnection;

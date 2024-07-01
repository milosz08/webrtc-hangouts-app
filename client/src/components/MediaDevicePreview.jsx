'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import { useEffect, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import { actionType, useAppContext } from '../context/AppContextProvider';
import { useMediaDevicesContext } from '../context/MediaDevicesContextProvider';
import useDidUpdateEffect from '../hooks/useDidUpdateEffect';
import { aspectRatio } from '../utils/const';
import CameraWindow from './CameraWindow';

const MediaDevicePreview = () => {
  const { state, dispatch } = useAppContext();
  const { enqueueSnackbar } = useSnackbar();
  const { setAudioDevices, setVideoDevices } = useMediaDevicesContext();

  const videoRef = useRef(null);
  const [localStream, setLocalStream] = useState();

  const handleVideoDeviceDisconnected = () => {
    setVideoDevices(prevDevices =>
      prevDevices.filter(({ name }) => name !== state.selectedVideoDevice.name)
    );
    dispatch({ type: actionType.setVideoDeviceInitState });
  };

  const handleAudioDeviceDisconnected = () => {
    setAudioDevices(prevDevices =>
      prevDevices.filter(({ name }) => name !== state.selectedAudioDevice.name)
    );
    dispatch({ type: actionType.setAudioDeviceInitState });
  };

  useEffect(() => {
    const videoId = state.selectedVideoDevice.id;
    const audioId = state.selectedAudioDevice.id;
    const toggleVideoDevice = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: videoId
            ? {
                deviceId: {
                  exact: videoId,
                },
                aspectRatio: aspectRatio,
              }
            : false,
          audio: audioId
            ? {
                deviceId: {
                  exact: audioId,
                },
              }
            : false,
        });
        if (videoId) {
          stream.getVideoTracks().forEach(track => {
            track.onended = handleVideoDeviceDisconnected;
            track.enabled = state.isVideoOn;
          });
        }
        if (audioId) {
          stream.getAudioTracks().forEach(track => {
            track.onended = handleAudioDeviceDisconnected;
            track.enabled = state.isAudioOn;
          });
        }
        if (localStream) {
          localStream.getTracks().forEach(track => track.stop());
        }
        videoRef.current.srcObject = stream;
        setLocalStream(stream);
      } catch (error) {
        if (!(error instanceof TypeError) && error.message) {
          enqueueSnackbar(error.message, 'error');
        }
        if (videoId) {
          dispatch({
            type: actionType.selectVideoDevice,
            value: { id: '', name: 'Not selected (video input)' },
          });
          dispatch({ type: actionType.toggleVideo, value: false });
        } else if (audioId) {
          dispatch({
            type: actionType.selectVideoDevice,
            value: { id: '', name: 'Not selected (audio input)' },
          });
          dispatch({ type: actionType.toggleAudio, value: false });
        }
      }
    };
    if (videoId || audioId) {
      toggleVideoDevice();
    } else {
      if (!videoId) {
        dispatch({ type: actionType.toggleVideo, value: false });
      } else if (!audioId) {
        dispatch({ type: actionType.toggleAudio, value: false });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedVideoDevice.id, state.selectedAudioDevice.id]);

  useDidUpdateEffect(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = state.isAudioOn;
      });
    }
  }, [state.isAudioOn]);

  useDidUpdateEffect(() => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = state.isVideoOn;
      });
    }
  }, [state.isVideoOn]);

  useEffect(() => {
    const current = videoRef.current;
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => {
          track.onended = null;
          track.stop();
        });
        setLocalStream(null);
        current.srcObject = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-[600px]">
      <CameraWindow
        nickname={state.nickname}
        isVideoOn={state.isVideoOn}
        isAudioOn={state.isAudioOn}
        isMuted={false}
        videoRef={videoRef}
      />
    </div>
  );
};

export default MediaDevicePreview;

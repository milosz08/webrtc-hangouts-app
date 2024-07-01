'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import { useEffect } from 'react';
import equal from 'array-equal';
import { Checkbox, Dropdown, Label } from 'flowbite-react';
import { useInterval } from 'react-interval-hook';
import { actionType, useAppContext } from '../context/AppContextProvider';
import { useMediaDevicesContext } from '../context/MediaDevicesContextProvider';

const devicesChanged = (oldDevices, newDevices) =>
  newDevices.length !== oldDevices.length ||
  !equal(
    oldDevices.map(({ id }) => id),
    newDevices.map(({ deviceId }) => deviceId)
  );

const PickMediaDevice = () => {
  const { state, dispatch } = useAppContext();
  const { videoDevices, audioDevices, setAudioDevices, setVideoDevices } =
    useMediaDevicesContext();

  const changeMediaDevice = (
    type,
    devices,
    stateDevices,
    selectedDevice,
    emptyActionType,
    callback,
    placeholder
  ) => {
    const mediaDevices = devices.filter(({ kind }) => kind === type);
    const notChooseDevice = { name: placeholder, id: '' };
    if (devicesChanged(stateDevices, mediaDevices)) {
      if (!mediaDevices.some(({ label }) => label === selectedDevice.name)) {
        dispatch({
          type: emptyActionType,
          value: notChooseDevice,
        });
      }
      callback([
        notChooseDevice,
        ...mediaDevices.map(({ deviceId, label }) => ({
          id: deviceId,
          name: label,
        })),
      ]);
    }
  };

  const { start, stop } = useInterval(() => {
    const checkDevices = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      changeMediaDevice(
        'audioinput',
        devices,
        audioDevices,
        state.selectedAudioDevice,
        actionType.selectAudioDevice,
        setAudioDevices,
        'Not selected (audio input)'
      );
      changeMediaDevice(
        'videoinput',
        devices,
        videoDevices,
        state.selectedVideoDevice,
        actionType.selectVideoDevice,
        setVideoDevices,
        'Not selected (video input)'
      );
    };
    checkDevices();
  });

  useEffect(() => {
    start();
    return () => {
      stop();
    };
  }, [start, stop]);

  useEffect(() => {
    // only for browser accept media devices
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then(r => r);
  }, []);

  return (
    <>
      <div className="flex flex-col sm:flex-row w-full sm:w-fit items-center gap-2 mx-auto">
        <Dropdown label={state.selectedVideoDevice.name}>
          {videoDevices.map(({ id, name }) => (
            <Dropdown.Item
              key={`${id}-${name}`}
              onClick={() =>
                dispatch({
                  type: actionType.selectVideoDevice,
                  value: { id, name },
                })
              }>
              {name || `Cam: ${id}`}
            </Dropdown.Item>
          ))}
        </Dropdown>
        <Dropdown label={state.selectedAudioDevice.name}>
          {audioDevices.map(({ id, name }) => (
            <Dropdown.Item
              key={`${id}-${name}`}
              onClick={() =>
                dispatch({
                  type: actionType.selectAudioDevice,
                  value: { id, name },
                })
              }>
              {name || `Mic: ${id}`}
            </Dropdown.Item>
          ))}
        </Dropdown>
      </div>
      <div className="flex flex-col gap-2 w-fit mx-auto">
        <div className="flex items-center">
          <Checkbox
            id="hideMyVideo"
            className="disabled:opacity-50"
            checked={!state.isVideoOn}
            onChange={e =>
              dispatch({
                type: actionType.toggleVideo,
                value: !e.target.checked,
              })
            }
            disabled={!state.selectedVideoDevice.id}
          />
          <Label htmlFor="hideMyVideo" className="ms-2">
            Hide my video at entrance
          </Label>
        </div>
        <div className="flex items-center">
          <Checkbox
            id="hideMyAudio"
            className="disabled:opacity-50"
            checked={!state.isAudioOn}
            onChange={e =>
              dispatch({
                type: actionType.toggleAudio,
                value: !e.target.checked,
              })
            }
            disabled={!state.selectedAudioDevice.id}
          />
          <Label htmlFor="hideMyAudio" className="ms-2">
            Mute my audio input at entrance
          </Label>
        </div>
      </div>
    </>
  );
};

export default PickMediaDevice;

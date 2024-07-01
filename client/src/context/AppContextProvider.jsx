'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import { createContext, useContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { generateDefaultNickname } from '../utils/nicknameUtils';

const AppContext = createContext(null);

export const actionType = {
  setNickname: 'setNickname',
  setRoomKey: 'setRoomKey',
  setIsHost: 'setIsHost',
  selectVideoDevice: 'selectVideoDevice',
  selectAudioDevice: 'selectAudioDevice',
  toggleVideo: 'toggleVideo',
  toggleAudio: 'toggleAudio',
  leaveSession: 'leaveSession',
  setDevicesInitState: 'setDevicesInitState',
  setAudioDeviceInitState: 'setAudioDeviceInitState',
  setVideoDeviceInitState: 'setVideoDeviceInitState',
};

const defaultVideoSelect = {
  name: 'Not selected (video input)',
  id: '',
};

const defaultAudioSelect = {
  name: 'Not selected (audio input)',
  id: '',
};

const initState = {
  nickname: '',
  roomKey: '',
  isHost: false,
  selectedVideoDevice: defaultVideoSelect,
  selectedAudioDevice: defaultAudioSelect,
  isVideoOn: false,
  isAudioOn: false,
};

const reducer = (state, { type, value }) => {
  switch (type) {
    case actionType.setNickname:
      return {
        ...state,
        nickname: value,
      };
    case actionType.setRoomKey:
      return {
        ...state,
        roomKey: value,
      };
    case actionType.setIsHost:
      return {
        ...state,
        isHost: value,
      };
    case actionType.selectVideoDevice:
      return {
        ...state,
        selectedVideoDevice: value,
      };
    case actionType.selectAudioDevice:
      return {
        ...state,
        selectedAudioDevice: value,
      };
    case actionType.toggleVideo:
      return {
        ...state,
        isVideoOn: value,
      };
    case actionType.toggleAudio:
      return {
        ...state,
        isAudioOn: value,
      };
    case actionType.setDevicesInitState:
      return {
        ...state,
        isVideoOn: false,
        isAudioOn: false,
        selectedVideoDevice: defaultVideoSelect,
        selectedAudioDevice: defaultAudioSelect,
      };
    case actionType.setAudioDeviceInitState:
      return {
        ...state,
        isAudioOn: false,
        selectedAudioDevice: defaultAudioSelect,
      };
    case actionType.setVideoDeviceInitState:
      return {
        ...state,
        isVideoOn: false,
        selectedVideoDevice: defaultVideoSelect,
      };
    case actionType.leaveSession:
      return {
        ...state,
        roomKey: '',
        isHost: false,
      };
    default:
      throw new Error(`Unknown action type: ${state}`);
  }
};

export const useAppContext = () => {
  return useContext(AppContext);
};

const AppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initState);

  useEffect(() => {
    const storedNickname = localStorage.getItem('nickname');
    dispatch({
      type: actionType.setNickname,
      value: storedNickname
        ? storedNickname.substring(0, 30)
        : generateDefaultNickname(),
    });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

AppContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppContextProvider;

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
};

const initState = {
  nickname: '',
  roomKey: '',
  isHost: false,
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

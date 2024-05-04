'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import { createContext, useContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { UniqueOTP } from 'unique-string-generator';

const AppContext = createContext(null);

export const actionType = {
  setNickname: 'setNickname',
  setRoomKey: 'setRoomKey',
};

const initState = {
  nickname: '',
  roomKey: '',
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
    default:
      throw new Error(`Unknow action type: ${state}`);
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
        : `Guest${UniqueOTP(5)}`,
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

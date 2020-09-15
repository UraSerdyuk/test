import { REQUEST_USER_DATA, UPDATE_USER_DATA, FAILURE_RECEIVE_USER } from '../types/user.types';
import { socketDisconnect } from './connection.action';
export const requestUserData = (data) => ({
  type: REQUEST_USER_DATA,
  payload: data,
});

export const updateUserData = (data) => ({
  type: UPDATE_USER_DATA,
  payload: data,
});

export const failureReceiveUserData = (error) => ({
  type: FAILURE_RECEIVE_USER,
  payload: error,
});

export const logOutResetUpdates = () => (dispatch) => {
  try {
    dispatch({ type: 'RESET_DATA' });
    dispatch(socketDisconnect());
  } catch (error) {
    dispatch(failureReceiveUserData(error));
  }
};

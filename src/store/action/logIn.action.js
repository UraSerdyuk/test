import { LOGIN, LOGOUT, FAILURE_LOGIN } from '../types/logIn.types';
import { updateUserData } from './user.action';
import { getSnackbarMessage } from './snackbar.action';
import apiService from '../../api';
import { SNACKBAR_MESSAGE_TYPES } from '../../constants/misk.constant';

export const logIn = (user) => ({
  type: LOGIN,
  payload: user,
});

export const logOut = () => ({
  type: LOGOUT,
  payload: false,
});

export const failureLogIn = (err) => ({
  type: FAILURE_LOGIN,
  payload: err,
});
export const failureSignUp = (err) => ({
  type: 'FAILURE_SIGN_UP',
  payload: err,
});

export const SignUpUser = (user) => async (dispatch) => {
  try {
    const data = await apiService.SignUp(user);
    dispatch(logIn(data));
    dispatch(updateUserData(data));
  } catch (error) {
    dispatch(failureSignUp(error));
  }
};

export const fetchAuthentication = (obj) => async (dispatch) => {
  try {
    const data = await apiService.logIn(obj);
    dispatch(logIn(data));
    dispatch(updateUserData(data));
    dispatch(getSnackbarMessage(data.snackbarMessage));
  } catch (error) {
    dispatch(getSnackbarMessage({ text: 'Failure Login!', variant: SNACKBAR_MESSAGE_TYPES.ERROR }));
    dispatch(failureLogIn(error));
  }
};

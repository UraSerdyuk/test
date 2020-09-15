// import { MESSAGE, SUCCESS, ERROR } from '../types/modals.types';

export const getSnackbarMessage = (payload) => ({
  type: 'MESSAGE',
  payload,
});

export const getSnackbarEroor = (errorMessage) => ({
  type: 'ERROR',
  payload: errorMessage,
});

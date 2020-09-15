import {
  REQUEST_SENDING_DATA,
  UPDATE_UPLOAD_DATA,
  UPDATE_LOCAL_DATA,
  FAILURE_RECEIVE_TRANSFER,
} from '../types/transfer.types';
import apiService from '../../api';

export const requestTransferData = () => {
  return {
    type: REQUEST_SENDING_DATA,
  };
};

export const uploadTransferData = (files) => {
  return {
    type: UPDATE_UPLOAD_DATA,
    payload: files,
  };
};

export const failureReceiveTransfer = (error) => {
  return {
    type: FAILURE_RECEIVE_TRANSFER,
    payload: error,
  };
};

export const updateLocalStorageData = (data) => {
  return {
    type: UPDATE_LOCAL_DATA,
    payload: data,
  };
};

export const postDataToServer = (files) => async (dispatch) => {
  dispatch(requestTransferData());
  const response = await apiService.postUploadedData(files);
  dispatch(uploadTransferData(response));
  try {
    await apiService.getLogOut();
  } catch (error) {
    dispatch(failureReceiveTransfer(error));
  }
};

export const fetchDataFromServer = (files) => async (dispatch) => {
  dispatch(requestTransferData());
  const response = await apiService.getUploadedData(files);
  dispatch(uploadTransferData(response));
  try {
    await apiService.getLogOut();
  } catch (error) {
    dispatch(failureReceiveTransfer(error));
  }
};

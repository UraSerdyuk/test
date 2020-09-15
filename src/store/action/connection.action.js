import {
  IS_CONNECTED,
  IS_DISCONNECTED,
  SET_SOCKET_ID,
  SET_SAME_CLIENTS_CONNECTION,
} from '../types/connection.types';

export const socketConnect = () => ({
  type: IS_CONNECTED,
  payload: true,
});

export const socketDisconnect = () => ({
  type: IS_DISCONNECTED,
  payload: false,
});

export const setSocketID = (ID) => ({
  type: SET_SOCKET_ID,
  payload: ID,
});

export const setSameClientsConnected = (clients) => ({
  type: SET_SAME_CLIENTS_CONNECTION,
  payload: clients,
});

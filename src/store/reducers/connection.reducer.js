import {
  IS_CONNECTED,
  SET_SAME_CLIENTS_CONNECTION,
  IS_DISCONNECTED,
  SET_SOCKET_ID,
} from '../types/connection.types';
import { socketIndicators } from '../../constants/connection.constants';

const initialState = {
  isSocketConnected: false,
  socketID: null,
  theSameClientsConnection: [],
  status: null,
};

const Connection = (state = initialState, action) => {
  switch (action.type) {
    case IS_CONNECTED:
      return {
        ...state,
        isSocketConnected: action.payload,
        status: socketIndicators.ESTABLISHED,
      };
    case SET_SAME_CLIENTS_CONNECTION:
      return {
        ...state,
        theSameClientsConnection: action.payload,
      };
    case IS_DISCONNECTED:
      return {
        ...state,
        isSocketConnected: action.payload,
        status: socketIndicators.TRYING_TO_CONNECT,
      };
    case SET_SOCKET_ID:
      return {
        ...state,
        socketID: action.payload,
      };
    default:
      return state;
  }
};

export default Connection;

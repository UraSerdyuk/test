import { UPDATE_LOCAL_DATA } from '../types/transfer.types';

const initialState = {
  isTransfar: false,
  localStorageNotSaveEntry: [],
  procent: null,
  status: null,
  error: '',
};

const Trasfer = (state = initialState, action) => {
  switch (action.type) {
    case 'SEND':
      return {
        ...state,
      };
    case UPDATE_LOCAL_DATA:
      return {
        ...state,
        localStorageNotSaveEntry: action.payload,
      };

    case 'UPLOAD':
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default Trasfer;

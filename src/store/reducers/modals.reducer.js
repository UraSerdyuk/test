import { OPEN_MODAL, CLOSE_MODAL } from '../types/modals.types';

const initialState = {
  isVisible: false,
  id: null,
  payloads: null,
};

const modals = (state = initialState, { type, id, payload }) => {
  switch (type) {
    case OPEN_MODAL:
      return {
        ...state,
        isVisible: true,
        id,
        payloads: { ...payload },
      };
    case CLOSE_MODAL:
      return {
        ...state,
        isVisible: false,
        id: null,
      };
    default:
      return state;
  }
};

export default modals;

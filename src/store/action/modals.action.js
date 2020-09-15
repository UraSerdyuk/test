import { OPEN_MODAL, CLOSE_MODAL } from '../types/modals.types';

export const openModal = (id, payload) => ({
  type: OPEN_MODAL,
  id,
  payload,
});

export const closeModal = (id) => ({
  type: CLOSE_MODAL,
  id,
});

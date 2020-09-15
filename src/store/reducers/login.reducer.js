import { LOGIN, LOGOUT, FAILURE_LOGIN } from '../types/logIn.types';

const initialState = {
  isAuthorization: false,
  user: null,
  token: null,
  error: null,
};

const LogIn = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        token: action.payload.token,
        isAuthorization: true,
        user: action.payload.user,
      };
    case LOGOUT:
      return {
        authorization: action.payload,
        user: null,
        token: null,
        error: null,
      };
    case FAILURE_LOGIN:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default LogIn;

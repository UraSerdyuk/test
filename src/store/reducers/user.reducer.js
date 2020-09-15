import {
  REQUEST_USER_DATA,
  UPDATE_USER_DATA,
  FAILURE_RECEIVE_USER,
  RESET_DATA,
} from '../types/user.types';
const initialState = {
  uploadFiles: [],
  user: null,
  diary: [],
  teamSection: {
    currentTeam: null,
    teams: [],
    invitedToTeams: [],
  },
  error: '',
};

const UserData = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_USER_DATA:
      return {
        ...state,
      };
    case UPDATE_USER_DATA:
      const { user, uploadFiles, diary, teams, invitedToTeams } = action.payload;

      return {
        ...state,
        uploadFiles,
        user,
        diary: diary,
        teamSection: { ...state.teamSection, teams, invitedToTeams },
      };
    case RESET_DATA:
      return {
        uploadFiles: [],
        user: null,
        diary: [],
        teamSection: {
          currentTeam: null,
          teams: [],
        },
        error: '',
      };
    case FAILURE_RECEIVE_USER:
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default UserData;

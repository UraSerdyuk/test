module.exports.regType = {
  image: /^data:image\/\w+;base64,/,
  text: /^data:text\/\w+;base64,/,
  video: /^data:video\/\w+;base64,/,
  audio: /^data:audio\/\w+;base64,/,
  application: /^data:application\/\w+;base64,/,
};

module.exports.ROLE = {
  ADMIN: 'Admin',
  OPERATOR: 'Operator',
  MEMBER: 'Member',
};

module.exports.APP_ENDPOINTS = {
  LOGIN: '/login',
  HOME: '/home',
  DIARY: '/diary',
  SIGN_UP: '/signup',
  TEAM: '/team',
};

module.exports.API_ENDPOINTS = {
  LOGIN: '/api/login',
  SIGN_UP: '/api/signup',
};

module.exports.SOCKET_PROXI = {
  CONNECTION: 'connection',
  CONNECT: 'connect',
  ONLIINE: 'change-online',
  TEST: 'test',
  SET_CLIENT: 'setClient',
  SAVE_ENTRY: 'Save Entry',
  GET_ENTRY: 'Get Entry',
  DISCONNECT: 'disconnect',
  POST_UPLOADED_DATA: 'post uploaded data',
  CREATE_TEAM: 'createTeam',
  IS_HAS_USER_IN_BASE: 'isHasUserInDataBase',
  DELETE_TEAM: 'deleteTeam',
  INVITE_MEMBER: 'inviteMember',
  DELETE_MEMBER_FROM_TEAM: 'deleteMemberFromTeam',
  GET_TEAM_BY_ID: 'getTeamById',
  SET_ACTIVE_INACTIVE: 'setActiveInactive',
  SNACKBAR_MESSAGE: 'snackbarMessages',
  SET_NEW_TEAM_NAME: 'setNewTeamName',
  SET_NEW_TEAM_DESCRIPTION: 'setNewTeamDescription',
  SET_NEW_TEAM_COLOR: 'setNewTeamColor',
  SET_NEW_TEAM_ROLE: 'setNewTeamRole',
  DECRYPT_ENTRY_TEXT: 'decrypt-entry-text',
  DECRYPT_IMAGE: 'decrypt-image',
};

module.exports.SNACKBAR_MESSAGE_TYPES = {
  SUCCESS: 'success',
  WORNING: 'warning',
  INFO: 'info',
  ERROR: 'error',
};

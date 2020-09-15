import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import LogIn from './reducers/login.reducer';
import Connection from './reducers/connection.reducer';
import Trasfer from './reducers/transfer.reducer';
import UserData from './reducers/user.reducer';
import Modals from './reducers/modals.reducer';
import Snackbar from './reducers/snackbar.reducer';

const rootReducer = combineReducers({
  login: LogIn,
  userData: UserData,
  connection: Connection,
  transfer: Trasfer,
  modals: Modals,
  snackbar: Snackbar,
});

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;

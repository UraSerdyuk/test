import React from 'react';
import { connect } from 'react-redux';

import NavPanel from './NavPanel';
import { logOut } from '../../store/action/logIn.action';
import { logOutResetUpdates } from '../../store/action/user.action';

const NavPanelContainer = (props) => {
  const { logOut, logOutResetUpdates } = props;

  const logOutUser = () => {
    logOut();
  };
  return <NavPanel logOut={logOutUser} logOutResetUpdates={logOutResetUpdates} {...props} />;
};

const mapStateToProps = ({ transfer, connection, userData }) => {
  return {
    localStorageNotSaveEntry: transfer.localStorageNotSaveEntry,
    clients: connection.theSameClientsConnection,
    user: userData.user,
  };
};
const mapDispatchToProps = { logOut, logOutResetUpdates };

export default connect(mapStateToProps, mapDispatchToProps)(NavPanelContainer);

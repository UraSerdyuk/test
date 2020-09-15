import React, { useState } from 'react';
import { connect } from 'react-redux';

import Login from './Login';
import { fetchAuthentication } from '../../store/action/logIn.action';

const LoginContainer = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPasword] = useState('');
  const { fetchAuthentication } = props;
  const logIn = (user) => {
    fetchAuthentication(user);
  };
  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <Login
      email={email}
      setEmail={setEmail}
      password={password}
      setPasword={setPasword}
      logIn={logIn}
      handleSubmit={handleSubmit}
      {...props}
    />
  );
};

const mapStateToProps = (state) => {
  return { ...state };
};
const mapDispatchToProps = {
  fetchAuthentication,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);

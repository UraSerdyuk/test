import React, { useState } from 'react';
import { connect } from 'react-redux';

import { SignUpUser } from '../../store/action/logIn.action';
import SignUp from './SignUp';

const SingUpContainer = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPasword] = useState('');
  const [confirmPassword, setConfirmPasword] = useState('');
  const [role, setRole] = React.useState('');
  const { SignUpUser } = props;
  const isButtonSignUpValidate = !email.length;

  const signUp = () => {
    if (password === confirmPassword) {
      SignUpUser({ email, password, role });
    } else {
      alert('the pasword is not equal');
    }
  };

  return (
    <SignUp
      setEmail={setEmail}
      setPasword={setPasword}
      setConfirmPasword={setConfirmPasword}
      isButtonSignUpValidate={isButtonSignUpValidate}
      signUp={signUp}
      role={role}
      setRole={setRole}
      {...props}
    />
  );
};

const mapStateToProps = (state) => {
  return { ...state };
};
const mapDispatchToProps = {
  SignUpUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(SingUpContainer);

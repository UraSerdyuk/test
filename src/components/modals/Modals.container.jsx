import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { closeModal } from '../../store/action/modals.action';
import io from 'socket.io-client';

import Modal from './Modal';
import { updateUserData } from '../../store/action/user.action';

const ModalContainer = (props) => {
  const socket = io(window.location.origin);
  const { updateUserData } = props;
  useEffect(() => {
    socket.on('FilesChanged', (updateUserFiles) => {
      updateUserData(updateUserFiles);
    });
  }, [socket, updateUserData]);

  return <Modal socket={socket} {...props} />;
};

const mapStateToProps = ({ modals }) => {
  return { isVisible: modals.isVisible, id: modals.id, payloads: modals.payloads };
};
const mapDispatchToProps = { closeModal, updateUserData };

export default connect(mapStateToProps, mapDispatchToProps)(ModalContainer);

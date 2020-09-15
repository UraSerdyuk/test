import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useSnackbar } from 'notistack';
import { connect } from 'react-redux';

import Home from './Home';
import { socketConnect, socketDisconnect, setSocketID } from '../../store/action/connection.action';
import { updateLocalStorageData } from '../../store/action/transfer.action';
import { updateUserData } from '../../store/action/user.action';
import { openModal } from '../../store/action/modals.action';
import { toBase64, delay } from '../../utils/helpers';
import { sizeOneMegabyte } from '../../constants/misk.constant';

const HomeContainer = (props) => {
  const socket = io(window.location.origin);
  const { enqueueSnackbar } = useSnackbar();
  const { user, socketDisconnect, socketConnect, setSocketID, updateUserData } = props;
  const [files, setFiles] = useState(null);
  const [isMultiple, setIsMultiple] = useState(false);

  useEffect(() => {
    // display snackbarMessages message soket interaction
    socket.on('snackbarMessages', ({ text, variant }) => {
      enqueueSnackbar(text, { variant });
    });
  }, [enqueueSnackbar, socket]);

  // connect to sockec client-server
  useEffect(() => {
    socket.on('connect', (ID) => {
      socketConnect();
      setSocketID(ID);
      socket.emit('setClient', { soketId: ID, userId: user.id });
      socket.on('disconnect', (setSocketID) => socketDisconnect(setSocketID));
    });
  }, [setSocketID, socket, socketConnect, socketDisconnect, user.id]);

  // this func save upladed file to server
  const fileSelectedHendler = (event) => {
    const files = Array.from(event.target.files);
    const checkValidate = files.find((el) => el.size > sizeOneMegabyte);

    return !!checkValidate
      ? (() => {
          alert('one of the files is larger than 1 mb');
          setFiles(null);
        })()
      : setFiles(files);
  };

  // upload uploaded file to the server starage
  const postFiles = () => {
    async function delayedLog(item) {
      await delay(2000);
      let file = item;
      const regex = /^[a-z]+/gm;
      const type = regex.exec(file.type);

      (async function Main() {
        const obj = {
          name: file.name,
          size: file.size,
          type: file.type,
          user: user,
          base64Type: type && type[0],
          lastModified: file.lastModified,
          lastModifiedDate: file.lastModifiedDate,
          base64: await toBase64(file),
        };
        socket.emit('post uploaded data', obj);
      })();
    }

    async function processArray(array) {
      for (const item of array) {
        await delayedLog(item);
      }
      setFiles(null);
      console.log('All file successfully  Downloaded!');
    }

    processArray(files);
  };

  //if file successfully save update redux
  socket.on('FilesChanged', (updateUserFiles) => {
    updateUserData(updateUserFiles);
  });

  return (
    <Home
      isMultiple={isMultiple}
      setIsMultiple={setIsMultiple}
      isChoosedFile={files}
      fileSelectedHendler={fileSelectedHendler}
      postFiles={postFiles}
      {...props}
    />
  );
};

const mapStateToProps = ({ login, connection, userData }) => {
  return {
    isAuthorization: login.isAuthorization,
    token: login.token,
    user: login.user,
    socketId: connection.socketId,
    status: connection.status,
    userData: userData.uploadFiles,
    isSocketConnected: connection.isSocketConnected,
  };
};

const mapDispatchToProps = {
  socketConnect,
  socketDisconnect,
  setSocketID,
  updateLocalStorageData,
  updateUserData,
  openModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);

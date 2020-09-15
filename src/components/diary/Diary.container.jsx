import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import moment from 'moment';
import uniqid from 'uniqid';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';

import Diary from './Diary';
import { fetchAuthentication } from '../../store/action/logIn.action';
import { updateUserData } from '../../store/action/user.action';
import { updateLocalStorageData } from '../../store/action/transfer.action';
import { openModal } from '../../store/action/modals.action';

const DiaryContainer = (props) => {
  const socket = io(window.location.origin);
  const { enqueueSnackbar } = useSnackbar();
  const { user, updateUserData, isSocketConnected, openModal, updateLocalStorageData } = props;
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    // display snackbarMessages message soket interaction
    socket.on('snackbarMessages', ({ text, variant }) => {
      enqueueSnackbar(text, { variant });
    });
  }, [enqueueSnackbar, socket]);
  //update changes
  useEffect(() => {
    socket.on('FilesChanged', (updateUserFiles) => {
      updateUserData(updateUserFiles);
    });
  }, [socket, updateUserData]);
  //create new entry
  const createEntry = useCallback(() => {
    setEntries([
      {
        text: '',
        dateCreated: moment().format('LLLL'),
        dateLastUpdated: moment().format('LLLL'),
        id: uniqid(),
        encryption: {
          type: 'TEXT',
          encrypt: false,
          key: '',
        },
        images: [],
      },
    ]);
  }, []);
  //sawe entry
  const saveEntry = useCallback(
    (text, id, dateCreated, dateOfStartUpdate, updateEncryption, updateImages, encryption) => {
      const updateStorage = () => {
        setTimeout(() => {
          const storage = JSON.parse(localStorage.getItem('doNotSaveEntry'));
          updateLocalStorageData(storage);
        }, 3000);
      };

      //dont save empty entry
      if (!text) {
        enqueueSnackbar('EMPTY ENTRY', { variant: 'warning' });
        return;
      }

      //dond save if entry encrypt
      //only after updating or in updating
      // if (encryption.encrypt && !props.isUpdate) return;

      // //validate on js code
      if (
        text.length > 5 ||
        (text.includes('(') && text.includes(')')) ||
        (text.includes('{') && text.includes('}')) ||
        text.includes('let') ||
        text.includes('const') ||
        text.includes('var')
      ) {
        // check is text containe source code add  chars  ```  ```
        if (text.slice(0, 3) === '```' && text.slice(text.length - 3) === '```') {
        } else if (encryption.encrypt) {
        } else {
          text = `\`\`\`${text}\`\`\``;
        }
      }

      !isSocketConnected &&
        openModal('diary save to localStorage with the bad connection', {
          user,
          id,
          text,
          encryption: encryption.encrypt ? encryption : updateEncryption,
          images: updateImages,
          dateCreated,
          dateLastUpdated: moment().format('LLLL'),
        }) &&
        updateStorage();
      //check logick if user already update entry from another computer
      socket.emit('Get Entry', { user, entryId: id });
      socket.on('GetEntryFromServer', (entry) => {
        if (
          entry?.dateLastUpdated &&
          new Date(dateOfStartUpdate).getTime() < new Date(entry.dateLastUpdated).getTime()
        ) {
          openModal('You have already updated entry from another computer', {
            user,
            id,
            text,
            encryption: encryption.encrypt ? encryption : updateEncryption,
            images: updateImages,
            dateCreated,
            dateLastUpdated: moment().format('LLLL'),
          });
        } else {
          socket.emit('Save Entry', {
            user,
            id,
            text,
            encryption: encryption.encrypt ? encryption : updateEncryption,
            images: updateImages,
            dateCreated,
            dateOfStartUpdate,
            dateLastUpdated: moment().format('LLLL'),
          });
        }
      });
    },
    [enqueueSnackbar, isSocketConnected, openModal, socket, updateLocalStorageData, user],
  );

  return (
    <Diary
      createEntry={createEntry}
      entries={entries}
      saveEntry={saveEntry}
      setEntries={setEntries}
      socket={socket}
      {...props}
    />
  );
};

const mapStateToProps = ({ userData, connection }) => {
  return {
    diary: [...userData.diary].sort((el) => el.dateCreated).reverse(),
    user: userData.user,
    isSocketConnected: connection.isSocketConnected,
  };
};
const mapDispatchToProps = {
  fetchAuthentication,
  updateUserData,
  openModal,
  updateLocalStorageData,
};

export default connect(mapStateToProps, mapDispatchToProps)(DiaryContainer);

import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import { useSnackbar } from 'notistack';

import App from './App';
import { getLocalStarageParce, setToLocalStarage, delay } from '../../utils/helpers';
import { updateLocalStorageData } from '../../store/action/transfer.action';
import { updateUserData } from '../../store/action/user.action';
import { setSameClientsConnected } from '../../store/action/connection.action';
import { getSnackbarMessage } from '../../store/action/snackbar.action';

const AppContainer = (props) => {
  const { isSocketConnected, updateLocalStorageData, updateUserData, snackbar } = props;
  const socket = io(window.location.origin);
  const { enqueueSnackbar } = useSnackbar();
  // display snackbarMessages message api interaction
  useEffect(() => {
    if (snackbar?.text && snackbar?.variant) {
      const { text, variant } = snackbar;
      enqueueSnackbar(text, { variant });
    }
  }, [enqueueSnackbar, snackbar]);
  // set folder into localStarage
  useEffect(() => {
    if (!getLocalStarageParce('doNotSaveEntry')) {
      setToLocalStarage('doNotSaveEntry', []);
    }
  }, []);

  // check is client have don't update entry
  useEffect(() => {
    const storageEntries = getLocalStarageParce('doNotSaveEntry');

    if (storageEntries.length > 0 && isSocketConnected) {
      async function delayedLog(item) {
        await delay(500);
        let file = item;

        (async function Main() {
          const arr = getLocalStarageParce('doNotSaveEntry');
          const entryIndex = arr.map((e) => e.id).indexOf(file.id);
          const updateDontSaveEntriesArr = [
            ...arr.slice(0, entryIndex),
            ...arr.slice(entryIndex + 1),
          ];
          setToLocalStarage('doNotSaveEntry', updateDontSaveEntriesArr);
          socket.emit('Save Entry', file);
          const starage = getLocalStarageParce('doNotSaveEntry');
          updateLocalStorageData(starage);
        })();
      }

      async function processArray(array) {
        for (const item of array) {
          await delayedLog(item);
        }
        updateLocalStorageData(getLocalStarageParce('doNotSaveEntry'));
        console.log('All file successfully  Downloaded!');
      }

      processArray(storageEntries);
    }
  }, [isSocketConnected, socket, updateLocalStorageData]);

  //update store
  socket.on('FilesChanged', (updateUserFiles) => {
    updateUserData(updateUserFiles);
  });

  // display snackbarMessages message soket interaction
  socket.on('snackbarMessages', ({ text, variant }) => {
    enqueueSnackbar(text, { variant });
  });

  // online clients
  // useEffect(() => {
  //   socket.on('change-online', (online) => {
  //     const filterCLient = online.filter((el) => el.id === id);
  //     setSameClientsConnected(filterCLient);
  //   });
  // }, [id, setSameClientsConnected, socket]);

  return (
    <>
      <App {...props} />
    </>
  );
};

const mapStateToProps = ({ login, connection, user, snackbar }) => {
  return {
    isAuthorization: login.isAuthorization,
    isSocketConnected: connection.isSocketConnected,
    id: user && user.id,
    snackbar: snackbar,
  };
};

const mapDispatchToProps = {
  updateUserData,
  updateLocalStorageData,
  setSameClientsConnected,
  getSnackbarMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);

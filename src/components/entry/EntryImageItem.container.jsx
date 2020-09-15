import React, { useState } from 'react';
import { useSnackbar } from 'notistack';

import EntryImageItem from './EntryImageItem';

const EntryImageItemContainer = (props) => {
  const { image, encryptImages, socket } = props;
  const [encryptImageKey, setEncrypImagetKey] = useState('');
  const [decryptImageKey, setDecryptImageKey] = useState('');
  const [anchorImg, setAnchorImg] = React.useState(null);
  const [anchorElDecryptImage, setAnchorElDecryptImage] = React.useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = (event, identifier) => {
    identifier === 'imageEncrypt' && setAnchorImg(event.currentTarget);
    identifier === 'imageDecrypt' && setAnchorElDecryptImage(event.currentTarget);
  };

  const handleClose = (identifier) => {
    identifier === 'imageEncrypt' && setAnchorImg(null);
    identifier === 'imageDecrypt' && setAnchorElDecryptImage(null);
  };

  const checkIfEncryptImageKeyEmpty = () => {
    !encryptImageKey && enqueueSnackbar('ENCRYPT IMAGE KEY IS EMPTY', { variant: 'warning' });
    encryptImageKey && enqueueSnackbar('ENCRYPT IMAGE KEY IS ADDED', { variant: 'success' });
  };
  const encryptImage = () => {
    encryptImages({ ...image, encrypt: !!encryptImageKey, key: encryptImageKey });
    handleClose('imageEncrypt');
  };

  const decryptImage = (entryId, imageId, user) => {
    socket.emit('decrypt-image', { user, entryId, imageId, decryptImageKey });
  };

  return (
    <EntryImageItem
      encryptImageKey={encryptImageKey}
      setEncrypImagetKey={setEncrypImagetKey}
      anchorImg={anchorImg}
      setAnchorImg={setAnchorImg}
      handleClick={handleClick}
      handleClose={handleClose}
      checkIfEncryptImageKeyEmpty={checkIfEncryptImageKeyEmpty}
      updateImage={{ ...image, encrypt: !!encryptImageKey, key: encryptImageKey }}
      encryptImage={encryptImage}
      anchorElDecryptImage={anchorElDecryptImage}
      decryptImageKey={decryptImageKey}
      setDecryptImageKey={setDecryptImageKey}
      decryptImage={decryptImage}
      {...props}
    />
  );
};

export default EntryImageItemContainer;

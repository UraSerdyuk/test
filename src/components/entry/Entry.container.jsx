import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import uniqid from 'uniqid';
import { useSnackbar } from 'notistack';

import Entry from './Entry';
import { updateUserData } from '../../store/action/user.action';

const EntryContainer = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const { encryption, updateUserData, socket } = props;
  const [isUpdate, setIsUpdate] = useState(false);
  const [dateOfStartUpdate, setDateOfStartUpdate] = useState('');
  const [entryText, setEntryText] = useState('');
  const [encryptKey, setEncryptKey] = useState('');
  const [decryptKey, setDecryptKey] = useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElDecrypt, setAnchorElDecrypt] = React.useState(null);
  const [imgUrl, setImgUrl] = useState('');
  const [updateImages, setUpdateImages] = useState([]);

  useEffect(() => {
    setUpdateImages([...props.images]);
  }, [props.images]);

  useEffect(() => {
    socket.on('FilesChanged', (updateUserFiles) => {
      updateUserData(updateUserFiles);
    });
  }, [socket, updateUserData]);

  const handleClick = (event, identifier) => {
    identifier === 'decrypt' && setAnchorElDecrypt(event.currentTarget);
    identifier === 'encrypt' && setAnchorEl(event.currentTarget);
  };

  const handleClose = (identifier) => {
    identifier === 'decrypt' && setAnchorElDecrypt(null);
    identifier === 'encrypt' && setAnchorEl(null);
  };

  const decryptEntry = (id, user) => {
    socket.emit('decrypt-entry-text', { user, entryId: id, decryptKey });
    socket.on('decrypt-text', (data) => {
      // need set encrypt false
      setEntryText(data);
    });
  };

  const checkIfEncryptKeyEmpty = () => {
    !encryptKey && enqueueSnackbar('ENCRYPT KEY IS EMPTY', { variant: 'warning' });
    encryptKey && enqueueSnackbar('ENCRYPT KEY IS ADDED', { variant: 'success' });
  };
  //uploaded image
  const fileSelectedHendler = (event) => {
    const file = Array.from(event.target.files)[0];
    var reader = new FileReader();
    reader.onloadend = function () {
      const newImage = [...props.images];
      newImage.push({
        id: uniqid(),
        type: 'IMAGE',
        base64: reader.result,
        alt: 'IMAGE',
        encrypt: false,
        key: '',
      });
      setUpdateImages(newImage);
      setImgUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const encryptImages = (image) => {
    const imageIndex = updateImages.map((img) => img.id).indexOf(image.id);
    setUpdateImages([
      ...updateImages.slice(0, imageIndex),
      image,
      ...updateImages.slice(imageIndex + 1),
    ]);
  };

  return (
    <Entry
      isUpdate={isUpdate}
      setIsUpdate={setIsUpdate}
      dateOfStartUpdate={dateOfStartUpdate}
      setDateOfStartUpdate={setDateOfStartUpdate}
      entryText={entryText}
      setEntryText={setEntryText}
      encryptKey={encryptKey}
      setEncryptKey={setEncryptKey}
      decryptKey={decryptKey}
      setDecryptKey={setDecryptKey}
      anchorEl={anchorEl}
      anchorElDecrypt={anchorElDecrypt}
      handleClick={handleClick}
      handleClose={handleClose}
      decryptEntry={decryptEntry}
      checkIfEncryptKeyEmpty={checkIfEncryptKeyEmpty}
      updateEncryption={{ ...encryption, encrypt: !!encryptKey, key: encryptKey }}
      imgUrl={imgUrl}
      setImgUrl={setImgUrl}
      fileSelectedHendler={fileSelectedHendler}
      updateImages={updateImages}
      encryptImages={encryptImages}
      {...props}
    />
  );
};
const mapStateToProps = (store) => {};
const mapDispatchToProps = {
  updateUserData,
};
export default connect(mapStateToProps, mapDispatchToProps)(EntryContainer);

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  listItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 15,
  },
  entries: {
    flexGrow: 10,
    wordWrap: 'break-word',
    overflowX: 'scroll',
    maxHeight: 300,
    minHeight: 200,
    padding: '5px',
    width: '100%',
  },
  iconButtonAdd: {},
}));

const EntryImageItem = (props) => {
  const {
    user,
    entryId,
    encryptImageKey,
    setEncrypImagetKey,
    anchorImg,
    handleClick,
    handleClose,
    checkIfEncryptImageKeyEmpty,
    updateImage,
    encryptImage,
    image,
    anchorElDecryptImage,
    decryptImageKey,
    setDecryptImageKey,
    decryptImage,
  } = props;

  const classes = useStyles();
  const openImage = Boolean(anchorImg);
  const idImage = openImage ? 'image-entry' : undefined;
  const openDecriptImage = Boolean(anchorElDecryptImage);
  const idDecryptImage = openDecriptImage ? 'image-entry' : undefined;

  return (
    <>
      <ListItem key={updateImage.id} className={clsx(classes.listItem)}>
        {image?.encrypt ? (
          <div className={classes.entries}>{updateImage.base64.toString()}</div>
        ) : (
          <img
            style={{ maxHeight: 500, maxWidth: 1000 }}
            src={updateImage.base64}
            alt={updateImage.alt}
          />
        )}
        {image?.encrypt ? (
          <>
            <Button
              aria-describedby={idDecryptImage}
              variant="contained"
              style={{ alignSelf: 'flex-end' }}
              color="secondary"
              onClick={(event) => {
                handleClick(event, 'imageDecrypt');
              }}
            >
              Decrypt Image
            </Button>
            <Popover
              id={idDecryptImage}
              open={openDecriptImage}
              anchorEl={anchorElDecryptImage}
              onClose={() => {
                handleClose('imageDecrypt');
              }}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <div style={{ padding: '5px', display: 'flex' }}>
                <TextField
                  value={decryptImageKey}
                  id="outlined-key-input"
                  label="key"
                  autoFocus
                  variant="outlined"
                  onChange={(event) => {
                    setDecryptImageKey(event.target.value);
                  }}
                />
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  style={{ height: '40px', alignSelf: 'center' }}
                  onClick={() => {
                    !decryptImageKey && checkIfEncryptImageKeyEmpty();
                    decryptImageKey && decryptImage(entryId, image.id, user);
                    decryptImageKey && handleClose('imageDecrypt');
                  }}
                >
                  Decrypt
                </Button>
                <IconButton
                  onClick={() => {
                    setDecryptImageKey('');
                    handleClose('imageDecrypt');
                  }}
                  color="primary"
                  className={classes.iconButtonAdd}
                  aria-label="directions"
                >
                  <CloseIcon />
                </IconButton>
              </div>
            </Popover>
          </>
        ) : (
          <>
            <Button
              aria-describedby={idImage}
              style={{ alignSelf: 'flex-end' }}
              variant="contained"
              color="primary"
              onClick={(event) => {
                handleClick(event, 'imageEncrypt');
              }}
            >
              Encrypt Image
            </Button>
            <Popover
              id={idImage}
              open={openImage}
              anchorEl={anchorImg}
              onClose={() => {
                handleClose('imageEncrypt');
              }}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <div style={{ padding: '5px', display: 'flex' }}>
                <TextField
                  value={encryptImageKey}
                  id="outlined-key-input"
                  label="key"
                  autoFocus
                  variant="outlined"
                  onChange={(event) => {
                    setEncrypImagetKey(event.target.value);
                  }}
                />
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  style={{ height: '40px', alignSelf: 'center' }}
                  onClick={() => {
                    checkIfEncryptImageKeyEmpty();
                    encryptImageKey && encryptImage();
                  }}
                >
                  Set Encrypt Key
                </Button>
                <IconButton
                  onClick={() => {
                    setEncrypImagetKey('');
                    handleClose('imageEncrypt');
                  }}
                  color="primary"
                  className={classes.iconButtonAdd}
                  aria-label="directions"
                >
                  <CloseIcon />
                </IconButton>
              </div>
            </Popover>
          </>
        )}
      </ListItem>
    </>
  );
};
export default EntryImageItem;

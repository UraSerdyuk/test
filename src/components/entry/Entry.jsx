import React, { useEffect } from 'react';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import List from '@material-ui/core/List';
import TextField from '@material-ui/core/TextField';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import langDetector from 'lang-detector';

import EntryImageItem from './EntryImageItem.container';

const useStyles = makeStyles((theme) => ({
  details: {
    alignItems: 'center',
    width: '100%',
    flexGrow: 0.1,
  },
  column: {
    // flexBasis: '33.33%',
    flexGrow: 0.1,
  },
  columnUpdate: {
    flexGrow: 0.1,
    color: 'red',
  },
  paper: {
    width: '80%',
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  greed: { margin: 'auto' },
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
    maxHeight: 400,
    minHeight: 200,
  },
  createPost: {
    display: 'flex',
    padding: '1%',
  },
  create: {
    backgroundColor: '#869dab5e',
  },
  buttonInput: { display: 'none' },
}));

const Entry = (props) => {
  const {
    text,
    dateCreated,
    dateLastUpdated,
    id,
    user,
    saveEntry,
    isCriate,
    setEntries,
    entryText,
    setEntryText,
    dateOfStartUpdate,
    setDateOfStartUpdate,
    anchorEl,
    anchorElDecrypt,
    handleClick,
    handleClose,
    encryptKey,
    setEncryptKey,
    decryptKey,
    setDecryptKey,
    encryption,
    updateEncryption,
    decryptEntry,
    isUpdate,
    setIsUpdate,
    checkIfEncryptKeyEmpty,
    fileSelectedHendler,
    updateImages,
    encryptImages,
    socket,
  } = props;

  const classes = useStyles();
  const open = Boolean(anchorEl);
  const idx = open ? 'simple-popover' : undefined;
  const openDecrypt = Boolean(anchorElDecrypt);
  const idDecrypt = openDecrypt ? 'dec-entry' : undefined;
  //clear text from ``` ```
  useEffect(() => {
    if (text.slice(0, 3) === '```' && text.slice(text.length - 3) === '```') {
      const newTextArr = text.split('');
      newTextArr.splice(0, 3);
      newTextArr.splice(newTextArr.length - 3);
      setEntryText(newTextArr.join(''));
    } else {
      setEntryText(text);
      isCriate && setIsUpdate(true);
    }
  }, [isCriate, setEntryText, setIsUpdate, text]);

  return (
    <ListItem key={id} className={clsx(classes.listItem, isCriate && classes.create)}>
      <Typography className={classes.columnUpdate} variant="h9" gutterBottom>
        {dateOfStartUpdate && `Date Of Start Update Entry: ${dateOfStartUpdate}`}
      </Typography>
      <Divider />
      <Paper button elevation={1} className={classes.paper}>
        <ExpansionPanelDetails className={classes.details}>
          <Typography className={classes.column} variant="h9" gutterBottom>
            Created: {dateCreated}
          </Typography>
        </ExpansionPanelDetails>
        <Divider />
        <ExpansionPanelDetails className={classes.details}>
          <Typography className={classes.column} variant="h9" gutterBottom>
            Language: {langDetector(entryText)}
          </Typography>
        </ExpansionPanelDetails>
        <Divider />
        {isUpdate ? (
          <TextareaAutosize
            style={{ overflow: 'scroll', minHeight: 200, maxHeight: 400 }}
            value={entryText}
            onChange={(e) => {
              setEntryText(e.target.value);
            }}
            // className={classes.entries}
          />
        ) : (
          <SyntaxHighlighter language="javascript" style={docco}>
            {entryText}
          </SyntaxHighlighter>
        )}

        <Divider />
        <ExpansionPanelActions>
          <div className={clsx(classes.column)}>Updated: {dateLastUpdated}</div>
          {encryption?.encrypt && (
            <div>
              <Button
                aria-describedby={idDecrypt}
                variant="contained"
                color="secondary"
                onClick={(event) => {
                  handleClick(event, 'decrypt');
                }}
              >
                Decrypt
              </Button>
              <Popover
                id={idDecrypt}
                open={openDecrypt}
                anchorEl={anchorElDecrypt}
                onClose={() => {
                  handleClose('decrypt');
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
                    value={decryptKey}
                    id="outlined-key-input"
                    label="key"
                    autoFocus
                    variant="outlined"
                    onChange={(event) => {
                      setDecryptKey(event.target.value);
                    }}
                  />
                  <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    style={{ height: '40px', alignSelf: 'center' }}
                    onClick={() => {
                      !decryptKey && checkIfEncryptKeyEmpty();
                      decryptKey && decryptEntry(id, user);
                      decryptKey && handleClose('decrypt');
                    }}
                  >
                    Decrypt
                  </Button>
                  <IconButton
                    onClick={() => {
                      setEncryptKey('');
                      handleClose('decrypt');
                    }}
                    color="primary"
                    className={classes.iconButtonAdd}
                    aria-label="directions"
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              </Popover>
            </div>
          )}
          {isUpdate && (
            <div>
              <Button
                aria-describedby={idx}
                variant="contained"
                color="primary"
                onClick={(event) => {
                  handleClick(event, 'encrypt');
                }}
              >
                Encrypt Entry
              </Button>
              <Popover
                id={idx}
                open={open}
                anchorEl={anchorEl}
                onClose={() => {
                  handleClose('encrypt');
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
                    value={encryptKey}
                    id="outlined-key-input"
                    label="key"
                    autoFocus
                    variant="outlined"
                    onChange={(event) => {
                      setEncryptKey(event.target.value);
                    }}
                  />
                  <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    style={{ height: '40px', alignSelf: 'center' }}
                    onClick={() => {
                      checkIfEncryptKeyEmpty();
                      encryptKey && handleClose('encrypt');
                    }}
                  >
                    Set Encrypt Key
                  </Button>
                  <IconButton
                    onClick={() => {
                      setEncryptKey('');
                      handleClose('encrypt');
                    }}
                    color="primary"
                    className={classes.iconButtonAdd}
                    aria-label="directions"
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              </Popover>
            </div>
          )}
          {/* hide  update button if entry is decrypted */}
          {!encryption?.encrypt && (
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={() => {
                setIsUpdate(true);
                setDateOfStartUpdate(moment().format('LLLL'));
              }}
            >
              Update
            </Button>
          )}
          <Button
            size="small"
            variant="contained"
            onClick={() => {
              saveEntry(
                entryText,
                id,
                dateCreated,
                dateOfStartUpdate,
                updateEncryption,
                updateImages,
                encryption,
              );
              entryText && setIsUpdate(false);
              entryText && setDateOfStartUpdate('');
              setEncryptKey('');
              isCriate && setEntries([]);
            }}
            color="primary"
          >
            Save
          </Button>
        </ExpansionPanelActions>
        <Divider />
        {/* IMAGE SECTION */}
        <div className="">
          <List component="ul" className={classes.root} aria-label="mailbox folders">
            {updateImages.map((image) => {
              return (
                <>
                  <EntryImageItem
                    user={user}
                    entryId={id}
                    image={image}
                    encryptImages={encryptImages}
                    socket={socket}
                  />
                  <Divider />
                </>
              );
            })}
          </List>
        </div>
        <Divider />
        <ExpansionPanelActions>
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            className={classes.button}
            color="primary"
          >
            Upload Image
            <input
              type="file"
              accept="image/*"
              id="contained-button-file"
              multiple={false}
              className={classes.buttonInput}
              onChange={fileSelectedHendler}
            />
          </Button>
        </ExpansionPanelActions>
      </Paper>
    </ListItem>
  );
};

export default Entry;

import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';

import { makeStyles } from '@material-ui/core/styles';

import Modal from '@material-ui/core/Modal';
import { getLocalStarageParce, setToLocalStarage } from '../../utils/helpers';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function SimpleModal(props) {
  const { isVisible, closeModal, id, payloads, socket } = props;
  const [modalId, setModalId] = useState('diary save to localStorage with the bad connection');
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    isVisible ? setOpen(true) : setOpen(false);
  }, [isVisible]);

  useEffect(() => {
    setModalId(id);
  }, [id]);

  const handleClose = () => {
    closeModal(id);
  };

  const setEntryToLocalStarage = (entry) => {
    const arr = getLocalStarageParce('doNotSaveEntry');
    const entryIndex = arr.map((e) => e.id).indexOf(entry.id);
    if (entryIndex === -1) {
      arr.push(entry);
      setToLocalStarage('doNotSaveEntry', arr);
      closeModal('diary save to localStorage with the bad connection');
    } else {
      const updateDontSaveEntriesArr = [
        ...arr.slice(0, entryIndex),
        entry,
        ...arr.slice(entryIndex + 1),
      ];
      setToLocalStarage('doNotSaveEntry', updateDontSaveEntriesArr);
      closeModal('diary save to localStorage with the bad connection');
    }
  };

  const body = {
    'diary save to localStorage with the bad connection': (
      <div style={modalStyle} className={classes.paper}>
        <h2 id="simple-modal-title"> You dont have internet connection</h2>
        <h2 id="simple-modal-title"> Do you want to save it locally ?</h2>
        <div>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              handleClose('diary save to localStorage with the bad connection');
            }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setEntryToLocalStarage({ ...payloads });
            }}
          >
            Save to localStorage
          </Button>
        </div>
      </div>
    ),
    doNotSaveEntry: (
      <div style={modalStyle} className={classes.paper}>
        <h2 id="simple-modal-title"> You have dont save entry </h2>
        <h2 id="simple-modal-title"> Do you wont to seve on the server now ? </h2>
        <h5 id="simple-modal-title">TO DO : display list unsaved enries </h5>
        <div>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              handleClose('doNotSaveEntry');
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleClose('doNotSaveEntry');
              alert('start Update diary');
            }}
          >
            Save all entries
          </Button>
        </div>
      </div>
    ),
    'You have already updated entry from another computer': (
      <div style={modalStyle} className={classes.paper}>
        <h2 id="simple-modal-title"> You have already updated entry from another computer </h2>
        <h2 id="simple-modal-title"> Do you want to revrite entry ? </h2>
        <div>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              handleClose('You have already updated entry from another computer');
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              socket.emit('Save Entry', { ...payloads });
              handleClose('You have already updated entry from another computer');
            }}
          >
            Revrite
          </Button>
        </div>
      </div>
    ),
  };

  return (
    <div>
      <Modal open={open} onClose={handleClose} aria-labelledby="simple-modal-title">
        {body[modalId]}
      </Modal>
    </div>
  );
}

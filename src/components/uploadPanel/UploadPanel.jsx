import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Icon from '@material-ui/core/Icon';
import Switch from '@material-ui/core/Switch';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const useStyles = makeStyles((theme) => ({
  root: {
    borderTop: '1px solid grey',
  },
  button: {
    margin: theme.spacing(1),
  },
  buttonInput: { display: 'none' },
  multipleBlock: {
    display: 'flex',
  },
}));

const UploadPanel = (props) => {
  const classes = useStyles();
  const { fileSelectedHendler, postFiles, isMultiple, setIsMultiple, isChoosedFile } = props;

  return (
    <>
      <Box component="div" className={classes.root}>
        <Box component="div" className={classes.multipleBlock}>
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
            className={classes.button}
            color="primary"
          >
            Choose File
            <input
              type="file"
              // accept="image/*"
              id="contained-button-file"
              multiple={isMultiple}
              className={classes.buttonInput}
              onChange={fileSelectedHendler}
            />
          </Button>
          <FormControlLabel
            value="top"
            control={
              <Switch
                value="start"
                checked={isMultiple}
                onChange={() => {
                  setIsMultiple(!isMultiple);
                }}
                color="primary"
                name="checkedB"
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            }
            label="Enable multiple upload files ?"
            labelPlacement="top"
          />
        </Box>
        <Button
          onClick={postFiles}
          variant="contained"
          color="primary"
          disabled={!isChoosedFile}
          className={classes.button}
          endIcon={<Icon>send</Icon>}
        >
          Upload To Server
        </Button>
      </Box>
    </>
  );
};

export default UploadPanel;

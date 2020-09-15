import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
  established: {
    backgroundColor: 'green',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  'trying to connect': {
    backgroundColor: 'yellow',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
}));

const Indicator = (props) => {
  const { status } = props;

  const classes = useStyles();
  return <Box className={classes[status]}></Box>;
};

export default Indicator;

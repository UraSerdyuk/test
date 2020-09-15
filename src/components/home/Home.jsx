import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import UploadPanel from '../uploadPanel';
import UserDataPanel from '../userDataPanel';
import NavPanel from '../navPanel';
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: 'white',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  button: {
    margin: theme.spacing(1),
  },
  buttonInput: { display: 'none' },
  multipleBlock: {
    display: 'flex',
  },
}));

const Home = (props) => {
  const classes = useStyles();
  const { userData } = props;

  return (
    <div className={classes.main}>
      <CssBaseline />
      <NavPanel />
      <Container className={classes.root} maxWidth="xl">
        <UserDataPanel userData={userData} />
        <UploadPanel {...props} />
      </Container>
    </div>
  );
};

export default Home;

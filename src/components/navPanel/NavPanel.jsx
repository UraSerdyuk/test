import React, { useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Indicator from '../connectionIndicator';
import MailIcon from '@material-ui/icons/Mail';
import ImportantDevicesTwoToneIcon from '@material-ui/icons/ImportantDevicesTwoTone';
import Badge from '@material-ui/core/Badge';

import { APP_ROUTES } from '../../constants/routes.constants';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const ButtonAppBar = (props) => {
  const { user, localStorageNotSaveEntry = [], clients = [], logOut, logOutResetUpdates } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Email: {user && user.email}
          </Typography>
          <Typography variant="h6" className={classes.title}>
            Role: {user && user.role}
          </Typography>
          <Link to={`/${APP_ROUTES.HOME}`}>
            <Button variant="contained" color="secondary">
              Go To Home
            </Button>
          </Link>
          <Link to={`/${APP_ROUTES.DIARY}`}>
            <Button variant="contained" color="secondary">
              Go To Diary
            </Button>
          </Link>
          <Link to={`/${APP_ROUTES.TEAM}`}>
            <Button variant="contained" color="secondary">
              Go To Team
            </Button>
          </Link>

          {!!clients.length && (
            <Badge badgeContent={clients.length} color="error">
              <ImportantDevicesTwoToneIcon fontSize="large" />
            </Badge>
          )}
          {!!localStorageNotSaveEntry.length && (
            <Badge badgeContent={localStorageNotSaveEntry.length} color="error">
              <MailIcon fontSize="large" />
            </Badge>
          )}
          <Button
            variant="outlined"
            onClick={() => {
              logOut();
              logOutResetUpdates();
            }}
            color="inherit"
          >
            LogOut
          </Button>
          <Indicator />
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default withRouter(ButtonAppBar);

import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import Login from '../login';
import Home from '../home';
import SingUp from '../signUp';
import Diary from '../diary';
import Modal from '../modals';
import Team from '../team';
import { APP_ROUTES } from '../../constants/routes.constants';

import './App.css';

function App(props) {
  const { isAuthorization } = props;

  return (
    <Router>
      <Switch>
        {isAuthorization ? (
          <>
            <Modal />
            <Switch>
              <Route path={`/${APP_ROUTES.HOME}`} component={Home} />
              <Route path={`/${APP_ROUTES.DIARY}`} component={Diary} />
              <Route path={`/${APP_ROUTES.TEAM}`} component={Team} />
              <Redirect to={`/${APP_ROUTES.HOME}`} />
            </Switch>
          </>
        ) : (
          <>
            <Route exact path={`/${APP_ROUTES.LOGIN}`} render={() => <Login />} />
            <Route path={`/${APP_ROUTES.SIGN_UP}`} component={SingUp} />
            <Redirect to={`/${APP_ROUTES.LOGIN}`} />
          </>
        )}
      </Switch>
    </Router>
  );
}

export default App;

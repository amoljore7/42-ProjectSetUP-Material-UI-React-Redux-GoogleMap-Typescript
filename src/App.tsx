import React, { lazy, Suspense } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { Container, makeStyles, CssBaseline } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { createBrowserHistory } from 'history';

import ProtectedRoute from './protected-route';
import CircularProgressOverlay from './components/circular-progress-overlay';

const LayoutPage = lazy(() => import('./module/layout/component/layout'));
const LoginPage = lazy(() => import('./module/login/component/login'));
const LandingPage = lazy(() => import('./module/landing/component/landing'));
const ResetPassword = lazy(() => import('./module/resetPassword/component/resetPassword'));
const ForgotPassword = lazy(() => import('./module/forgotPassword/component/forgotPassword'));
const PageNotFound = lazy(() => import('./module/pageNotFound/pageNotFound'));

export const history = createBrowserHistory();

const themeDark = createMuiTheme({
  palette: {
    background: {
      default: '#F5F5FA'
    }
  }
});
const App: React.FC = () => {
  return (
    <MuiThemeProvider theme={themeDark}>
      <Container component="main" maxWidth={false}>
        <CssBaseline />
        <Router history={history}>
          <Suspense fallback={<CircularProgressOverlay />}>
            <Switch>
              <Route exact strict path="/" component={LandingPage} />
              <Route path="/reset-password" component={ResetPassword} />
              <Route path="/forgot-password" component={ForgotPassword} />
              <Route path="/login" component={LoginPage} />
              <ProtectedRoute path="/user" component={LayoutPage} />
              <Route path="/page-not-found" component={PageNotFound} />
              <Route component={PageNotFound} />
            </Switch>
          </Suspense>
        </Router>
      </Container>
    </MuiThemeProvider>
  );
};

export default App;

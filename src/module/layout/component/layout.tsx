import React from 'react';
import { Route, RouteComponentProps, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Navbar from '../../../components/navbar';
import rootReducer from '../../../root-reducer';

import ResourceRouting from '../../resources/routing';
import PageNotFound from '../../pageNotFound/pageNotFound';
const Home = () => <h1>Home</h1>;
const Dashboard = () => <h1>Dashboard</h1>;
const Patients = () => <h1>Patients</h1>;
const Analytics = () => <h1>Analytics</h1>;

type Props = RouteComponentProps;
const Layout: React.FC<Props> = (props: Props) => {
  return (
    <React.Fragment>
      <Navbar />
      <Switch>
        <Route
          exact
          strict
          path={props.match.url}
          render={() => <Redirect to={`${props.match.url}/resources`} />}
        />
        <Route path={`${props.match.url}/resources`} component={ResourceRouting} />
        <Route path={`${props.match.url}/home`} component={Home} />
        <Route path={`${props.match.url}/dashboard`} component={Dashboard} />
        <Route path={`${props.match.url}/patients`} component={Patients} />
        <Route path={`${props.match.url}/analytics`} component={Analytics} />
        <Route component={PageNotFound} />
      </Switch>
    </React.Fragment>
  );
};

const mapStateToProps = (state: ReturnType<typeof rootReducer>) => ({
  loginReducer: state.loginReducer
});

export default connect(mapStateToProps, {})(Layout);

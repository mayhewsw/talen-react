import React, { useEffect } from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { history } from "../_helpers";
import { alertActions } from "../_actions";
import { PrivateRoute } from "../_components";
import { HomePage, NewAnnotatePage } from "../_pages";
import "./App.css";

interface Alert {
  message?: string;
  type?: string;
}

interface AppProps {
  alert: Alert;
  clearAlerts: () => void;
}

const App: React.FC<AppProps> = ({ alert, clearAlerts }) => {
  useEffect(() => {
    // clear alert on location change
    const unlisten = history.listen(() => {
      clearAlerts();
    });

    return () => {
      unlisten();
    };
  }, [clearAlerts]);

  return (
    <Router history={history}>
      {alert.message && (
        <div className={`alert ${alert.type}`}>{alert.message}</div>
      )}

      <Switch>
        <Route exact path="/" component={HomePage} />
        <PrivateRoute exact path="/dataset/:id" component={NewAnnotatePage} />
        <Redirect from="*" to="/" />
      </Switch>
    </Router>
  );
};

interface ReduxState {
  alert: Alert;
}

function mapState(state: ReduxState) {
  const { alert } = state;
  return { alert };
}

const actionCreators = {
  clearAlerts: alertActions.clear,
};

const connectedApp = connect(mapState, actionCreators)(App);
export { connectedApp as App };

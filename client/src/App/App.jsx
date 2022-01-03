import React from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { history } from "../_helpers";
import { alertActions } from "../_actions";
import { PrivateRoute } from "../_components";
import { LoginPage, HomePage, NewAnnotatePage } from "../_pages";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);

    history.listen((location, action) => {
      // clear alert on location change
      this.props.clearAlerts();
    });
  }

  render() {
    const { alert } = this.props;
    return (
      <Router history={history}>
        {alert.message && (
          <div className={`alert ${alert.type}`}>{alert.message}</div>
        )}

        <Switch>
          <PrivateRoute exact path="/" component={HomePage} />
          <PrivateRoute exact path="/dataset/:id" component={NewAnnotatePage} />
          <Route path="/login" component={LoginPage} />
          <Redirect from="*" to="/" />
        </Switch>
      </Router>
    );
  }
}

function mapState(state) {
  const { alert } = state;
  return { alert };
}

const actionCreators = {
  clearAlerts: alertActions.clear,
};

const connectedApp = connect(mapState, actionCreators)(App);
export { connectedApp as App };

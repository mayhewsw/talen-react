import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { history } from '../_helpers';
import { alertActions } from '../_actions';
import { PrivateRoute } from '../_components';
import { LoginPage } from '../LoginPage';
import { HomePage } from '../HomePage';
import { DatasetPage } from '../DatasetPage';
import { DocumentPage } from '../DocumentPage';
import { RegisterPage } from '../RegisterPage';
import MainPanel from '../components/MainPanel';
import './App.css';

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
                <MainPanel>
                    {alert.message &&
                        <div className={`alert ${alert.type}`}>{alert.message}</div>
                    }
                    
                    <Switch>
                        <PrivateRoute exact path="/" component={HomePage} />
                        <PrivateRoute exact path="/dataset/:id" component={DatasetPage} />
                        <PrivateRoute exact path="/dataset/:id/:docid" component={DocumentPage} />
                        <Route path="/login" component={LoginPage} />
                        <Route path="/register" component={RegisterPage} />
                        <Redirect from="*" to="/" />
                    </Switch>
                </MainPanel>
            </Router>
        );
    }
}

function mapState(state) {
    const { alert } = state;
    return { alert };
}

const actionCreators = {
    clearAlerts: alertActions.clear
};

const connectedApp = connect(mapState, actionCreators)(App);
export { connectedApp as App };
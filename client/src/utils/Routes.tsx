import * as React from 'react'
import { Route, Switch } from 'react-router-dom';
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import Annotate from "../pages/Annotate";
import PageNotFound from "../pages/PageNotFound";
import { State } from "../utils/types"
import { connect } from 'react-redux'
import { Container } from 'react-bootstrap';
import MainPanel from '../components/MainPanel';

class Routes extends React.Component<Props> {

  render() {
    const { loggedIn } = this.props

    return (
      <MainPanel>
        { loggedIn ? (
          <Switch>
            <Route exact={true} path="/" component={HomePage} />
            <Route exact={true} path="/login" component={HomePage} />
            <Route exact={true} path="/anno" component={Annotate} />
            <Route exact={false} path="/" component={PageNotFound} />
          </Switch>
        ) : (
          // TODO: consider passing the next URL here.
          <Route exact={false} path="/" component={LoginPage} />
        )}
    </MainPanel>
    );
    
  }
}

type Props = {
  loggedIn: boolean
}

const mapStateToProps = (state: State) => ({
  loggedIn: state.loggedIn
})

const mapDispatchToProps = (dispatch: any) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Routes)

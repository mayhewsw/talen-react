import * as React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Routes from "./utils/Routes"
import { State } from './utils/types';
import { connect } from 'react-redux'
import { loadMe } from './utils/login'
import './talen.css';
import './App.css';

class App extends React.Component<Props> {
  
  constructor(props: Props) {
    super(props);

    // I think it is important to load the loggedIn thing before loading the app.
    this.props.loadUser()
  }


  render() {
    return (
      <Router>
        <Routes />
      </Router>
    );
  }
}

type Props = {
  loadUser: Function
}

const mapStateToProps = (state: State) => ({
})

const mapDispatchToProps = (dispatch: Function) => ({
  loadUser: () => dispatch(loadMe())
})

export default connect(mapStateToProps, mapDispatchToProps)(App)

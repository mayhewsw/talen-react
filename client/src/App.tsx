import * as React from 'react'
import { BrowserRouter as Router, Redirect } from 'react-router-dom'
import Routes from "./utils/Routes"
import './talen.css';
import './App.css';

class App extends React.Component {

  render() {
    return (
      <Router>
        <Routes />
      </Router>
    );
  }
}

export default App

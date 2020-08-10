import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { MainPanel } from "../_components";
import { userActions } from "../_actions";

class LoginPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    // reset login status
    this.props.logout();

    this.state = {
      username: "",
      password: "",
      submitted: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e: any) {
    const { name, value } = e.target;
    // TODO: this is super ugly... it used to be
    // this.setState({ [name] : value })
    // but typescript didn't like it?
    // maybe if I type the input correctly...
    if (name === "username") {
      this.setState({ username: value });
    } else if (name === "password") {
      this.setState({ password: value });
    }
  }

  handleSubmit(e: any) {
    e.preventDefault();

    this.setState({ submitted: true });
    const { username, password } = this.state;
    if (username && password) {
      this.props.login(username, password);
    }
  }

  render() {
    const { username, password, submitted } = this.state;
    return (
      <MainPanel>
        <div className="col-md-6 col-md-offset-3">
          <h2>Login</h2>
          <form name="form" onSubmit={this.handleSubmit}>
            <div
              className={
                "form-group" + (submitted && !username ? " has-error" : "")
              }
            >
              <label htmlFor="username">Username</label>
              <input
                type="text"
                className="form-control"
                name="username"
                value={username}
                onChange={this.handleChange}
              />
              {submitted && !username && (
                <div className="help-block">Username is required</div>
              )}
            </div>
            <div
              className={
                "form-group" + (submitted && !password ? " has-error" : "")
              }
            >
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={password}
                onChange={this.handleChange}
              />
              {submitted && !password && (
                <div className="help-block">Password is required</div>
              )}
            </div>
            <div className="form-group">
              <button className="btn btn-primary">Login</button>
              <Link to="/register" className="btn btn-link">
                Register
              </Link>
            </div>
          </form>
        </div>
      </MainPanel>
    );
  }
}

type Props = {
  logout: any;
  login: any;
};

type State = {
  username: string;
  password: string;
  submitted: boolean;
};

function mapState(state: any) {
  const { loggingIn } = state.authentication;
  return { loggingIn };
}

const actionCreators = {
  login: userActions.login,
  logout: userActions.logout,
};

const connectedLoginPage = connect(mapState, actionCreators)(LoginPage);
export { connectedLoginPage as LoginPage };

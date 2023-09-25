import React from "react";
import { MainPanel, Input } from "../_components";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { State } from "../_utils/types";

import { userActions } from "../_actions";

class RegisterPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        firstName: "",
        lastName: "",
        username: "",
        password: "",
      },
      submitted: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    const { user } = this.state;
    this.setState({
      user: {
        ...user,
        [name]: value,
      },
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    this.setState({ submitted: true });
    const { user } = this.state;
    if (user.firstName && user.lastName && user.username && user.password) {
      this.props.register(user);
    }
  }

  render() {
    const { user, submitted } = this.state;
    return (
      <MainPanel hideLoginButton={true}>
        <div className="col-md-4 md-offset-4">
          <h2>Register</h2>
          <form name="form" onSubmit={this.handleSubmit}>
            <div
              className={
                "form-group" +
                (submitted && !user.firstName ? " has-error" : "")
              }
            >
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                className="form-control"
                name="firstName"
                value={user.firstName}
                onChange={this.handleChange}
              />
              {submitted && !user.firstName && (
                <div className="help-block">First Name is required</div>
              )}
            </div>
            <div
              className={
                "form-group" + (submitted && !user.lastName ? " has-error" : "")
              }
            >
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                className="form-control"
                name="lastName"
                value={user.lastName}
                onChange={this.handleChange}
              />
              {submitted && !user.lastName && (
                <div className="help-block">Last Name is required</div>
              )}
            </div>
            <div
              className={
                "form-group" + (submitted && !user.username ? " has-error" : "")
              }
            >
              <label htmlFor="username">Username</label>
              <input
                type="text"
                className="form-control"
                name="username"
                value={user.username}
                onChange={this.handleChange}
              />
              {submitted && !user.username && (
                <div className="help-block">Username is required</div>
              )}
            </div>
            <div
              className={
                "form-group" + (submitted && !user.password ? " has-error" : "")
              }
            >
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={user.password}
                onChange={this.handleChange}
              />
              {submitted && !user.password && (
                <div className="help-block">Password is required</div>
              )}
            </div>
            <div className="form-group">
              <button className="btn btn-primary">Register</button>
              <Link to="/login" className="btn btn-link">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </MainPanel>
    );
  }
}

function mapState(state) {
  const { registering } = state.registration;
  return { registering };
}

const actionCreators = {
  register: userActions.register,
};

const connectedRegisterPage = connect(mapState, actionCreators)(RegisterPage);
export { connectedRegisterPage as RegisterPage };

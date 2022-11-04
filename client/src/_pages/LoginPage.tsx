import React from "react";
import { connect } from "react-redux";
import { MainPanel, Input } from "../_components";
import { userActions } from "../_actions";
import { State } from "../_utils/types";

class LoginPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    // reset login status
    // what???
    this.props.logout();

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleGuestSubmit = this.handleGuestSubmit.bind(this);
  }

  handleSubmit(e: any) {
    e.preventDefault();

    const { formState, login } = this.props;
    login(formState.username, formState.password);
  }

  handleGuestSubmit(e: any) {
    e.preventDefault();

    const { login } = this.props;
    login("guest", "guest");
  }

  render() {
    return (
      <MainPanel hideLoginButton={true}>
        <div className="col-md-4 offset-md-4">
          <h2>Login</h2>

          <form name="form">
            <Input
              name="username"
              label="Username"
              type="text"
              model="username"
            ></Input>
            <Input
              name="password"
              label="Password"
              type="password"
              model="password"
            ></Input>
            <div className="form-group">
              <button className="btn btn-primary" onClick={this.handleSubmit}>
                Login
              </button>
              <button
                className="btn btn-secondary ml-3"
                onClick={this.handleGuestSubmit}
              >
                Login as Guest
              </button>
              <div className="mt-3" style={{ color: "#444" }}>
                <i>Contact the site owner for login credentials.</i>
              </div>
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
  formState: {
    [key: string]: number | string;
  };
};

function mapState(state: State) {
  const { loggingIn } = state.authentication;
  const { formState } = state.util;
  return { loggingIn, formState };
}

const actionCreators = {
  login: userActions.login,
  logout: userActions.logout,
};

const connectedLoginPage = connect(mapState, actionCreators)(LoginPage);
export { connectedLoginPage as LoginPage };

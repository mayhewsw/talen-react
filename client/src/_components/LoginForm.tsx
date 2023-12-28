import React from "react";
import { connect } from "react-redux";
import { Input } from ".";
import { userActions } from "../_actions";
import { State } from "../_utils/types";

class LoginForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleGuestSubmit = this.handleGuestSubmit.bind(this);
  }

  handleSubmit(e: any) {
    e.preventDefault();
    this.props.login(
      this.props.formState.username,
      this.props.formState.password
    );
  }

  handleGuestSubmit(e: any) {
    e.preventDefault();
    this.props.login("guest", "guest");
  }

  render() {
    return (
      // <MainPanel hideLoginButton={true}>
      <div className="col-md-12">
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
      // </MainPanel>
    );
  }
}

type Props = {
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
};

const connectedLoginForm = connect(mapState, actionCreators)(LoginForm);
export { connectedLoginForm as LoginForm };

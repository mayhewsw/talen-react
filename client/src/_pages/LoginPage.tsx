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
  }

  handleSubmit(e: any) {
    e.preventDefault();

    const { formState, login } = this.props;
    login(formState.username, formState.password);
  }

  render() {
    let msg = null;
    if (process.env.REACT_APP_ENV === "demo") {
      msg = <p>In the demo, you can log in with anything (empty/empty).</p>;
    }

    return (
      <MainPanel hideLoginButton={true}>
        <div className="col-md-6 col-md-offset-3">
          <h2>Login</h2>

          {msg}

          <form name="form" onSubmit={this.handleSubmit}>
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
              <button className="btn btn-primary">Login</button>
              {/* <Link to="/register" className="btn btn-link">
                Register
              </Link> */}
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

import React from "react";
import { connect } from "react-redux";
import { Input } from ".";
import { userActions } from "../_actions";
import { State } from "../_utils/types";

class RegisterForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleSubmit(e: any) {
    e.preventDefault();
    // this.props.register();

    // do not allow any empty fields
    for (const key in this.props.formState) {
      if (this.props.formState[key] === "") {
        console.log("Empty field: " + key);
        return;
      }
    }

    if (this.props.formState.password !== this.props.formState.password2) {
      // TODO: this should be a message
      console.log("Passwords do not match");
      return;
    }

    this.props.register(
      this.props.formState.username,
      this.props.formState.email,
      this.props.formState.password
    );
  }

  handleCancel(e: any) {
    e.preventDefault();
    this.props.toggleRegistering();
    console.log("Cancel register");
  }

  render() {
    return (
      <div className="col-md-12">
        <h2>Register</h2>
        <form name="form">
          <Input
            name="username"
            label="Username"
            type="text"
            model="username"
          ></Input>
          <Input name="email" label="Email" type="text" model="email"></Input>
          <Input
            name="password"
            label="Password"
            type="password"
            model="password"
          ></Input>
          <Input
            name="password2"
            label="Confirm Password"
            type="password"
            model="password2"
          ></Input>
          <div className="form-group">
            <button className="btn btn-primary" onClick={this.handleSubmit}>
              Register
            </button>
            <button
              className="btn btn-secondary ml-3"
              onClick={this.handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }
}

type Props = {
  register: any;
  toggleRegistering: any;
  formState: {
    [key: string]: number | string;
  };
};

function mapState(state: State) {
  const { registering } = state.registration;
  const { formState } = state.util;
  return { registering, formState };
}

const actionCreators = {
  register: userActions.register,
  toggleRegistering: userActions.toggleRegistering,
};

const connectedRegisterForm = connect(mapState, actionCreators)(RegisterForm);
export { connectedRegisterForm as RegisterForm };

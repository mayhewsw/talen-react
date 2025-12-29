import React from "react";
import { connect } from "react-redux";
import { utilActions } from "../_actions";

class Input extends React.Component<Props> {
  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.props.changeForm({ [name]: value });
  };

  render() {
    const { name, label, type } = this.props;
    return (
      <div className="form-group">
        <label htmlFor={name}>{label}</label>
        <input
          type={type}
          className="form-control"
          name={name}
          id={name}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

type Props = {
  name: string;
  label: string;
  type: string;
  model: string;
  changeForm: any;
};

const actionCreators = {
  changeForm: utilActions.changeForm,
};

const connectedInput = connect(null, actionCreators)(Input);
export { connectedInput as Input };

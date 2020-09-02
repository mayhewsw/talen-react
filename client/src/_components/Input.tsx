import React from "react";
import { connect } from "react-redux";
import { changeForm } from "../_actions";
import { State } from "../_utils/types";
import { Form } from "react-bootstrap";

// TODO: who wrote this code? Where did I get it from?????

class Input extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.changeInput = this.changeInput.bind(this);
  }

  changeInput(event: any) {
    const value = event.target.value;
    const name = event.target.name;
    this.props.handleChange({ [name]: value });
  }

  render() {
    const { label, type, name, model, formState } = this.props;

    const fsv = formState[model];

    return (
      <Form.Group>
        <Form.Label>{label}</Form.Label>
        <Form.Control
          type={type}
          name={name}
          defaultValue={fsv}
          onChange={this.changeInput}
        />
      </Form.Group>
    );
  }
}

type Props = {
  label: string;
  type: string;
  name: string;
  model: string;
  formState: {
    [key: string]: number | string;
  };
  handleChange: Function;
};

const mapStateToProps = (state: State) => ({
  formState: state.util.formState,
});

const mapDispatchToProps = (dispatch: Function) => ({
  handleChange: (values: any) => dispatch(changeForm(values)),
});

const connectedInput = connect(mapStateToProps, mapDispatchToProps)(Input);

export { connectedInput as Input };

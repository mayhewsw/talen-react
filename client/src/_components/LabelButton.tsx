import React from "react";
import { Button } from "react-bootstrap";

class LabelButton extends React.Component<Props> {
  render() {
    return (
      <Button
        onClick={() => this.props.onClick()}
        bsPrefix="custom-btn"
        className={["label-button", this.props.label].join(" ")}
        style={{ background: this.props.color }}
      >
        {this.props.label}
      </Button>
    );
  }
}

export default LabelButton;

type Props = {
  label: string;
  onClick: Function;
  color: string;
};

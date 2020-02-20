import React from 'react';
import { Button, Popover, Container, Row, Overlay } from 'react-bootstrap';

class LabelButton extends React.Component<Props>{

    render() {
      return (
        <Button onClick={() => this.props.onClick()}
          className={["label-button", this.props.label].join(" ")}>{this.props.label}</Button>
      )
    }
}

export default LabelButton;

type Props = { 
    label: string, 
    onClick: Function 
};
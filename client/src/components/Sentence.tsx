import React from 'react';
import Token from "./Token";
import { Badge } from 'react-bootstrap';

class Sentence extends React.Component<SentProps>{

    render(){
        return (
            <div className="sentence">
            <Badge className="sentence-badge" key={"badge-" + this.props.index} variant="light">{this.props.index}</Badge>
            {this.props.sent.map((tok, index) =>
              <Token 
                key={index} 
                form={tok} 
                label={this.props.labels[index]} 
                selected={this.props.selected(index)}
                mousedown={() => this.props.tokmousedown(index)}
                mouseup={() => this.props.tokmouseup(index)}
                show_popover={this.props.show_popover(index)}
                set_label={this.props.set_label}
              />
            )}
          </div>
        )
    }
}

type SentProps = { 
    index: number,
    sent: string[],
    labels: string[],
    selected: any,
    tokmousedown: any,
    tokmouseup: any,
    show_popover: any,
    set_label: any
  };

export default Sentence;
import React from "react";
import { Token } from "./Token";
import { Badge } from "react-bootstrap";

class Sentence extends React.Component<SentProps, State> {
  constructor(props: any) {
    super(props);

    // FIXME: why does the Sentence have it's own state??
    this.state = {
      color: "white",
      words: [[]],
      labels: [[]],
      default_labels: [[]],
      space_markers: [[]],
      path: "",
      mouseIsDown: false,
      selected_range: [-1, -1],
      popover_index: -1,
      prevDoc: "",
      nextDoc: "",
      status: "",
    };

    this.rowMouseDown = this.rowMouseDown.bind(this);
    this.rowMouseUp = this.rowMouseUp.bind(this);
  }

  showPopoverFunc(index: number) {
    return (
      !this.props.isReadOnly &&
      this.props.isActive &&
      !this.state.mouseIsDown &&
      index === this.state.selected_range[1]
    );
  }

  updateRange(start: number, end: number) {
    this.setState({ selected_range: [start, end] });
  }

  tokenUp(index: number) {
    this.updateRange(this.state.selected_range[0], index);
  }

  tokenDown(index: number) {
    this.updateRange(index, index);
  }

  rowMouseDown(evt: any) {
    this.props.setFocus(this.props.index);
  }

  rowMouseUp(evt: any) {
    if (evt.target.tagName !== "A") {
      this.checkClearRange(evt);
    }
  }

  checkClearRange(evt: any) {
    const tgt = evt.target;
    if (
      tgt.classList.contains("token") ||
      tgt.classList.contains("label-button")
    ) {
      // do nothing?
    } else {
      this.updateRange(-1, -1);
    }
  }

  selected_keyword(i: number) {
    var first = this.state.selected_range[0];
    var last = this.state.selected_range[this.state.selected_range.length - 1];

    if (!this.props.isActive) {
      return "";
    }

    // this could happen if you are dragging backwards.
    // then we switch them!
    if (first > last) {
      const tmp = last;
      last = first;
      first = tmp;
    }

    if (first === last && first === i) {
      return "highlightsingle";
    }
    if (i === first) {
      return this.props.direction === "ltr" ? "highlightstart" : "highlightend";
    } else if (i === last) {
      return this.props.direction === "ltr" ? "highlightend" : "highlightstart";
    } else if (i > first && i < last) {
      return "highlighted";
    }

    return "";
  }

  render() {
    const highlighted_phrase = this.props.sent
      .slice(this.state.selected_range[0], this.state.selected_range[1] + 1)
      .join(" ");

    return (
      <div
        className="sentence"
        onMouseDown={this.rowMouseDown}
        onMouseUp={this.rowMouseUp}
      >
        <Badge
          className="sentence-badge"
          key={"badge-" + this.props.index}
          variant="light"
        >
          {this.props.index}
        </Badge>
        <span dir={this.props.direction}>
          {this.props.sent.map((tok, index) => (
            <Token
              key={index}
              form={tok}
              space_after={this.props.space_markers[index]}
              label={this.props.labels[index]}
              default_label={this.props.default_labels[index]}
              labelset={this.props.labelset}
              next_token_is_entity={
                index === this.props.sent.length - 1
                  ? false
                  : this.props.labels[index + 1][0] === "I"
              }
              next_token_is_default_entity={
                index === this.props.sent.length - 1
                  ? false
                  : this.props.default_labels[index + 1][0] === "I"
              }
              selected={this.selected_keyword(index)}
              mousedown={() => this.tokenDown(index)}
              mouseup={() => this.tokenUp(index)}
              show_popover={this.showPopoverFunc(index)}
              display_phrase={highlighted_phrase}
              set_label={(label: string) =>
                this.props.set_label(
                  label,
                  this.state.selected_range[0],
                  this.state.selected_range[1]
                )
              }
            />
          ))}
        </span>
      </div>
    );
  }
}

type State = {
  color: string;
  words: Array<Array<string>>;
  labels: Array<Array<string>>;
  default_labels: Array<Array<string>>;
  space_markers: Array<Array<boolean>>;
  path: string;
  selected_range: Array<number>;
  mouseIsDown: boolean;
  popover_index: number;
  prevDoc: string;
  nextDoc: string;
  status: string;
};

type SentProps = {
  index: number;
  sent: string[];
  labels: string[];
  default_labels: string[];
  space_markers: boolean[];
  labelset: { [key: string]: string };
  setFocus: any;
  isActive: boolean;
  set_label: any;
  isReadOnly: boolean;
  direction: string;
};

export default Sentence;

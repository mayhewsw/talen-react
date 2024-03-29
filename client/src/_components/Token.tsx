import React from "react";
import { Popover, Overlay } from "react-bootstrap";
import LabelButton from "./LabelButton";
import { connect } from "react-redux";

class Token extends React.Component<TokProps> {
  private myRef = React.createRef<any>();

  handleOver(evt: any) {
    // if the left button is pressed
    if (evt.buttons === 1) {
      this.props.mouseup();
    }
  }

  componentDidMount() {
    document.addEventListener("contextmenu", this._handleContextMenu);
  }

  _handleContextMenu(event: any) {
    event.preventDefault();
  }

  handleDown(evt: any) {
    // console.log(evt.target.type) -> this will give type button

    if (evt.button === 2) {
      // don't allow right click to open a menu
      //return
    }

    // only fire if you click on a token.
    if (evt.target.classList.contains("token")) {
      this.props.mousedown();
    }
  }

  handleUp(evt: any) {
    if (evt.button === 2) {
      // don't allow right click to open a menu
      this.props.set_label("O");
      return;
    }

    // only fire if you click on a token.
    //if(evt.target.classList.contains("token")){
    this.props.mouseup();
    //}
  }

  render() {
    const tag = this.props.label.split("-").pop() || "O";
    const default_tag = this.props.default_label.split("-").pop() || "O";

    // Decide if we are going to show the main or default label
    // The default label is a starter: perhaps from an ML system
    let display_default;
    if (tag === "O") {
      if (default_tag === "O") {
        display_default = false;
      } else {
        display_default = true;
      }
    } else {
      display_default = false;
    }

    const tag_class = display_default ? default_tag : tag;
    // The 44 at the end is transparency in the RGBA space.
    const background =
      this.props.labelset[tag_class] + (display_default ? "44" : "");
    const default_background = this.props.labelset[default_tag] + "44";

    let labellist = Object.keys(this.props.labelset).sort();
    // TODO: What's going on here?
    const oindex = labellist.indexOf("O");
    labellist.splice(oindex, 1);
    labellist.push("O");

    const label_button_list = labellist.map((label) => (
      <LabelButton
        key={label}
        label={label}
        color={this.props.labelset[label]}
        onClick={() => this.props.set_label(label)}
      />
    ));

    var spacer_list = ["spacer", "nocopy"];
    var spacer_style = { background: "transparent" };

    // it's important that this block (default) come before the other one.
    if (
      this.props.default_label !== "O" &&
      this.props.next_token_is_default_entity
    ) {
      spacer_style.background = default_background;
      spacer_list.push("label");
    }

    if (this.props.label !== "O" && this.props.next_token_is_entity) {
      spacer_style.background = background;
      spacer_list.push("label");
    }

    if (
      this.props.selected === "highlightstart" ||
      this.props.selected === "highlighted"
    ) {
      spacer_list.push("highlighted");
    }

    const class_list = [
      "token",
      "nocopy",
      this.props.selected,
      tag_class,
      display_default ? "default-label" : "label",
    ];

    if (display_default) {
      if (
        !this.props.next_token_is_default_entity &&
        this.props.default_label[0] === "B"
      ) {
        class_list.push("labelsingle");
      } else if (this.props.default_label[0] === "B") {
        class_list.push("labelstart");
      } else if (
        this.props.default_label !== "O" &&
        !this.props.next_token_is_default_entity
      ) {
        class_list.push("labelend");
      }
    } else {
      if (!this.props.next_token_is_entity && this.props.label[0] === "B") {
        class_list.push("labelsingle");
      } else if (this.props.label[0] === "B") {
        class_list.push("labelstart");
      } else if (this.props.label !== "O" && !this.props.next_token_is_entity) {
        class_list.push("labelend");
      }
    }

    return (
      <>
        <span
          className={class_list.join(" ")}
          onMouseDown={(evt) => this.handleDown(evt)}
          onMouseUp={(evt) => this.handleUp(evt)}
          onMouseOver={(evt) => this.handleOver(evt)}
          style={{
            background: background,
            color: this.props.wordsColor,
          }}
          ref={this.myRef}
        >
          {this.props.form}
        </span>
        {/*  this whitespace is needed to get correct line breaks! */}
        {this.props.space_after && (
          <span className={spacer_list.join(" ")} style={spacer_style}>
            {" "}
          </span>
        )}
        <Overlay
          show={this.props.show_popover}
          target={this.myRef.current}
          placement={"bottom"}
          transition={false}
        >
          <Popover id="popover-container">
            <Popover.Title>
              {this.props.display_phrase}{" "}
              <a
                href={`https://www.google.com/search?q=${this.props.display_phrase}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                (Google)
              </a>
            </Popover.Title>
            <Popover.Content>
              <div className="label-box">{label_button_list}</div>
            </Popover.Content>
          </Popover>
        </Overlay>
      </>
    );
  }
}

// TODO: make this STATE
function mapState(state: any) {
  const { data } = state;
  const { wordsColor } = data;
  return { wordsColor };
}

type TokProps = {
  wordsColor: string;
  form: string;
  space_after: boolean;
  label: string;
  default_label: string;
  labelset: { [key: string]: string };
  selected: string;
  mousedown: any;
  mouseup: any;
  show_popover: boolean;
  set_label: any;
  next_token_is_entity: boolean;
  next_token_is_default_entity: boolean;
  display_phrase: string;
};

const actionCreators = {};

const connectedToken = connect(mapState, actionCreators)(Token);
export { connectedToken as Token };

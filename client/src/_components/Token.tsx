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
      console.log("right click down");
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
      console.log("right click up");
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
    if (this.props.label !== "O" && this.props.next_token_is_entity) {
      //spacer_list.push(tag || "");
      spacer_style.background = this.props.labelset[tag];
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
      tag,
      this.props.label === "O" ? null : "label",
    ];

    if (!this.props.next_token_is_entity && this.props.label[0] === "B") {
      class_list.push("labelsingle");
    } else if (this.props.label[0] === "B") {
      class_list.push("labelstart");
    } else if (this.props.label !== "O" && !this.props.next_token_is_entity) {
      class_list.push("labelend");
    }

    return (
      <>
        <span
          className={class_list.join(" ")}
          onMouseDown={(evt) => this.handleDown(evt)}
          onMouseUp={(evt) => this.handleUp(evt)}
          onMouseOver={(evt) => this.handleOver(evt)}
          style={{
            background: this.props.labelset[tag],
            color: this.props.wordsColor,
          }}
          ref={this.myRef}
        >
          {this.props.form}
        </span>
        {/*  this whitespace is needed to get correct line breaks! */}
        <span className={spacer_list.join(" ")} style={spacer_style}>
          {" "}
        </span>
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
  label: string;
  labelset: { [key: string]: string };
  selected: string;
  mousedown: any;
  mouseup: any;
  show_popover: boolean;
  set_label: any;
  next_token_is_entity: boolean;
  display_phrase: string;
};

const actionCreators = {
  //getDocuments: dataActions.getDocuments,
};

const connectedToken = connect(mapState, actionCreators)(Token);
export { connectedToken as Token };

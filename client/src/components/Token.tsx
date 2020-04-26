import React from 'react';
import { Popover, Overlay } from 'react-bootstrap';
import LabelButton from "./LabelButton";

class Token extends React.Component<TokProps>{

    private myRef = React.createRef<any>()
  
    handleOver(evt: any){
      // if the left button is pressed
      if(evt.buttons === 1){
        this.props.mouseup()
      }
    }
  
    handleDown(evt: any){
      // console.log(evt.target.type) -> this will give type button
  
      if(evt.button === 2){
        // don't allow right click to open a menu
        console.log("right click");
        evt.preventDefault();
        evt.stopPropagation();
        evt.persist();      
        return
      }
  
      
      // only fire if you click on a token.
      if(evt.target.classList.contains("token")){
        this.props.mousedown()
      }
  
    }
  
    render() {
  
      // TODO: can this be moved out to save time?
      const label_set = ["PER", "ORG", "LOC", "GPE", "O"]
      const label_button_list = label_set.map((label) => 
        <LabelButton key={label} label={label} onClick={() => this.props.set_label(label)} />    
      );
  
      return (
        <span>
          <span className={[this.props.label.split("-").pop(), "token", "nocopy", this.props.selected].join(" ")}
            onMouseDown={(evt) => this.handleDown(evt)}
            onMouseUp={() => this.props.mouseup()}
            onMouseOver={(evt) => this.handleOver(evt)}
            ref={this.myRef}
          >
            {this.props.form}
          </span>
          <Overlay
            show={this.props.show_popover}
            target={this.myRef.current}
            placement={"bottom"}
          >
            <Popover id="popover-contained">
              <Popover.Content>
                {label_button_list}
              </Popover.Content>
            </Popover>
          </Overlay>
        </span>
  
      );
    }
  }

export default Token;

type TokProps = { 
    form: string, 
    label: string, 
    selected: string,
    mousedown: any,
    mouseup: any,
    show_popover: boolean,
    set_label: any
  };
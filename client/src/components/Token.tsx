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

    componentDidMount(){
      document.addEventListener('contextmenu', this._handleContextMenu);
    }
  
    _handleContextMenu(event: any){
      event.preventDefault();
    }

    handleDown(evt: any){
      // console.log(evt.target.type) -> this will give type button
  
      if(evt.button === 2){
        // don't allow right click to open a menu
        console.log("right click down");    
        //return
      }
        
      // only fire if you click on a token.
      if(evt.target.classList.contains("token")){
        this.props.mousedown()
      }
  
    }

    handleUp(evt: any){
      if(evt.button === 2){
        // don't allow right click to open a menu
        console.log("right click up");
        this.props.set_label("O")    
        return
      }

      // only fire if you click on a token.
      //if(evt.target.classList.contains("token")){
        this.props.mouseup()
      //}
    }
  
    render() {
  
      // TODO: can this be moved out to save time?
      const label_set = ["PER", "ORG", "LOC", "GPE", "O"]
      const label_button_list = label_set.map((label) => 
        <LabelButton key={label} label={label} onClick={() => this.props.set_label(label)} />    
      );
  
      var spacer_list = ["spacer"];
      if(this.props.label !== "O" && this.props.next_token_is_entity){
        spacer_list.push(this.props.label.split("-").pop() || "");
      }

      if(this.props.selected === "highlightstart" || this.props.selected === "highlighted"){
        spacer_list.push("highlighted");
      }

      return (
        <>
          <span className={["token", this.props.label.split("-").pop(), "nocopy", this.props.selected].join(" ")}
            onMouseDown={(evt) => this.handleDown(evt)}
            onMouseUp={(evt) => this.handleUp(evt)}
            onMouseOver={(evt) => this.handleOver(evt)}
            ref={this.myRef}
          >
            {this.props.form}
          </span>
          {/*  this whitespace is needed to get correct line breaks! */}
            <span className={spacer_list.join(" ")}>
              {' '}
            </span> 
          <Overlay
            show={this.props.show_popover}
            target={this.myRef.current}
            placement={"bottom"}
            transition={false}
          >
            <Popover id="popover-container">
              <Popover.Content>
                {label_button_list}
              </Popover.Content>
            </Popover>
          </Overlay>
        </>
  
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
    set_label: any,
    next_token_is_entity: boolean
  };
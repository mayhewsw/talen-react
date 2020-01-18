import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Button, Popover, Container, Row, Overlay } from 'react-bootstrap';

class LabelButton extends React.Component<Props, State>{
  render() {
    return (
      <Button onClick={() => this.props.onClick()}
        className={this.props.label}>{this.props.label}</Button>
    )
  }
}

class Token extends React.Component<TokProps, State>{

  private myRef = React.createRef<any>()

  constructor(props: TokProps) {
    super(props);
  }

  handleClick(evt: any){
    // if the left button is pressed
    if(evt.buttons === 1){
      this.props.mouseup()
    }
  }

  render() {

    return (
      <span className={[this.props.label, "token", "nocopy", this.props.selected].join(" ")} 
          onMouseDown={() => this.props.mousedown()}
          onMouseUp={() => this.props.mouseup()}
          onMouseOver={(evt) => this.handleClick(evt)}
          ref={this.myRef}
        >
        {this.props.form}
      
        <Overlay
          show={this.props.show_popover}
          target={this.myRef.current}
          placement={"bottom"}
        >
          <Popover id="popover-contained">
            <Popover.Content>
              <LabelButton label="per" onClick={() => null}/>
              <LabelButton label="org" onClick={() => null}/>
              <LabelButton label="loc" onClick={() => null}/>
              <LabelButton label="gpe" onClick={() => null}/>
              <LabelButton label="O" onClick={() => null}/>
            </Popover.Content>
          </Popover>
        </Overlay>

      </span>



    );
  }
}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    // TODO: get these from the server.
    // TODO: create a system to have sentences also.
    const words = "these are some words , that form a long sentence .".split(" ");

    this.state = {
      color: "white",
      words: words,
      labels: Array(words.length).fill("O"),
      selected_range: [-1, -1],
      popover_index: -1
    };
  }

  updateColor(new_color: string) {
    this.setState({ color: new_color })
  }

  selected_keyword(i: number){
    var first = this.state.selected_range[0];
    var last = this.state.selected_range[this.state.selected_range.length-1]

    // this could happen if you are dragging backwards.
    // then we switch them!
    if (first > last){
      const tmp = last;
      last = first;
      first = tmp;
    }

    if(first === last && first === i){
      return "highlightsingle";
    }
    if(i === first){
      return "highlightstart";
    }else if(i === last){
      return "highlightend";
    }else if(i > first && i < last){
      return "highlighted";
    }

    return "";
  }

  updateRange(start: number, end: number){
    this.setState({selected_range : [start, end]})
  }

  tokenUp(index: number){
    this.updateRange(this.state.selected_range[0], index)
  }

  tokenDown(index: number){
    this.updateRange(index, index)
  }

  checkClearRange(evt: any){
    const tgt = evt.target;
    if(tgt.classList.contains("token")){
      // do nothing?
    }else{
      this.updateRange(-1,-1);
    }
  }

  render() {

    // logic for updating the range. 
    // if mousedown on a token, that becomes start of the range.
    // if mouse enters a token AND mouse down AND range is consecutive: add to range
    // if mousedown OUTSIDE a token, then clear the range. 
    // if mouseup on a token, that becomes end of the range. 

    const tokenList = this.state.words.map((tok, index) =>
      <Token 
        key={index} 
        form={tok} 
        label={this.state.labels[0]} 
        selected={this.selected_keyword(index)} 
        mousedown={() => this.tokenDown(index)}
        mouseup={() => this.tokenUp(index)}
        show_popover={index == this.state.selected_range[1]}
      />
    );

    return (
      <Container style={{ backgroundColor: this.state.color }} 
          onMouseUp={(evt: any) => this.checkClearRange(evt)}>
        <Row>
          <h1>Annotations!</h1>
        </Row>
        <Row>
        <div>{tokenList}</div>
        </Row>
      </Container>
    );
  }
}

type Props = { label: string, onClick: any };
type State = {
  color: string,
  words: Array<string>,
  labels: Array<string>,
  selected_range: Array<number>,
  popover_index: number
};

type TokProps = { 
  form: string, 
  label: string, 
  selected: string,
  mousedown: any,
  mouseup: any,
  show_popover: boolean
};

export default App;

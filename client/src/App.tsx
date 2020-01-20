import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Button, Popover, Container, Row, Overlay } from 'react-bootstrap';

const axios = require('axios').default;


class LabelButton extends React.Component<Props, State>{

  render() {
    return (
      <Button onClick={() => this.props.onClick()}
        className={["label-button", this.props.label].join(" ")}>{this.props.label}</Button>
    )
  }
}

class Token extends React.Component<TokProps, State>{

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
    const label_set = ["per", "org", "loc", "gpe", "O"]
    const label_button_list = label_set.map((label) => 
      <LabelButton key={label} label={label} onClick={() => this.props.set_label(label)} />    
    );

    return (
      <span>
        <span className={[this.props.label, "token", "nocopy", this.props.selected].join(" ")}
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

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    // TODO: get these from the server.
    // TODO: create a system to have sentences also.
    const words = "these are some words , that form a long sentence .".split(" ");

    axios.post('/getsentence', {
        id: 0
      })
      .then(function (response: any) {
        console.log(response);
      })
      .catch(function (error: any) {
        console.log(error);
    });

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
    console.log(tgt.type);
    if(tgt.classList.contains("token") || tgt.classList.contains("label-button")){
      // do nothing?
    }else{
      this.updateRange(-1,-1);
    }
  }

  setLabel(label: string){
    console.log(label);
    // the problem is that this is (-1, -1) by the time we get here.
    var newLabels = this.state.labels.slice();
    for(var i = this.state.selected_range[0]; i <= this.state.selected_range[1]; i++){
      newLabels[i] = label;
    }
    this.setState({labels: newLabels})
    this.updateRange(-1,-1);
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
        label={this.state.labels[index]} 
        selected={this.selected_keyword(index)} 
        mousedown={() => this.tokenDown(index)}
        mouseup={() => this.tokenUp(index)}
        show_popover={index === this.state.selected_range[1]}
        set_label={(lab: string) => this.setLabel(lab)}
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
  show_popover: boolean,
  set_label: any
};

export default App;

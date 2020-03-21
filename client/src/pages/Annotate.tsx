import React from 'react';

//import './Annotate.css';
import { Button, Container, Row } from 'react-bootstrap';
import Token from "../components/Token";
import Axios from "axios";

class Annotate extends React.Component<any, State> {
  constructor(props: any) {
    super(props);

    // TODO: get these from the server.
    // TODO: create a system to have sentences also.
    var words = "this is a default sentence .".split(" ");
    var self = this;
    // Axios.post('http://localhost:5000/getsentence', 
    //   {
    //     id: 0
    //   })
    //   .then(function (response: any) {
    //     words = response["data"].split(" ");
    //     self.setWords(words);
    //   })
    //   .catch(function (error: any) {
    //     console.log(error);
    // });

    this.state = {
      color: "white",
      words: words,
      labels: Array(words.length).fill("O"),
      selected_range: [-1, -1],
      popover_index: -1
    };
  }

  setWords(words: Array<string>){
    this.setState({
      words: words,
      labels: Array(words.length).fill("O"),
      selected_range: [-1, -1],
    });
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
    if(tgt.classList.contains("token") || tgt.classList.contains("label-button")){
      // do nothing?
    }else{
      this.updateRange(-1,-1);
    }
  }

  setLabel(label: string){
    // the problem is that this is (-1, -1) by the time we get here.
    var newLabels = this.state.labels.slice();
    for(var i = this.state.selected_range[0]; i <= this.state.selected_range[1]; i++){
      newLabels[i] = label;
    }
    this.setState({labels: newLabels})
    this.updateRange(-1,-1);
  }

  sendLabels(){
    var self = this;
    Axios.post('http://localhost:5000//setlabels', 
      {
        words: self.state.words,
        labels: self.state.labels
      })
      .then(function (response: any) {
        console.log(response);
      })
      .catch(function (error: any) {
        console.log(error);
    });
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
        <Row>
          <Button onClick={() => this.sendLabels()}>Save</Button>
        </Row>
      </Container>
    );
  }
}

type State = {
  color: string,
  words: Array<string>,
  labels: Array<string>,
  selected_range: Array<number>,
  popover_index: number
};


export default Annotate;

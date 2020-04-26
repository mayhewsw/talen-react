import React from 'react';

//import './Annotate.css';
import { Button, Container, Row } from 'react-bootstrap';
import Token from "../components/Token";
import Axios from "axios";

import { dataService } from '../_services';

class Annotate extends React.Component<any, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      color: "white",
      words: [[]],
      labels: [[]],
      selected_sentence: -1,
      selected_range: [-1, -1],
      popover_index: -1
    };
  }

  componentDidMount() {
    console.log(this.props);
    //var words = "this is a default sentence .".split(" ");
    dataService.loadDocument(this.props.dataset, this.props.docid)
      .then((res: any) => 
        {console.log(res); 
        this.setState({
          words: res["sentences"],
          labels: res["labels"],
          selected_sentence: -1,
          selected_range: [-1, -1],
          popover_index: -1
        })}
      );
  }

  // setWords(words: Array<string>){
  //   this.setState({
  //     words: [words],
  //     labels: Array(words.length).fill("O"),
  //     selected_range: [-1, -1],
  //   });
  // }

  updateColor(new_color: string) {
    this.setState({ color: new_color })
  }

  selected_keyword(sent_index: number, i: number){
    var first = this.state.selected_range[0];
    var last = this.state.selected_range[this.state.selected_range.length-1]

    if (this.state.selected_sentence !== sent_index){
      return ""
    }

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

  updateRange(sent_index: number, start: number, end: number){
    this.setState({selected_range : [start, end], selected_sentence: sent_index})
  }

  tokenUp(sent_index: number, index: number){
    this.updateRange(sent_index, this.state.selected_range[0], index)
  }

  tokenDown(sent_index: number, index: number){
    this.updateRange(sent_index, index, index)
  }

  checkClearRange(evt: any){
    const tgt = evt.target;
    if(tgt.classList.contains("token") || tgt.classList.contains("label-button")){
      // do nothing?
    }else{
      this.updateRange(-1,-1,-1);
    }
  }

  setLabel(label: string){
    // the problem is that this is (-1, -1) by the time we get here.
    var newLabels = this.state.labels.slice();
    for(var i = this.state.selected_range[0]; i <= this.state.selected_range[1]; i++){
      newLabels[this.state.selected_sentence][i] = label;
    }
    this.setState({labels: newLabels})
    this.updateRange(-1,-1,-1);
  }

  sendLabels(){
    var data = {
      docid: this.props.docid,
      dataset: this.props.dataset,
      sentences: this.state.words,
      labels: this.state.labels
    }
    console.log(data);
    // TODO: this should be dataActions!!
    dataService.saveDocument(data);
  }

  render() {

    // logic for updating the range. 
    // if mousedown on a token, that becomes start of the range.
    // if mouse enters a token AND mouse down AND range is consecutive: add to range
    // if mousedown OUTSIDE a token, then clear the range. 
    // if mouseup on a token, that becomes end of the range. 

    const tokenList = this.state.words.map((sent, sent_index) =>
      <div key={sent_index}>
        {sent.map((tok, index) =>
          <Token 
            key={index} 
            form={tok} 
            label={this.state.labels[sent_index][index]} 
            selected={this.selected_keyword(sent_index, index)} 
            mousedown={() => this.tokenDown(sent_index, index)}
            mouseup={() => this.tokenUp(sent_index, index)}
            show_popover={index === this.state.selected_range[1] && sent_index == this.state.selected_sentence}
            set_label={(lab: string) => this.setLabel(lab)}
          />
        )}
      </div>
    );
    
    return (
      <Container style={{ backgroundColor: this.state.color }} 
          onMouseUp={(evt: any) => this.checkClearRange(evt)}>
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

type Props = {
  state: State,

}

type State = {
  color: string,
  words: Array<Array<string>>,
  labels: Array<Array<string>>,
  selected_sentence: number,
  selected_range: Array<number>,
  popover_index: number
};


export default Annotate;
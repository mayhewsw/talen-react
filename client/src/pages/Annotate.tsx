import React from 'react';

//import './Annotate.css';
import { Button, ButtonGroup, Row, Col, Card } from 'react-bootstrap';
import Sentence from "../components/Sentence";
import { Link, withRouter } from 'react-router-dom';
import { dataService } from '../_services';

class Annotate extends React.Component<any, State> {

  constructor(props: any) {
    super(props);

    this.state = {
      color: "white",
      words: [[]],
      labels: [[]],
      path: "",
      mouseIsDown: false,
      selected_sentence: -1,
      selected_range: [-1, -1],
      popover_index: -1,
      prevDoc: "",
      nextDoc: "",
      status: ""
    };

    this.rowMouseDown = this.rowMouseDown.bind(this);
    this.rowMouseUp = this.rowMouseUp.bind(this);
  }

  componentDidMount() {

    dataService.loadDocument(this.props.dataset, this.props.docid)
      .then((res: any) => 
        { 
        this.setState({
          words: res["sentences"],
          labels: res["labels"],
          path: res["path"],
          selected_sentence: -1,
          selected_range: [-1, -1],
          popover_index: -1
        })}
      );

    dataService.getDocuments(this.props.dataset)
      .then((res: any) => {
        var curr_ind = res["documentIDs"].indexOf(this.props.docid);
        var prevDoc = res["documentIDs"][curr_ind-1];
        var nextDoc = res["documentIDs"][curr_ind+1];


        this.setState({
          prevDoc: prevDoc,
          nextDoc: nextDoc,
          status: `${curr_ind+1}/${res["documentIDs"].length}`
        })

      });

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
    console.log("set label: " + label)

    var first = this.state.selected_range[0];
    var last = this.state.selected_range[this.state.selected_range.length-1]

    // then we switch them!
    if (first > last){
      const tmp = last;
      last = first;
      first = tmp;
    }

    var newLabels = this.state.labels.slice();
    for(var i = first; i <= last; i++){
      var pref = "";
      if(label !== "O"){
        if(i === first){
          pref = "B-";
        }else{
          pref = "I-";
        }
      }else{
        // assumes that all spans start with B-
        // if i+1 is I-, then set i+1 to B-
        var next = newLabels[this.state.selected_sentence][i+1];
        if(next.startsWith("I-")){
          // change the I- to a B-
          newLabels[this.state.selected_sentence][i+1] = "B-" + next.split("-").pop();
        }
      }
      newLabels[this.state.selected_sentence][i] = pref + label;
    }

    // TODO: consider having a single state update here?
    this.setState({labels: newLabels})
    this.updateRange(-1,-1,-1);
  }

  sendLabels(){
    var data = {
      docid: this.props.docid,
      dataset: this.props.dataset,
      sentences: this.state.words,
      labels: this.state.labels,
      path: this.state.path
    }
    // TODO: this should be dataActions!!
    dataService.saveDocument(data);
  }

  rowMouseDown(evt: any){
    if(evt.target.tagName !== "BUTTON"){
      this.setState({mouseIsDown: true})
    }
  }

  rowMouseUp(evt: any){
    this.setState({mouseIsDown: false})
    this.checkClearRange(evt);
  }

  showPopoverFunc(sent_index: number, index: number){
    return !this.state.mouseIsDown && index === this.state.selected_range[1] && sent_index === this.state.selected_sentence
  }
  
  render() {
    // logic for updating the range. 
    // if mousedown on a token, that becomes start of the range.
    // if mouse enters a token AND mouse down AND range is consecutive: add to range
    // if mousedown OUTSIDE a token, then clear the range. 
    // if mouseup on a token, that becomes end of the range. 
    return (
      <Row className="document" style={{ backgroundColor: this.state.color }} 
          onMouseDown={this.rowMouseDown}
          onMouseUp={this.rowMouseUp}
          //onMouseUp={(evt: any) => this.checkClearRange(evt)}
          >
        <Col md={10}>
          <Card>
          <Card.Body>
          {this.state.words.map((sent, sent_index) =>
              <Sentence key={sent_index} index={sent_index} sent={sent} 
              labels={this.state.labels[sent_index]}  
              selected={(index: number) => this.selected_keyword(sent_index, index)} 
              tokmousedown={(index: number) => this.tokenDown(sent_index, index)}
              tokmouseup={(index: number) => this.tokenUp(sent_index, index)}
              show_popover={(index: number) => this.showPopoverFunc(sent_index, index)}
              set_label={(lab: string) => this.setLabel(lab)}
              />
              )}
          </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Button onClick={() => this.sendLabels()}>Save</Button>
          <p><Link to={this.props.uplink}>Back to all docs...</Link></p>
          <ButtonGroup>
            {this.state.prevDoc && <Button variant="outline-primary" href={`/dataset/${this.props.dataset}/${this.state.prevDoc}`}>Previous</Button>}
            {this.state.nextDoc && <Button variant="outline-primary" href={`/dataset/${this.props.dataset}/${this.state.nextDoc}`}>Next</Button>}
          </ButtonGroup>
          {this.state.status && <p>{this.state.status}</p>}
        </Col>
      </Row>
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
  path: string,
  selected_sentence: number,
  selected_range: Array<number>,
  mouseIsDown: boolean,
  popover_index: number,
  prevDoc: string,
  nextDoc: string,
  status: string
};


export default withRouter(Annotate);

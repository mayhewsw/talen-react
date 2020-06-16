import React from 'react';

//import './Annotate.css';
import { Button, ButtonGroup, Row, Col, Card } from 'react-bootstrap';
import Sentence from "../components/Sentence";
import { Link, withRouter } from 'react-router-dom';
import { dataService } from '../_services';
import { history } from '../_helpers';
import { IoIosSave, IoMdCheckmarkCircleOutline, IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

class Annotate extends React.Component<any, State> {

  constructor(props: any) {
    super(props);

    this.state = {
      color: "white",
      words: [[]],
      labels: [[]],
      path: "",
      mouseIsDown: false,
      // selected_sentence: -1,
      // selected_range: [-1, -1],
      // popover_index: -1,
      prevDoc: "",
      nextDoc: "",
      status: "",
      activeSent: -1,
      isSaved: true
    };

  }

  componentDidMount() {
    this.loadAll(this.props.dataset, this.props.docid)
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


  // this came from: https://stackoverflow.com/questions/29425820/elegant-way-to-find-contiguous-subarray-within-an-array-in-javascript
  // CSA is continuous sub array
  find_csa(arr: any, subarr: any, from_index: number) {
    var i = from_index >>> 0,
        sl = subarr.length,
        l = arr.length + 1 - sl;

    var inds = [];

    loop: for (; i<l; i++) {
        for (var j=0; j<sl; j++)
            if (arr[i+j] !== subarr[j])
                continue loop;
        inds.push(i)
    }
    return inds;
}

  setLabel(label: string, first: number, last: number, sent_index: number){
    this.setState({isSaved: false})
    console.log("set label: " + label)

    // var first = this.state.selected_range[0];
    // var last = this.state.selected_range[this.state.selected_range.length-1]

    // then we switch them!
    if (first > last){
      const tmp = last;
      last = first;
      first = tmp;
    }

    //TODO: make sure everything is lower case!

    // get the string associated with this range
    var word_slice = this.state.words[sent_index].slice(first, last+1);

    var phrase_locations: number[][] = [];

    for(var j=0; j < this.state.words.length; j++){
      var inds = this.find_csa(this.state.words[j], word_slice, 0);
      inds.forEach(ind => phrase_locations.push([j, ind, ind + word_slice.length-1]))
    }

    var newLabels = this.state.labels.slice();

    phrase_locations.forEach(tuple => {
      //console.log(tuple);
      var phrase_sent = tuple[0];
      var phrase_start = tuple[1];
      var phrase_end = tuple[2];

      for(var i = phrase_start; i <= phrase_end; i++){
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
          var next = newLabels[phrase_sent][i+1];
          if(next.startsWith("I-")){
            // change the I- to a B-
            newLabels[phrase_sent][i+1] = "B-" + next.split("-").pop();
          }
        }
        newLabels[phrase_sent][i] = pref + label;
      }

    });

    // TODO: consider having a single state update here?
    this.setState({labels: newLabels, activeSent: -1})
  }

  sendLabels(){
    this.setState({isSaved : true})
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

  setFocus(sent_index: number){
    console.log(`sentence ${sent_index} wants focus now!`);
    this.setState({activeSent: sent_index})
  }

  loadAll(dataset: string, docId: string){
    dataService.loadDocument(dataset, docId)
    .then((res: any) => 
      { 
      this.setState({
        words: res["sentences"],
        labels: res["labels"],
        path: res["path"],
      })}
    );

  dataService.getDocuments(dataset)
    .then((res: any) => {
      var curr_ind = res["documentIDs"].indexOf(docId);
      var prevDoc = res["documentIDs"][curr_ind-1];
      var nextDoc = res["documentIDs"][curr_ind+1];

      this.setState({
        prevDoc: prevDoc,
        nextDoc: nextDoc,
        status: `${curr_ind+1}/${res["documentIDs"].length}`
      })
    });
  }


  buttonPush(dataset: string, newDoc: string){

    // this is a very important line
    // don't save docs that have not been touched!
    if(!this.state.isSaved){
      this.sendLabels();
    }

    var url = `/dataset/${dataset}/${newDoc}`;
    this.loadAll(dataset, newDoc);
    history.push(url);
  }
  
  render() {
    // logic for updating the range. 
    // if mousedown on a token, that becomes start of the range.
    // if mouse enters a token AND mouse down AND range is consecutive: add to range
    // if mousedown OUTSIDE a token, then clear the range. 
    // if mouseup on a token, that becomes end of the range. 
    return (
      <Row className="document" style={{ backgroundColor: this.state.color }} 
          // onMouseDown={this.rowMouseDown}
          // onMouseUp={this.rowMouseUp}
          //onMouseUp={(evt: any) => this.checkClearRange(evt)}
          >
        <Col md={9}>
          <Card>
          <Card.Body>
          {this.state.words.map((sent, sent_index) =>
              <Sentence key={sent_index} index={sent_index} sent={sent} 
              labels={this.state.labels[sent_index]}
              setFocus={(ind: number) => this.setFocus(ind)}
              isActive={sent_index == this.state.activeSent}
              set_label={(lab: string, first: number, last: number) => this.setLabel(lab, first, last, sent_index)}
              />
              )}
          </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          {this.state.isSaved &&           
          <Button variant="outline-success"><><IoMdCheckmarkCircleOutline /> Saved</></Button>}
          {!this.state.isSaved && 
          <Button variant="outline-danger" onClick={() => this.sendLabels()}><><IoIosSave /> Save</></Button>}
          <p><Link to={this.props.uplink}>Back to all docs...</Link></p>
          <ButtonGroup>
            {this.state.prevDoc && <Button variant="outline-primary" onClick={() => this.buttonPush(this.props.dataset, this.state.prevDoc)}><IoIosArrowBack /> Previous</Button>}
            {this.state.nextDoc && <Button variant="outline-primary" onClick={() => this.buttonPush(this.props.dataset, this.state.nextDoc)}>Next <IoIosArrowForward /></Button>}
          </ButtonGroup>
          {this.state.status && <p>{this.state.status}</p>}
        </Col>
      </Row>
    );
  }
}

type State = {
  isSaved: boolean;
  color: string,
  words: Array<Array<string>>,
  labels: Array<Array<string>>,
  path: string,
  // selected_sentence: number,
  // selected_range: Array<number>,
  mouseIsDown: boolean,
  // popover_index: number,
  prevDoc: string,
  nextDoc: string,
  status: string,
  activeSent: number
};


export default withRouter(Annotate);

import React, { ChangeEvent } from "react";
import { cloneDeep } from "lodash";
import { Button, ButtonGroup, Row, Col, Card, Form } from "react-bootstrap";
import Sentence from "./Sentence";
import { Link, withRouter } from "react-router-dom";
import { history } from "../_helpers";
import {
  IoIosSave,
  IoMdCheckmarkCircleOutline,
  IoIosArrowForward,
  IoIosArrowBack,
} from "react-icons/io";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { dataActions } from "../_actions";

class Annotate extends React.Component<MatchProps, State> {
  constructor(props: MatchProps) {
    super(props);
    console.log(props);
    this.state = {
      activeSent: -1,
      isSaved: true,
      propagate: true,
    };
  }

  componentDidMount() {
    this.loadAll(this.props.dataset, this.props.docid);
  }

  // this came from: https://stackoverflow.com/questions/29425820/elegant-way-to-find-contiguous-subarray-within-an-array-in-javascript
  // CSA is continuous sub array
  find_csa(arr: string[], subarr: string[], from_index: number) {
    let i = from_index >>> 0,
      sl = subarr.length,
      l = arr.length + 1 - sl;

    let inds = [];

    loop: for (; i < l; i++) {
      // TODO: consider adding another option to control whether it should propagate on lower case.
      for (let j = 0; j < sl; j++)
        if (arr[i + j].toLowerCase() !== subarr[j].toLowerCase()) continue loop;
      inds.push(i);
    }
    return inds;
  }

  setLabel(label: string, first: number, last: number, sent_index: number) {
    this.setState({ isSaved: false });
    console.log("set label: " + label);

    // then we switch them!
    if (first > last) {
      const tmp = last;
      last = first;
      first = tmp;
    }

    //TODO: make sure everything is lower case!
    console.log(`propagate? ${this.state.propagate}`);

    // get the string associated with this range
    var word_slice = this.props.data.words[sent_index].slice(first, last + 1);

    var phrase_locations: number[][] = [];
    if (this.state.propagate) {
      for (let j = 0; j < this.props.data.words.length; j++) {
        var inds = this.find_csa(this.props.data.words[j], word_slice, 0);
        inds.forEach((ind) =>
          phrase_locations.push([j, ind, ind + word_slice.length - 1])
        );
      }
    } else {
      // only put the target phrase location
      phrase_locations.push([sent_index, first, last]);
    }

    // I don't want to modify the state variable!
    var newLabels = cloneDeep(this.props.data.labels);

    phrase_locations.forEach((tuple) => {
      //console.log(tuple);
      var phrase_sent = tuple[0];
      var phrase_start = tuple[1];
      var phrase_end = tuple[2];

      // dont' update something in the middle of an annotated entity
      if (this.props.data.labels[phrase_sent][phrase_start][0] === "I") {
        return;
      }

      for (var i = phrase_start; i <= phrase_end; i++) {
        var pref = "";
        if (label !== "O") {
          if (i === phrase_start) {
            pref = "B-";
          } else {
            pref = "I-";
          }
        } else {
          // assumes that all spans start with B-
          // if i+1 is I-, then set i+1 to B-
          var next = newLabels[phrase_sent][i + 1];
          if (next && next.startsWith("I-")) {
            // change the I- to a B-
            newLabels[phrase_sent][i + 1] = "B-" + next.split("-").pop();
          }
        }
        newLabels[phrase_sent][i] = pref + label;
      }
    });

    this.props.setLabels(newLabels);
    // TODO: update labels here!
    this.setState({ activeSent: -1 });
  }

  sendLabels() {
    this.setState({ isSaved: true });
    var data = {
      docid: this.props.docid,
      dataset: this.props.dataset,
      sentences: this.props.data.words,
      labels: this.props.data.labels,
      path: this.props.data.path,
    };
    this.props.saveDocument(data);
    this.props.data.isAnnotated = true;
  }

  setFocus(sent_index: number) {
    console.log(`sentence ${sent_index} wants focus now!`);
    this.setState({ activeSent: sent_index });
  }

  loadAll(dataset: string, docId: string) {
    this.props.loadDocument(dataset, docId);
    this.props.loadStatus(dataset, docId);
  }

  buttonPush(dataset: string, newDoc: string) {
    // this is a very important line
    // don't save docs that have not been touched!
    // if (!this.state.isSaved) {
    //   this.sendLabels();
    // }

    const labels = this.props.data.labels;
    let hasLabel = false;
    for (let i = 0; i < labels.length; i++) {
      const sent = labels[i];
      for (let j = 0; j < sent.length; j++) {
        const label = sent[j];
        if (label !== "O") {
          hasLabel = true;
          break;
        }
      }
    }

    let confirmed = true;
    if (hasLabel && !this.state.isSaved) {
      confirmed = window.confirm(
        "There are unsaved labels! Press OK to discard labels, and cancel to stay on this page."
      );
    }

    if (confirmed) {
      var url = `/dataset/${dataset}/${newDoc}`;
      this.loadAll(dataset, newDoc);
      history.push(process.env.PUBLIC_URL + url);
    }
  }

  render() {
    const { data } = this.props;

    // logic for updating the range.
    // if mousedown on a token, that becomes start of the range.
    // if mouse enters a token AND mouse down AND range is consecutive: add to range
    // if mousedown OUTSIDE a token, then clear the range.
    // if mouseup on a token, that becomes end of the range.
    return (
      <Row className="document">
        <Col md={9}>
          <Card>
            <Card.Body>
              {data.words &&
                data.labelset &&
                data.words.map((sent: string[], sent_index: number) => (
                  <Sentence
                    key={sent_index}
                    index={sent_index}
                    sent={sent}
                    labels={data.labels[sent_index]}
                    labelset={data.labelset}
                    setFocus={(ind: number) => this.setFocus(ind)}
                    isActive={sent_index === this.state.activeSent}
                    set_label={(lab: string, first: number, last: number) =>
                      this.setLabel(lab, first, last, sent_index)
                    }
                  />
                ))}
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          {this.state.isSaved && data.isAnnotated && (
            <Button variant="outline-success">
              <>
                <IoMdCheckmarkCircleOutline /> Saved
              </>
            </Button>
          )}
          {(!this.state.isSaved || !data.isAnnotated) && (
            <Button variant="outline-danger" onClick={() => this.sendLabels()}>
              <>
                <IoIosSave /> Save
              </>
            </Button>
          )}
          <p></p>
          {data.status && <p>{data.status}</p>}
          <p></p>
          <Form>
            <div className="mb-3">
              <Form.Check
                onChange={(evt: ChangeEvent<HTMLInputElement>) =>
                  this.setState({ propagate: evt.target.checked })
                }
                defaultChecked={this.state.propagate}
                id="propagation-checkbox"
                type="checkbox"
                label="Propagate annotations?"
              />
            </div>
          </Form>
          <p></p>
          <ButtonGroup>
            {data.prevDoc && (
              <Button
                variant="outline-primary"
                onClick={() =>
                  this.buttonPush(this.props.dataset, data.prevDoc)
                }
              >
                <IoIosArrowBack /> Previous
              </Button>
            )}
            {data.nextDoc && (
              <Button
                variant="outline-primary"
                onClick={() =>
                  this.buttonPush(this.props.dataset, this.props.data.nextDoc)
                }
              >
                Next <IoIosArrowForward />
              </Button>
            )}
          </ButtonGroup>
          <p></p>
          <ButtonGroup>
            <Link to={`${this.props.uplink}`}>
              <Button variant="outline-secondary">Back to all docs...</Button>
            </Link>
          </ButtonGroup>
        </Col>
      </Row>
    );
  }
}

// TODO: fix the any!!
interface MatchProps extends RouteComponentProps<MatchParams> {
  data: any;
  dataset: string;
  docid: string;
  uplink: string;
  setLabels: any;
  saveDocument: any;
  loadDocument: any;
  loadStatus: any;
}

interface MatchParams {}

// TODO: move this state into the main state?
type State = {
  isSaved: boolean;
  activeSent: number;
  propagate: boolean;
};

// TODO: fix this any...
function mapState(state: any) {
  const { data } = state;
  return { data };
}

const actionCreators = {
  saveDocument: dataActions.saveDocument,
  loadDocument: dataActions.loadDocument,
  loadStatus: dataActions.loadStatus,
  setLabels: dataActions.setLabels,
};

const connectedAnnotate = connect(
  mapState,
  actionCreators
)(withRouter(Annotate));
export { connectedAnnotate as Annotate };

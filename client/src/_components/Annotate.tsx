import React, { ChangeEvent } from "react";
import { cloneDeep } from "lodash";
import { Button, Row, Col, Card, Form } from "react-bootstrap";
import Sentence from "./Sentence";
import { withRouter } from "react-router-dom";
import { IoIosSave, IoMdCheckmarkCircleOutline } from "react-icons/io";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { dataActions } from "../_actions";

class Annotate extends React.Component<MatchProps, State> {
  constructor(props: MatchProps) {
    super(props);
    // FIXME: why does this have it's own state??
    this.state = {
      activeSent: -1,
      isSaved: true,
      propagate: true,
    };
    // Bind these functions so the s-key save shortcut works
    this.handleKey = this.handleKey.bind(this);
    this.sendLabels = this.sendLabels.bind(this);
    this.setLabel = this.setLabel.bind(this);
    this.mergeDefaultAnnotations = this.mergeDefaultAnnotations.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKey);
    this.loadAll(this.props.dataset, this.props.docid);
  }

  componentDidUpdate(prevProps: MatchProps) {
    if (this.props.docid !== prevProps.docid) {
      this.loadAll(this.props.dataset, this.props.docid);
    }
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
    if (this.props.readOnly) {
      return;
    }

    this.setState({ isSaved: false });

    // then we switch them!
    if (first > last) {
      const tmp = last;
      last = first;
      first = tmp;
    }

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
      var phrase_sent = tuple[0];
      var phrase_start = tuple[1];
      var phrase_end = tuple[2];

      var current_labels = this.props.data.labels[phrase_sent].slice(
        phrase_start,
        phrase_end + 1
      );
      var next_label = this.props.data.labels[phrase_sent][phrase_end + 1];

      // don't update something in the middle of an annotated entity
      if (current_labels[0][0] === "I" && label !== "O") {
        return;
      }

      // don't update something that is the prefix of an annotated entity
      if (
        current_labels[0][0] === "B" &&
        next_label &&
        next_label[0] === "I" &&
        label !== "O"
      ) {
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
    if (this.state.isSaved && this.props.data.isAnnotated) {
      console.log("no need to resave...");
      return;
    }
    this.setState({ isSaved: true });
    var data = {
      docid: this.props.docid,
      dataset: this.props.dataset,
      sentences: this.props.data.words,
      labels: this.props.data.labels,
      default_labels: this.props.data.default_labels,
      path: this.props.data.path,
    };
    this.props.saveDocument(data);
    this.props.data.isAnnotated = true;
  }

  handleKey(e: any) {
    if (e.key === "s") {
      console.log("saving...");
      this.sendLabels();
    }

    // if (e.key === "m") {
    //   this.mergeDefaultAnnotations();
    // }

    if (e.key === "0") {
      console.log("setting 0");
      // TODO: make this call the current button
      // this.setLabel("PER", 0,1,this.state.activeSent);
    }
  }

  setFocus(sent_index: number) {
    console.log(`sentence ${sent_index} wants focus now!`);
    this.setState({ activeSent: sent_index });
  }

  loadAll(dataset: string, docId: string) {
    this.props.loadDocument(dataset, docId);
  }

  // This function determines if the given document has any unsaved labels.
  // TODO: use this in the proper context
  currentDocHasUnsavedLabels(): boolean {
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

    return hasLabel && !this.state.isSaved;
  }

  mergeDefaultAnnotations() {
    const df = this.props.data.default_labels;
    const mine = this.props.data.labels;
    const merged = mine.map((sent: string[], sent_index: number) => {
      return sent.map((label: string, label_index: number) => {
        const default_label = df[sent_index][label_index];
        const new_label = label === "O" ? default_label : label;
        return new_label;
      });
    });
    this.props.setLabels(merged);
    this.setState({ isSaved: false });
  }

  render() {
    const { data, docid } = this.props;

    // logic for updating the range.
    // if mousedown on a token, that becomes start of the range.
    // if mouse enters a token AND mouse down AND range is consecutive: add to range
    // if mousedown OUTSIDE a token, then clear the range.
    // if mouseup on a token, that becomes end of the range.
    return (
      <div>
        <div className="annotate-header">
          <Row>
            <Col>
              <div className="doc-title">{docid}</div>
            </Col>
          </Row>
          <Row className="align-items-baseline">
            <Col md={12}>
              <Form className="mb-3 form-inline">
                {!this.props.readOnly &&
                  this.state.isSaved &&
                  data.isAnnotated && (
                    <Button variant="outline-success">
                      <>
                        <IoMdCheckmarkCircleOutline /> Saved
                      </>
                    </Button>
                  )}

                {!this.props.readOnly &&
                  (!this.state.isSaved || !data.isAnnotated) && (
                    <Button
                      variant="outline-danger"
                      onClick={() => this.sendLabels()}
                    >
                      <>
                        <IoIosSave /> Save
                      </>
                    </Button>
                  )}
                {!this.props.readOnly && (
                  <Form.Check
                    onChange={(evt: ChangeEvent<HTMLInputElement>) =>
                      this.setState({ propagate: evt.target.checked })
                    }
                    defaultChecked={this.state.propagate}
                    id="propagation-checkbox"
                    type="checkbox"
                    label="Propagate annotations?"
                    className="pl-3 pr-3"
                  />
                )}
                {/* <Button
                  variant="outline-primary"
                  onClick={this.mergeDefaultAnnotations}
                >
                  <>
                    <IoMdCopy /> Merge default annotations
                  </>
                </Button> */}
              </Form>
            </Col>
          </Row>
        </div>
        <Row className="document">
          <Col md={11}>
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
                      default_labels={data.default_labels[sent_index]}
                      space_markers={data.space_markers[sent_index]}
                      labelset={data.labelset}
                      setFocus={(ind: number) => this.setFocus(ind)}
                      isActive={sent_index === this.state.activeSent}
                      set_label={(lab: string, first: number, last: number) =>
                        this.setLabel(lab, first, last, sent_index)
                      }
                      isReadOnly={this.props.readOnly}
                    />
                  ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

// TODO: fix the any!!
interface MatchProps extends RouteComponentProps<MatchParams> {
  data: any;
  dataset: string;
  docid: string;
  uplink: string;
  readOnly: boolean;
  setLabels: Function;
  saveDocument: Function;
  loadDocument: Function;
  loadStatus: Function;
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
  const { data, authentication } = state;
  const docid = data.currDoc;
  const readOnly = authentication.user.readOnly;
  return { data, docid, readOnly };
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

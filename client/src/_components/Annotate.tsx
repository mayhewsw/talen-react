import React, {
  ChangeEvent,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { Button, Row, Col, Card, Form } from "react-bootstrap";
import Sentence from "./Sentence";
import { IoIosSave, IoMdCheckmarkCircleOutline } from "react-icons/io";
import { connect } from "react-redux";
import { dataActions } from "../_actions";
import { useAuth } from "../contexts/AuthContext";

interface SaveDocumentPayload {
  docid: string;
  dataset: string;
  sentences: string[][];
  labels: string[][];
  default_labels: string[][];
  path: string;
}

interface Props {
  data: {
    words: string[][];
    labels: string[][];
    default_labels: string[][];
    space_markers: boolean[][];
    labelset: { [key: string]: string };
    isAnnotated: boolean;
    path: string;
    currDoc: string;
  };
  dataset: string;
  docid: string;
  uplink: string;
  isSaved: boolean;
  setLabels: (labels: string[][]) => void;
  saveDocument: (data: SaveDocumentPayload) => void;
  loadDocument: (dataset: string, docId: string) => void;
  loadStatus: (dataset: string, docId: string) => void;
}

const Annotate: React.FC<Props> = ({
  data,
  dataset,
  docid,
  isSaved,
  setLabels,
  saveDocument,
  loadDocument,
}) => {
  const [activeSent, setActiveSent] = useState(-1);
  const [propagate, setPropagate] = useState(true);
  const { user: authUser } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // this came from: https://stackoverflow.com/questions/29425820/elegant-way-to-find-contiguous-subarray-within-an-array-in-javascript
  // CSA is continuous sub array
  const find_csa = useCallback(
    (arr: string[], subarr: string[], from_index: number): number[] => {
      let i = from_index >>> 0,
        sl = subarr.length,
        l = arr.length + 1 - sl;

      let inds: number[] = [];

      loop: for (; i < l; i++) {
        // TODO: consider adding another option to control whether it should propagate on lower case.
        for (let j = 0; j < sl; j++)
          if (arr[i + j].toLowerCase() !== subarr[j].toLowerCase())
            continue loop;
        inds.push(i);
      }
      return inds;
    },
    []
  );

  const isReadOnly = authUser?.readOnly;

  const setLabel = useCallback(
    (label: string, first: number, last: number, sent_index: number) => {
      if (isReadOnly) {
        return;
      }

      // then we switch them!
      if (first > last) {
        const tmp = last;
        last = first;
        first = tmp;
      }

      // get the string associated with this range
      const word_slice = data.words[sent_index].slice(first, last + 1);

      let phrase_locations: number[][] = [];
      if (propagate) {
        for (let j = 0; j < data.words.length; j++) {
          const inds = find_csa(data.words[j], word_slice, 0);
          inds.forEach((ind) =>
            phrase_locations.push([j, ind, ind + word_slice.length - 1])
          );
        }
      } else {
        // only put the target phrase location
        phrase_locations.push([sent_index, first, last]);
      }

      // I don't want to modify the state variable!
      const newLabels = JSON.parse(JSON.stringify(data.labels));

      phrase_locations.forEach((tuple) => {
        const phrase_sent = tuple[0];
        const phrase_start = tuple[1];
        const phrase_end = tuple[2];

        const current_labels = data.labels[phrase_sent].slice(
          phrase_start,
          phrase_end + 1
        );
        const next_label = data.labels[phrase_sent][phrase_end + 1];

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

        for (let i = phrase_start; i <= phrase_end; i++) {
          let pref = "";
          if (label !== "O") {
            if (i === phrase_start) {
              pref = "B-";
            } else {
              pref = "I-";
            }
          } else {
            // assumes that all spans start with B-
            // if i+1 is I-, then set i+1 to B-
            const next = newLabels[phrase_sent][i + 1];
            if (next && next.startsWith("I-")) {
              // change the I- to a B-
              newLabels[phrase_sent][i + 1] = "B-" + next.split("-").pop();
            }
          }
          newLabels[phrase_sent][i] = pref + label;
        }
      });

      setLabels(newLabels);
      setActiveSent(-1);
    },
    [isReadOnly, data.words, data.labels, propagate, find_csa, setLabels]
  );

  const sendLabels = useCallback(() => {
    if (isSaved && data.isAnnotated) {
      console.log("no need to resave...");
      return;
    }
    const payload = {
      docid: docid,
      dataset: dataset,
      sentences: data.words,
      labels: data.labels,
      default_labels: data.default_labels,
      path: data.path,
    };
    saveDocument(payload);
    data.isAnnotated = true;
  }, [isSaved, data, docid, dataset, saveDocument]);

  const saveIfLabels = useCallback(() => {
    if (data && data.labels) {
      // check if nested list is all O
      const all_labels_O = data.labels.reduce(
        (prev: boolean, curr: string[]) => {
          const sentResult = curr.reduce(
            (p: boolean, c: string) => p && c === "O",
            true
          );
          return prev && sentResult;
        },
        true
      );
      if (!all_labels_O) {
        sendLabels();
      }
    }
  }, [data, sendLabels]);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "s") {
        console.log("saving...");
        sendLabels();
      }

      if (e.key === "0") {
        console.log("setting 0");
        // TODO: make this call the current button
        // setLabel("PER", 0,1,activeSent);
      }
    },
    [sendLabels]
  );

  const setFocus = useCallback((sent_index: number) => {
    console.log(`sentence ${sent_index} wants focus now!`);
    setActiveSent(sent_index);
  }, []);

  // Commented out - not currently used but kept for future use
  // const mergeDefaultAnnotations = useCallback(() => {
  //   const df = data.default_labels;
  //   const mine = data.labels;
  //   const merged = mine.map((sent: string[], sent_index: number) => {
  //     return sent.map((label: string, label_index: number) => {
  //       const default_label = df[sent_index][label_index];
  //       const new_label = label === "O" ? default_label : label;
  //       return new_label;
  //     });
  //   });
  //   setLabels(merged);
  // }, [data.default_labels, data.labels, setLabels]);

  // Load document on mount or when docid changes
  useEffect(() => {
    loadDocument(dataset, docid);
  }, [dataset, docid, loadDocument]);

  // Setup keyboard listener
  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, [handleKey]);

  // Setup auto-save interval
  useEffect(() => {
    intervalRef.current = setInterval(saveIfLabels, 10000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [saveIfLabels]);

  // Commented out - not currently used but kept for future use
  // This function determines if the given document has any unsaved labels.
  // TODO: use this in the proper context
  // const currentDocHasUnsavedLabels = useCallback((): boolean => {
  //   const labels = data.labels;
  //   let hasLabel = false;
  //   for (let i = 0; i < labels.length; i++) {
  //     const sent = labels[i];
  //     for (let j = 0; j < sent.length; j++) {
  //       const label = sent[j];
  //       if (label !== "O") {
  //         hasLabel = true;
  //         break;
  //       }
  //     }
  //   }
  //   return hasLabel && !isSaved;
  // }, [data.labels, isSaved]);

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
              {!authUser?.readOnly && isSaved && data.isAnnotated && (
                <Button variant="outline-success">
                  <>
                    <IoMdCheckmarkCircleOutline /> Saved
                  </>
                </Button>
              )}

              {!authUser?.readOnly && (!isSaved || !data.isAnnotated) && (
                <Button variant="outline-danger" onClick={() => sendLabels()}>
                  <>
                    <IoIosSave /> Save
                  </>
                </Button>
              )}
              {!authUser?.readOnly && (
                <Form.Check
                  onChange={(evt: ChangeEvent<HTMLInputElement>) =>
                    setPropagate(evt.target.checked)
                  }
                  checked={propagate}
                  id="propagation-checkbox"
                  type="checkbox"
                  label="Propagate annotations?"
                  className="pl-3 pr-3"
                />
              )}
              {/* <Button
                  variant="outline-primary"
                  onClick={mergeDefaultAnnotations}
                >
                  <>
                    <IoMdCopy /> Merge default annotations
                  </>
                </Button> */}
            </Form>
          </Col>
        </Row>
      </div>
      <Row className="document extra-bottom-pad">
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
                    setFocus={(ind: number) => setFocus(ind)}
                    isActive={sent_index === activeSent}
                    set_label={(lab: string, first: number, last: number) =>
                      setLabel(lab, first, last, sent_index)
                    }
                    isReadOnly={authUser?.readOnly || false}
                    direction={dataset.startsWith("he") ? "rtl" : "ltr"}
                  />
                ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

interface ReduxState {
  data: {
    words: string[][];
    labels: string[][];
    default_labels: string[][];
    space_markers: boolean[][];
    labelset: { [key: string]: string };
    isAnnotated: boolean;
    path: string;
    currDoc: string;
    isSaved: boolean;
  };
}

function mapState(state: ReduxState) {
  const { data } = state;
  const docid = data.currDoc;
  const isSaved = data.isSaved;
  return { data, docid, isSaved };
}

const actionCreators = {
  saveDocument: dataActions.saveDocument,
  loadDocument: dataActions.loadDocument,
  loadStatus: dataActions.loadStatus,
  setLabels: dataActions.setLabels,
};

const connectedAnnotate = connect(mapState, actionCreators)(Annotate);
export { connectedAnnotate as Annotate };

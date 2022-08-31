import React from "react";
import { connect } from "react-redux";
import { ListGroup, ProgressBar } from "react-bootstrap";
import { dataActions } from "../_actions";
import { Badge } from "react-bootstrap";

import { IoMdCheckmarkCircleOutline } from "react-icons/io";

// This shows you all the documents in a given dataset.

class DocumentList extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    // Bind these functions so the s-key save shortcut works
    this.handleKey = this.handleKey.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKey);
    const { dataset_id, data } = this.props;
    if (data.documentList.length === 0) {
      this.props.getDocuments(dataset_id);
    }

    if (data.words.length > 0) {
      this.props.clearDocument();
    }
  }

  handleKey(e: any) {
    const { data } = this.props;

    var currDocIndex = data.documentList.indexOf(data.currDoc);

    if (e.key === "ArrowDown" && currDocIndex + 1 < data.documentList.length) {
      var nextid = data.documentList[currDocIndex + 1];
      this.props.clearDocument();
      this.props.setCurrDocument(nextid);
    }
    if (e.key === "ArrowUp" && currDocIndex > 0) {
      var previd = data.documentList[currDocIndex - 1];
      this.props.clearDocument();
      this.props.setCurrDocument(previd);
    }
  }

  handleDocumentClick(id: string) {
    // color all words grey in case it takes a second to load the doc
    // but only if we aren't clicking on the current document
    if (this.props.data.currDoc !== id) {
      this.props.clearDocument();
      this.props.setCurrDocument(id);
    }
  }

  render() {
    const { data } = this.props;

    const { currDoc } = data;

    const progress = Math.floor(
      (100 * data.annotatedDocumentSet.size) / data.documentList.length
    );

    return (
      <div className="document-list-panel">
        {data &&
          data.datasetName &&
          data.documentList &&
          data.annotatedDocumentSet && (
            <div className="document-list-header">
              <h2 className="dataset-title">{data.datasetName}</h2>
              <p>
                There are {data.documentList.length} documents. Of these,{" "}
                {data.annotatedDocumentSet.size} have been annotated (marked
                with <IoMdCheckmarkCircleOutline />
                ).
              </p>
              <div className="mb-3">
                <ProgressBar
                  variant="success"
                  now={progress}
                  label={`${progress}%`}
                />
              </div>
            </div>
          )}
        <ListGroup variant="flush" className="document-list">
          {data &&
            data.documentList &&
            data.documentList.map((id: string, index: number) => (
              <ListGroup.Item
                action
                key={index}
                onClick={() => this.handleDocumentClick(id)}
                variant={id === currDoc ? "primary" : undefined}
              >
                <span className="document-list-item">
                  <Badge
                    className="sentence-badge"
                    key={"badge-" + index}
                    variant={id === currDoc ? "primary" : "light"}
                  >
                    {index + 1}
                  </Badge>
                  <span
                    className={
                      data.annotatedDocumentSet.has(id)
                        ? "document-list-item-id document-list-item-id-annotated"
                        : "document-list-item-id"
                    }
                  >
                    {id}
                  </span>
                  {data.annotatedDocumentSet.has(id) && (
                    <IoMdCheckmarkCircleOutline className="check-mark" />
                  )}
                </span>
              </ListGroup.Item>
            ))}
        </ListGroup>
      </div>
    );
  }
}

// TODO: fix the any!!
type Props = {
  getDocuments: Function;
  clearDocument: Function;
  setCurrDocument: Function;
  data: any;
  dataset_id: string;
};

// TODO: make this STATE
function mapState(state: any) {
  const { authentication, data } = state;
  const { user } = authentication;
  return { user, data };
}

const actionCreators = {
  getDocuments: dataActions.getDocuments,
  clearDocument: dataActions.clearDocument,
  setCurrDocument: dataActions.setCurrDocument,
};

const connectedDocumentList = connect(mapState, actionCreators)(DocumentList);
export { connectedDocumentList as DocumentList };

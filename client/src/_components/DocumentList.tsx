import React from "react";
import { connect } from "react-redux";
import { ListGroup, ProgressBar } from "react-bootstrap";
import { dataActions } from "../_actions";
import { Badge } from "react-bootstrap";

import { IoMdCheckmarkCircleOutline } from "react-icons/io";

// This shows you all the documents in a given dataset.

class DocumentList extends React.Component<Props> {
  componentDidMount() {
    const { dataset_id, data } = this.props;
    if (data.documentList.length === 0) {
      this.props.getDocuments(dataset_id);
    }

    if (data.words.length > 0) {
      this.props.clearDocument();
    }
  }

  render() {
    const { data } = this.props;

    const { currDoc } = data;

    const progress = Math.floor(
      (100 * data.annotatedDocumentSet.length) / data.documentList.length
    );

    return (
      <div className="document-list-panel">
        {data &&
          data.datasetName &&
          data.documentList &&
          data.annotatedDocumentSet && (
            <div>
              <h2 className="dataset-title">{data.datasetName}</h2>
              <p>
                There are {data.documentList.length} documents. Of these,{" "}
                {data.annotatedDocumentSet.length} have been annotated (marked
                with <IoMdCheckmarkCircleOutline />
                ).
              </p>
              <p>
                <ProgressBar
                  variant="success"
                  now={progress}
                  label={`${progress}%`}
                />
              </p>
            </div>
          )}
        <ListGroup variant="flush" className="document-list">
          {data &&
            data.documentList &&
            data.documentList.map((id: string, index: number) => (
              <ListGroup.Item
                action
                key={index}
                onClick={() => this.props.setCurrDocument(id)}
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
                      data.annotatedDocumentSet.indexOf(id) > -1
                        ? "document-list-item-id document-list-item-id-annotated"
                        : "document-list-item-id"
                    }
                  >
                    {id}
                  </span>
                  {data.annotatedDocumentSet.indexOf(id) > -1 && (
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
  getDocuments: any;
  clearDocument: any;
  setCurrDocument: any;
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

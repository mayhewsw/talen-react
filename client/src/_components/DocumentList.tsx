import React, { ChangeEvent, useEffect, useState, useCallback } from "react";
import { connect } from "react-redux";
import { ListGroup, ProgressBar, Form } from "react-bootstrap";
import { dataActions } from "../_actions";
import { Badge } from "react-bootstrap";

import { IoMdCheckmarkCircleOutline } from "react-icons/io";

// This shows you all the documents in a given dataset.

interface Props {
  getDocuments: (datasetId: string) => void;
  clearDocument: () => void;
  setCurrDocument: (docId: string) => void;
  data: {
    documentList: string[];
    currDoc: string;
    datasetName: string;
    annotatedDocumentSet: Set<string>;
    assignedDocumentSet: Set<string>;
    words: string[][];
  };
  dataset_id: string;
}

const DocumentList: React.FC<Props> = ({
  getDocuments,
  clearDocument,
  setCurrDocument,
  data,
  dataset_id,
}) => {
  const [showOnlyAssigned, setShowOnlyAssigned] = useState(false);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      const currDocIndex = data.documentList.indexOf(data.currDoc);

      if (
        e.key === "ArrowDown" &&
        currDocIndex + 1 < data.documentList.length
      ) {
        const nextid = data.documentList[currDocIndex + 1];
        console.log(data.currDoc, nextid);
        clearDocument();
        setCurrDocument(nextid);
      }
      if (e.key === "ArrowUp" && currDocIndex > 0) {
        const previd = data.documentList[currDocIndex - 1];
        console.log(data.currDoc, previd);
        clearDocument();
        setCurrDocument(previd);
      }
    },
    [data.documentList, data.currDoc, clearDocument, setCurrDocument]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, [handleKey]);

  useEffect(() => {
    if (data.documentList.length === 0) {
      getDocuments(dataset_id);
    }
  }, [dataset_id, getDocuments, data.documentList.length]);

  useEffect(() => {
    if (data.words.length > 0) {
      clearDocument();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDocumentClick = (id: string) => {
    // color all words grey in case it takes a second to load the doc
    // but only if we aren't clicking on the current document
    if (data.currDoc !== id) {
      clearDocument();
      setCurrDocument(id);
    }
  };

  const progress = showOnlyAssigned
    ? Math.floor(
        (100 *
          Array.from(data.annotatedDocumentSet).filter((x) =>
            data.assignedDocumentSet.has(x)
          ).length) /
          data.assignedDocumentSet.size
      )
    : Math.floor(
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
              {data.annotatedDocumentSet.size} have been annotated (marked with{" "}
              <IoMdCheckmarkCircleOutline />
              ).
            </p>
            <div className="mb-3">
              {data &&
                data.assignedDocumentSet &&
                data.assignedDocumentSet.size > 0 && (
                  <Form.Check
                    onChange={(evt: ChangeEvent<HTMLInputElement>) =>
                      setShowOnlyAssigned(evt.target.checked)
                    }
                    checked={showOnlyAssigned}
                    id="assigned-checkbox"
                    type="checkbox"
                    label="Show only assigned?"
                    className=""
                  />
                )}
            </div>
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
          data.documentList.map(
            (id: string, index: number) =>
              (!showOnlyAssigned || data.assignedDocumentSet.has(id)) && (
                <ListGroup.Item
                  action
                  key={index}
                  onClick={() => handleDocumentClick(id)}
                  variant={id === data.currDoc ? "primary" : undefined}
                >
                  <span className="document-list-item">
                    <Badge
                      className="sentence-badge"
                      key={"badge-" + index}
                      variant={id === data.currDoc ? "primary" : "light"}
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
              )
          )}
      </ListGroup>
    </div>
  );
};

interface ReduxState {
  data: {
    documentList: string[];
    currDoc: string;
    datasetName: string;
    annotatedDocumentSet: Set<string>;
    assignedDocumentSet: Set<string>;
    words: string[][];
  };
}

function mapState(state: ReduxState) {
  const { data } = state;
  return { data };
}

const actionCreators = {
  getDocuments: dataActions.getDocuments,
  clearDocument: dataActions.clearDocument,
  setCurrDocument: dataActions.setCurrDocument,
};

const connectedDocumentList = connect(mapState, actionCreators)(DocumentList);
export { connectedDocumentList as DocumentList };

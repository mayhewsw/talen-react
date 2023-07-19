import React from "react";
import { Link } from "react-router-dom";
import { Card, ProgressBar, Button } from "react-bootstrap";
import { dataActions } from "../_actions";
import { connect } from "react-redux";

class DatasetCard extends React.Component<Props> {
  render() {
    const progress = this.props.datasetStats
      ? Math.floor(
          (100 * this.props.datasetStats.numAnnotated) /
            this.props.datasetStats.numFiles
        )
      : 0;
    return (
      <Card style={{ width: "18rem" }} className="m-2">
        <Card.Body>
          <Card.Title>
            <Link to={`/dataset/${this.props.split_id}`}>
              {this.props.split_id}
            </Link>
          </Card.Title>
          {this.props.datasetStats && (
            <div>
              <ul>
                <li>Num Files: {this.props.datasetStats.numFiles}</li>
                <li>Num Annotated: {this.props.datasetStats.numAnnotated}</li>
                <li>
                  Num Annotators: {this.props.datasetStats.annotators.length}
                </li>
              </ul>
              <div className="mb-3">
                {/* only include this next item if signed in as admin */}
                {/* click on this link, calls saveToGithub */}
                {this.props.isAdmin && (
                  <Button
                    variant={
                      this.props.datasetStats.numFiles ===
                      this.props.datasetStats.numAnnotated
                        ? "outline-success"
                        : "outline-warning"
                    }
                    onClick={() =>
                      this.props.saveToGithub({
                        repo_name: `UNER_English-${this.props.dataset_id
                          .split("_")[1]
                          .toUpperCase()}`,
                        dataset_key: this.props.split_id,
                      })
                    }
                  >
                    Save to Github
                  </Button>
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
          <Card.Text></Card.Text>
        </Card.Body>
      </Card>
    );
  }
}

type Props = {
  dataset_id: string;
  split_id: string;
  datasetStats: any;
  isAdmin: boolean;
  saveToGithub: Function;
};

// TODO: fix this any...
function mapState(state: any) {
  const { data, authentication } = state;
  const docid = data.currDoc;
  const readOnly = authentication.user.readOnly;
  const isSaved = data.isSaved;
  return { data, docid, readOnly, isSaved };
}

const actionCreators = {
  saveToGithub: dataActions.saveToGithub,
};

const connectedDatasetCard = connect(mapState, actionCreators)(DatasetCard);
export { connectedDatasetCard as DatasetCard };

import React from "react";
import { Link } from "react-router-dom";
import { Card, ProgressBar } from "react-bootstrap";

class DatasetCard extends React.Component<Props> {
  render() {
    const progress = this.props.datasetStats
      ? Math.floor(
          (100 * this.props.datasetStats.numAnnotated) /
            this.props.datasetStats.numFiles
        )
      : 0;
    console.log(this.props);
    return (
      <Card style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title>
            <Link to={`/dataset/${this.props.id}`}>{this.props.id}</Link>
          </Card.Title>
          {this.props.datasetStats && (
            <div>
              <ul>
                <li>Num Files: {this.props.datasetStats.numFiles}</li>
                <li>Num Annotated: {this.props.datasetStats.numAnnotated}</li>
              </ul>
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
  id: string;
  datasetStats: any;
};

export { DatasetCard };

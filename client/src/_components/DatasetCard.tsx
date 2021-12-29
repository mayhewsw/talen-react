import React from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";

class DatasetCard extends React.Component<Props> {
  render() {
    return (
      <Card style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title>
            <Link to={`/dataset/${this.props.id}`}>{this.props.id}</Link>
          </Card.Title>
          <Card.Text>
            <ul>
              <li>stat 1</li>
              <li>stat 2</li>
              <li>stat 3</li>
            </ul>
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }
}

type Props = {
  id: string;
};

export { DatasetCard };

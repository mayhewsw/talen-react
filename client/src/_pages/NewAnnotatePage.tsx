import React from "react";
import { connect } from "react-redux";
import { Annotate } from "../_components/Annotate";
import { MainPanel } from "../_components";
import { DocumentList } from "../_components/DocumentList";
import { RouteComponentProps } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

const NewAnnotatePage: React.FC<MatchProps> = (props) => {
  const { match, data } = props;
  const { currDoc } = data;

  return (
    <MainPanel>
      <Row className="flex-fill" style={{ minHeight: 0 }}>
        <Col
          xs={3}
          className="mh-100 flex-grow-1"
          style={{ overflowY: "scroll" }}
        >
          <DocumentList dataset_id={match.params.id} />
        </Col>
        <Col className="mh-100 flex-grow-1" style={{ overflowY: "scroll" }}>
          {currDoc && (
            <Annotate
              dataset={match.params.id}
              uplink={`/dataset/${match.params.id}`}
            />
          )}
        </Col>
      </Row>
    </MainPanel>
  );
};

interface MatchProps extends RouteComponentProps<MatchParams> {
  data: any;
}

interface MatchParams {
  id: string;
  docid: string;
}

function mapState(state: any) {
  const { data } = state;
  return { data };
}

const actionCreators = {};

const connectedNewAnnotatePage = connect(
  mapState,
  actionCreators
)(NewAnnotatePage);
export { connectedNewAnnotatePage as NewAnnotatePage };

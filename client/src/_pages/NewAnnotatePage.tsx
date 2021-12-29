import React from "react";
import { connect } from "react-redux";
import { Annotate } from "../_components/Annotate";
import { MainPanel } from "../_components";
import { DocumentList } from "../_components/DocumentList";
import { RouteComponentProps } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

class NewAnnotatePage extends React.Component<MatchProps> {
  render() {
    const { match, data } = this.props;
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
  }
}

// TODO: fix the any!!
interface MatchProps extends RouteComponentProps<MatchParams> {
  data: any;
}

interface MatchParams {
  id: string;
  docid: string;
}

// TODO: make this STATE
function mapState(state: any) {
  const { authentication, data, currDoc } = state;
  const { user } = authentication;
  return { user, data, currDoc };
}

const actionCreators = {};

const connectedNewAnnotatePage = connect(
  mapState,
  actionCreators
)(NewAnnotatePage);
export { connectedNewAnnotatePage as NewAnnotatePage };

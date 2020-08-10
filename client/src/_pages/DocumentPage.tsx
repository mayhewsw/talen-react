import React from "react";
import { connect } from "react-redux";
import { Annotate } from "../_components/Annotate";
import { MainPanel } from "../_components";
import { RouteComponentProps } from "react-router-dom";

class DocumentPage extends React.Component<MatchProps> {
  render() {
    const { match } = this.props;

    return (
      <MainPanel>
        <div className="col-md-12">
          <h2>{match.params.docid}</h2>

          <Annotate
            dataset={match.params.id}
            docid={match.params.docid}
            uplink={`/dataset/${match.params.id}`}
          />
        </div>
      </MainPanel>
    );
  }
}

interface MatchProps extends RouteComponentProps<MatchParams> {}

interface MatchParams {
  id: string;
  docid: string;
}

function mapState(state: any) {
  const { authentication } = state;
  const { user } = authentication;
  return { user };
}

const actionCreators = {};

const connectedDocumentPage = connect(mapState, actionCreators)(DocumentPage);
export { connectedDocumentPage as DocumentPage };

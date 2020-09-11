import React from "react";
import { connect } from "react-redux";
import { Annotate } from "../_components/Annotate";
import { MainPanel } from "../_components";
import { RouteComponentProps } from "react-router-dom";
import { dataActions } from "../_actions";

class DocumentPage extends React.Component<MatchProps> {
  componentDidMount() {
    const { match } = this.props;
    console.log("this doc is:" + match.params.id);
    this.props.getDocuments(match.params.id);
  }

  render() {
    const { match } = this.props;

    return (
      <MainPanel>
        <div className="col-md-12">
          <Annotate
            dataset={match.params.id}
            docid={match.params.docid}
            uplink={`/dataset/${match.params.id}`}
          />
        </div>
        <div style={{ height: 150 }}></div>
      </MainPanel>
    );
  }
}

// TODO: fix the any!!
interface MatchProps extends RouteComponentProps<MatchParams> {
  getDocuments: any;
  data: any;
}

interface MatchParams {
  id: string;
  docid: string;
}

// TODO: make this STATE
function mapState(state: any) {
  const { authentication, data } = state;
  const { user } = authentication;
  return { user, data };
}

const actionCreators = {
  getDocuments: dataActions.getDocuments,
};

const connectedDocumentPage = connect(mapState, actionCreators)(DocumentPage);
export { connectedDocumentPage as DocumentPage };

import React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import { ListGroup } from "react-bootstrap";
import { MainPanel } from "../_components";
import { dataActions } from "../_actions";
import { Badge } from "react-bootstrap";

// This shows you all the documents in a given dataset.
class DatasetPage extends React.Component<MatchProps> {
  componentDidMount() {
    const { data, match } = this.props;
    if (data.documentList.length === 0) {
      this.props.getDocuments(match.params.id);
    }

    if (data.words.length > 0) {
      this.props.clearDocument();
    }
  }

  render() {
    const { match, data } = this.props;
    console.log(match.params.id);

    console.log(data);

    return (
      <MainPanel>
        <div className="col-md-12">
          {/* <h1>{match.params.id}</h1> */}

          {data && data.documentList && data.annotatedDocumentSet && (
            <p>
              There are {data.documentList.length} documents. Of these,{" "}
              {data.annotatedDocumentSet.length} have been annotated (marked in
              green).
            </p>
          )}
          <ListGroup>
            {data &&
              data.documentList &&
              data.documentList.map((id: string, index: number) => (
                <ListGroup.Item
                  key={index}
                  variant={
                    data.annotatedDocumentSet.indexOf(id) > -1
                      ? "success"
                      : undefined
                  }
                >
                  <Badge
                    className="sentence-badge"
                    key={"badge-" + index}
                    variant={
                      data.annotatedDocumentSet.indexOf(id) > -1
                        ? "success"
                        : "light"
                    }
                  >
                    {index + 1}
                  </Badge>
                  {/* possible to pass arguments here: https://ui.dev/react-router-v4-pass-props-to-link/ */}
                  <Link to={{ pathname: `/dataset/${match.params.id}/${id}` }}>
                    {id}
                  </Link>
                </ListGroup.Item>
              ))}
          </ListGroup>
        </div>
      </MainPanel>
    );
  }
}

// TODO: fix the any!!
interface MatchProps extends RouteComponentProps<MatchParams> {
  getDocuments: any;
  clearDocument: any;
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
  clearDocument: dataActions.clearDocument,
};

const connectedDocumentPage = connect(mapState, actionCreators)(DatasetPage);
export { connectedDocumentPage as DatasetPage };

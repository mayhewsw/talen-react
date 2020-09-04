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
    const { match } = this.props;
    console.log("this doc is:" + match.params.id);
    this.props.getDocuments(match.params.id);
  }

  render() {
    const { match, data } = this.props;
    console.log(match.params.id);

    console.log(data);

    return (
      <MainPanel>
        <div className="col-md-12">
          {/* <h1>{match.params.id}</h1> */}

          {data.items &&
            data.items.documentIDs &&
            data.items.annotatedDocumentIDs && (
              <p>
                There are {data.items.documentIDs.length} documents. Of these,{" "}
                {data.items.annotatedDocumentIDs.length} have been annotated
                (marked in green).
              </p>
            )}
          <ListGroup>
            {data.items &&
              data.items.documentIDs &&
              data.items.documentIDs.map((id: string, index: number) => (
                <ListGroup.Item
                  key={index}
                  variant={
                    data.items.annotatedDocumentIDs.indexOf(id) > -1
                      ? "success"
                      : undefined
                  }
                >
                  <Badge
                    className="sentence-badge"
                    key={"badge-" + index}
                    variant={
                      data.items.annotatedDocumentIDs.indexOf(id) > -1
                        ? "success"
                        : "light"
                    }
                  >
                    {index + 1}
                  </Badge>
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

const connectedDocumentPage = connect(mapState, actionCreators)(DatasetPage);
export { connectedDocumentPage as DatasetPage };

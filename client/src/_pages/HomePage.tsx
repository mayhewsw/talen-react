import React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import { MainPanel } from "../_components";
import { dataActions } from "../_actions";
import { ListGroup, Jumbotron } from "react-bootstrap";

// this page shows a list of datasets. If you click on a dataset,
// that takes you to a DatasetPage.
class HomePage extends React.Component<MatchProps> {
  componentDidMount() {
    this.props.getDatasets();
  }

  render() {
    const { user, data } = this.props;
    return (
      <MainPanel>
        <div className="col-md-12">
          <Jumbotron>
            <h1>Hello, {user.username}!</h1>
            <p>
              Welcome to TALEN. Choose a dataset below to get started
              annotating!
            </p>
          </Jumbotron>
          <h3>Dataset List:</h3>
          <ListGroup>
            {data &&
              data.datasetIDs &&
              data.datasetIDs.map((id: string, index: number) => (
                <ListGroup.Item key={index}>
                  <Link to={`/dataset/${id}`}>{id}</Link>
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
  data: any;
  user: any;
  getDatasets: any;
}

interface MatchParams {
  id: string;
  docid: string;
}

// TODO: fix the any!
function mapState(state: any) {
  const { authentication, data } = state;
  const { user } = authentication;
  return { user, data };
}

const actionCreators = {
  getDatasets: dataActions.getDatasets,
};

const connectedDatasetPage = connect(mapState, actionCreators)(HomePage);
export { connectedDatasetPage as HomePage };

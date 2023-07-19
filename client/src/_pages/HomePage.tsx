import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import { MainPanel, DatasetCard } from "../_components";
import { dataActions } from "../_actions";

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
          {data &&
            data.datasetDict &&
            Object.keys(data.datasetDict).map((id: string, index: number) => (
              <div key={index}>
                <h3>{id}</h3>
                <div className="dataset-card-row d-flex justify-content-flex-start flex-wrap">
                  {data.datasetDict[id]
                    .sort()
                    .map((split_id: string, split_index: number) => (
                      <DatasetCard
                        key={split_index}
                        datasetStats={data.datasetStats[split_id]}
                        isAdmin={user && user.admin}
                        dataset_id={id}
                        split_id={split_id}
                      />
                    ))}
                </div>
              </div>
            ))}
        </div>
      </MainPanel>
    );
  }
}

// TODO: fix the any!!
interface MatchProps extends RouteComponentProps<MatchParams> {
  data: any;
  user: any;
  getDatasets: Function;
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

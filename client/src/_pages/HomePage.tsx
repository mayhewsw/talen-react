import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import { MainPanel, DatasetCard } from "../_components";
import { dataActions } from "../_actions";
import { useAuth } from "../contexts/AuthContext";

// this page shows a list of datasets. If you click on a dataset,
// that takes you to a DatasetPage.
const HomePage: React.FC<MatchProps> = (props) => {
  const { user } = useAuth();
  const { getDatasets, data } = props;

  React.useEffect(() => {
    getDatasets();
  }, [getDatasets]);

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
                  .map((splitId: string, splitIndex: number) => (
                    <DatasetCard
                      key={splitIndex}
                      datasetStats={data.datasetStats[splitId]}
                      isAdmin={!!(user && user.admin)}
                      datasetId={id}
                      splitId={splitId}
                    />
                  ))}
              </div>
            </div>
          ))}
      </div>
    </MainPanel>
  );
};

interface MatchProps extends RouteComponentProps<MatchParams> {
  data: any;
  getDatasets: Function;
}

interface MatchParams {
  id: string;
  docid: string;
}

function mapState(state: any) {
  const { data } = state;
  return { data };
}

const actionCreators = {
  getDatasets: dataActions.getDatasets,
};

const connectedDatasetPage = connect(mapState, actionCreators)(HomePage);
export { connectedDatasetPage as HomePage };

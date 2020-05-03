import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { dataActions } from '../_actions';

// this page shows a list of datasets. If you click on a dataset, 
// that takes you to a DatasetPage.
class HomePage extends React.Component {
    componentDidMount() {
        this.props.getDatasets();
    }

    render() {
        const { user, data } = this.props;
        return (
            <div className="col-md-6 col-md-offset-3">
                <h1>Hi {user.username}!</h1>
                <ul>
                {data.items && data.items.datasetIDs && data.items.datasetIDs.map(
                    (id, index) => <li key={index}><Link to={`/dataset/${id}`}>{id}</Link></li>)
                }
                </ul>

                <p>
                    <Link to="/login">Logout</Link>
                </p>
            </div>
        );
    }
}

function mapState(state) {
    const { authentication, data } = state;
    const { user } = authentication;
    return { user, data };
}

const actionCreators = {
    getDatasets: dataActions.getDatasets
}

const connectedDatasetPage = connect(mapState, actionCreators)(HomePage);
export { connectedDatasetPage as HomePage };
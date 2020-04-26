import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';

import { dataActions } from '../_actions';

// This shows you all the documents in a given dataset.
class DatasetPage extends React.Component {
    componentDidMount() {
        const { match } = this.props;
        console.log("this doc is:" + match.params.id);
        this.props.getDocuments(match.params.id);
    }

    render() {
        const { user, match, data } = this.props;
        console.log(match.params.id);

        return (
            <div className="col-md-6 col-md-offset-3">
            <h1>{match.params.id}</h1>
                Yo what up! This dataset is called {match.params.id}. These are documents below here:

                <ul> 
                {data.items && data.items.documentIDs && data.items.documentIDs.map(
                    (id, index) => <li key={index}><Link to={`/dataset/${match.params.id}/${id}`}>{id}</Link></li>)
                }
                </ul>

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
    getDocuments: dataActions.getDocuments
}

const connectedDocumentPage = connect(mapState, actionCreators)(DatasetPage);
export { connectedDocumentPage as DatasetPage };
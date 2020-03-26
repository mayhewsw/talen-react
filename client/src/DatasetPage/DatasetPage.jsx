import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';

// This shows you all the documents in a given dataset.
class DatasetPage extends React.Component {

    render() {
        const { user, match } = this.props;
        console.log(match.params.id);

        return (
            <div className="col-md-6 col-md-offset-3">
            <h1>{match.params.id}</h1>
                Yo what up! This dataset is called {match.params.id}. These are documents below here:

                <ul>
                    <li><Link to={`/dataset/${match.params.id}/Doc1`}>Doc1</Link></li>
                    <li><Link to={`/dataset/${match.params.id}/Doc2`}>Doc2</Link></li>
                </ul>
            </div>
        );
    }
}

function mapState(state) {
    const { authentication } = state;
    const { user } = authentication;
    return { user };
}

const actionCreators = {
}

const connectedDocumentPage = connect(mapState, actionCreators)(DatasetPage);
export { connectedDocumentPage as DatasetPage };
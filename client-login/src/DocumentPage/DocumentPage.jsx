import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';

class DocumentPage extends React.Component {

    render() {
        const { user, match } = this.props;
        console.log(match.params.id);

        return (
            <div className="col-md-6 col-md-offset-3">
            <h1>{match.params.id}</h1>
                Yo what up! This dataset is called {match.params.id}.
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

const connectedDocumentPage = connect(mapState, actionCreators)(DocumentPage);
export { connectedDocumentPage as DocumentPage };
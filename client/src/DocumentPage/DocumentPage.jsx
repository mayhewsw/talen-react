import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';

class DocumentPage extends React.Component {

    render() {
        const { user, match } = this.props;
        console.log(match.params.id);
        console.log(match.params.docid);

        return (
            <div className="col-md-6 col-md-offset-3">
            <h1>{match.params.id} : {match.params.docid}</h1>

                This page will have sentences for the purpose of annotating!

                <p><Link to={`/dataset/${match.params.id}`}>Back to all docs...</Link>
                </p>
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
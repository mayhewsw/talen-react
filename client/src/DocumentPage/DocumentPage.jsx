import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Annotate from '../pages/Annotate';

class DocumentPage extends React.Component {


    render() {
        const { match } = this.props;
        console.log(match.params.id);
        console.log(match.params.docid);

        return (
            <div className="col-md-12">
            <h1>{match.params.id}</h1>
            <h2>{match.params.docid}</h2>

                <Annotate dataset={match.params.id} docid={match.params.docid}/>

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
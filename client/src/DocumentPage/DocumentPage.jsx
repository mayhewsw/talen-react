import React from 'react';
import { connect } from 'react-redux';
import Annotate from '../pages/Annotate';


class DocumentPage extends React.Component {


    render() {
        const { match } = this.props;

        return (
            <div className="col-md-12">
                <h1>{match.params.id}</h1>
                <h2>{match.params.docid}</h2>
                
                <Annotate dataset={match.params.id} docid={match.params.docid} uplink={`/dataset/${match.params.id}`} />

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
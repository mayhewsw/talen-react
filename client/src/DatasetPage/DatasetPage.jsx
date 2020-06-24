import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ListGroup } from 'react-bootstrap';

import { dataActions } from '../_actions';

// This shows you all the documents in a given dataset.
class DatasetPage extends React.Component {
    componentDidMount() {
        const { match } = this.props;
        console.log("this doc is:" + match.params.id);
        this.props.getDocuments(match.params.id);
    }

    render() {
        const { match, data } = this.props;
        console.log(match.params.id);

        return (
            <div className="col-md-12">
            <h1>{match.params.id}</h1>

            {data.items && <p>There are {data.items.documentIDs.length} documents. Of these, {data.items.annotatedDocumentIDs.length} have been annotated (marked in green).</p>}
                <ListGroup>
                {data.items && data.items.documentIDs && data.items.documentIDs.map(
                    (id, index) => <ListGroup.Item key={index} variant={data.items.annotatedDocumentIDs.indexOf(id) > -1 ? "success" : null}><Link to={`/dataset/${match.params.id}/${id}`}>{id}</Link></ListGroup.Item>)
                }
                </ListGroup>

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
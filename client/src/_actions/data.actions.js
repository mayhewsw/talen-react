import { dataConstants } from '../_constants';
import { dataService } from '../_services';
import { alertActions } from './';

export const dataActions = {
    getDatasets,
    saveDocument,
    loadDocument,
    getDocuments
};

function getDatasets() {
    return dispatch => {
        
        dataService.getDatasets()
            .then(
                data => { 
                    console.log(data)
                    dispatch(success(data))
                },
                error => {
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function success(data) { return { type: dataConstants.GETALL_SUCCESS, data }}
}

function getDocuments(dataset) {
    return dispatch => {
        
        dataService.getDocuments(dataset)
            .then(
                data => { 
                    console.log(data)
                    dispatch(success(data))
                },
                error => {
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function success(data) { return { type: dataConstants.GETALL_SUCCESS, data }}
}

function loadDocument(dataset, docid) {
    return dispatch => {
        
        dataService.loadDocument(dataset, docid)
            .then(
                data => { 
                    console.log(data)
                    dispatch(success(data))
                },
                error => {
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function success(data) { return { type: dataConstants.GETALL_SUCCESS, data }}
}

function saveDocument(data) {
    return dispatch => {
        
        dataService.saveDocument(data)
            .then(
                data => { 
                    console.log(data)
                    dispatch(success(data))
                },
                error => {
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function success(data) { return { type: dataConstants.GETALL_SUCCESS, data }}
}

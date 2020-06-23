import { dataConstants } from '../_constants';
import { dataService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const dataActions = {
    getDatasets,
    saveDocument,
    loadDocument,
    getDocuments,
    loadStatus,
    setLabels
};

function redirectToLogin(dispatch, error_text){
    // Who decides on this text? Wouldn't it be better if we used an authorization code? 401
    if(error_text === "UNAUTHORIZED"){
        dispatch(alertActions.error("Logged out! Redirecting to login page..."));
        setTimeout(() => { history.push("/login"); }, 2000);
    }else{
        dispatch(alertActions.error(error_text.toString()));
    }
}

function getDatasets() {
    return dispatch => {
        
        dataService.getDatasets()
            .then(
                data => { 
                    console.log(data)
                    dispatch(success(data))
                },
                error => {
                    redirectToLogin(dispatch, error);
                }
            );
    };

    function success(data) { return { type: dataConstants.GETDATASETS_SUCCESS, data }}
}

function loadStatus(dataset, docId) {
    return dispatch => {
        
        dataService.getDocuments(dataset)
            .then(
                data => { 
                    console.log(data);
                    dispatch(success(data))
                },
                error => {
                    redirectToLogin(dispatch, error);
                }
            );
    };

    function success(data) { return { type: dataConstants.LOADSTATUS, data, docId }}
}

function getDocuments(dataset) {
    return dispatch => {
        
        dataService.getDocuments(dataset)
            .then(
                data => { 
                    console.log(data);
                    dispatch(success(data))
                },
                error => {
                    redirectToLogin(dispatch, error);
                }
            );
    };

    function success(data) { return { type: dataConstants.GETDOCS_SUCCESS, data }}
}

function setLabels(newLabels){
    return { 
        type: dataConstants.SETLABELS, 
        newLabels
    }
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
                    redirectToLogin(dispatch, error);
                }
            );
    };

    function success(data) { return { type: dataConstants.LOADDOC_SUCCESS, data }}
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
                    console.log(error);
                    redirectToLogin(dispatch, error);
                }
            );
    };

    function success(data) { return { type: dataConstants.SAVEDOC_SUCCESS, data }}
}

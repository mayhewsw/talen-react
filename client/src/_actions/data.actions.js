import {
  GETDATASETS_SUCCESS,
  GETDOCS_SUCCESS,
  LOADSTATUS,
  LOADDOC_SUCCESS,
  SETLABELS,
  SAVEDOC_SUCCESS,
} from "../_utils/types";

import { dataService } from "../_services";
import { alertActions } from "./";
import { history } from "../_helpers";

export const dataActions = {
  getDatasets,
  saveDocument,
  loadDocument,
  getDocuments,
  loadStatus,
  setLabels,
};

function redirectToLogin(dispatch, error_text) {
  // Who decides on this text? Wouldn't it be better if we used an authorization code? 401
  if (error_text === "UNAUTHORIZED") {
    dispatch(alertActions.error("Logged out! Redirecting to login page..."));
    setTimeout(() => {
      history.push("/login");
    }, 2000);
  } else {
    dispatch(alertActions.error(error_text.toString()));
  }
}

function getDatasets() {
  return (dispatch) => {
    dataService.getDatasets().then(
      (data) => {
        console.log(data);
        dispatch(success(data));
      },
      (error) => {
        redirectToLogin(dispatch, error);
      }
    );
  };

  function success(data) {
    return { type: GETDATASETS_SUCCESS, data };
  }
}

function loadStatus(dataset, docId) {
  return (dispatch) => {
    dataService.getDocuments(dataset).then(
      (data) => {
        console.log(data);
        dispatch(success(data));
      },
      (error) => {
        redirectToLogin(dispatch, error);
      }
    );
  };

  function success(data) {
    return { type: LOADSTATUS, data, docId };
  }
}

function getDocuments(dataset) {
  return (dispatch) => {
    dataService.getDocuments(dataset).then(
      (data) => {
        console.log(data);
        dispatch(success(data));
      },
      (error) => {
        redirectToLogin(dispatch, error);
      }
    );
  };

  function success(data) {
    return { type: GETDOCS_SUCCESS, data };
  }
}

function setLabels(newLabels) {
  return {
    type: SETLABELS,
    newLabels,
  };
}

function loadDocument(dataset, docid) {
  return (dispatch) => {
    dataService.loadDocument(dataset, docid).then(
      (data) => {
        console.log(data);
        dispatch(success(data));
      },
      (error) => {
        redirectToLogin(dispatch, error);
      }
    );
  };

  function success(data) {
    return { type: LOADDOC_SUCCESS, data };
  }
}

function saveDocument(data) {
  return (dispatch) => {
    dataService.saveDocument(data).then(
      (data) => {
        console.log(data);
        dispatch(success(data));
      },
      (error) => {
        console.log(error);
        redirectToLogin(dispatch, error);
      }
    );
  };

  function success(data) {
    return { type: SAVEDOC_SUCCESS, data };
  }
}

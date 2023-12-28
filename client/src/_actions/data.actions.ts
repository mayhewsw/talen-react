import {
  GETDATASETS_SUCCESS,
  GETDOCS_SUCCESS,
  LOADSTATUS,
  LOADDOC_SUCCESS,
  SETLABELS,
  SAVEDOC_SUCCESS,
  SAVETOGITHUB_SUCCESS,
  MessageTypes,
  SETCURRDOC,
  CLEARDOC,
} from "../_utils/types";

import { dataService } from "../_services";
import { alertActions, userActions } from ".";
import { history } from "../_helpers";
import { Dispatch } from "react";

export const dataActions = {
  getDatasets,
  saveDocument,
  loadDocument,
  getDocuments,
  loadStatus,
  setLabels,
  clearDocument,
  setCurrDocument,
  saveToGithub,
};

function redirectToLogin(dispatch: Dispatch<MessageTypes>, error: Response) {
  // 401 is status code for unauthorized
  if (error.status === 401) {
    dispatch(alertActions.error("Logged out! Redirecting to login page..."));
    // this is a weird way to call this, but it's what it requires, I think?
    userActions.logout()(dispatch);
    setTimeout(() => {
      history.push(process.env.PUBLIC_URL + "/");
    }, 500);
  } else {
    dispatch(alertActions.error(error.statusText));
  }
}

function getDatasets() {
  return (dispatch: Dispatch<any>) => {
    dataService.getDatasets().then(
      (data: any[]) => {
        dispatch(success(data));
      },
      (error: any) => {
        redirectToLogin(dispatch, error);
      }
    );
  };

  function success(data: any[]) {
    return { type: GETDATASETS_SUCCESS, data };
  }
}

// this is super weird right? why load documents just to get a status...
function loadStatus(dataset: string, docId: string) {
  return (dispatch: Dispatch<any>) => {
    dataService.getDocuments(dataset).then(
      (data: any) => {
        dispatch(success(data));
      },
      (error: any) => {
        redirectToLogin(dispatch, error);
      }
    );
  };

  function success(data: any) {
    return { type: LOADSTATUS, data, docId };
  }
}

function getDocuments(dataset: string) {
  return (dispatch: Dispatch<any>) => {
    dataService.getDocuments(dataset).then(
      (data: any) => {
        dispatch(success(data));
      },
      (error: any) => {
        redirectToLogin(dispatch, error);
      }
    );
  };

  function success(data: any[]) {
    return { type: GETDOCS_SUCCESS, data };
  }
}

function setCurrDocument(docId: string) {
  return { type: SETCURRDOC, docId };
}

function setLabels(newLabels: any[]) {
  return {
    type: SETLABELS,
    newLabels,
  };
}

function clearDocument() {
  return {
    type: CLEARDOC,
  };
}

function loadDocument(dataset: string, docid: string) {
  return (dispatch: Dispatch<any>) => {
    dataService.loadDocument(dataset, docid).then(
      (data: any) => {
        dispatch(success(data));
      },
      (error: any) => {
        redirectToLogin(dispatch, error);
      }
    );
  };

  function success(data: any) {
    return { type: LOADDOC_SUCCESS, data };
  }
}

function saveDocument(data: any) {
  const docid = data["docid"];
  const datasetid = data["datasetid"];
  return (dispatch: Dispatch<any>) => {
    dataService.saveDocument(data).then(
      (status: string) => {
        dispatch(success(status, datasetid, docid));
      },
      (error: any) => {
        redirectToLogin(dispatch, error);
      }
    );
  };

  function success(status: any, datasetid: string, docid: string) {
    return { type: SAVEDOC_SUCCESS, datasetid, docid };
  }
}

function saveToGithub(data: any) {
  console.log("saveToGithub");
  return (dispatch: Dispatch<any>) => {
    dataService.saveToGithub(data).then(
      (status: string) => {
        console.log("success");
        dispatch(success(status));
      },
      (error: any) => {
        console.log(error);
      }
    );
  };

  function success(status: any) {
    return { type: SAVETOGITHUB_SUCCESS };
  }
}

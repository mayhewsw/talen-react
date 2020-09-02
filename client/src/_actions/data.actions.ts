import {
  GETDATASETS_SUCCESS,
  GETDOCS_SUCCESS,
  LOADSTATUS,
  LOADDOC_SUCCESS,
  SETLABELS,
  SAVEDOC_SUCCESS,
  MessageTypes,
} from "../_utils/types";

import { dataService } from "../_services";
import { alertActions } from ".";
import { history } from "../_helpers";
import { Dispatch } from "react";

export const dataActions = {
  getDatasets,
  saveDocument,
  loadDocument,
  getDocuments,
  loadStatus,
  setLabels,
};

function redirectToLogin(dispatch: Dispatch<MessageTypes>, error_text: string) {
  // Who decides on this text? Wouldn't it be better if we used an authorization code? 401
  if (error_text === "UNAUTHORIZED") {
    dispatch(alertActions.error("Logged out! Redirecting to login page..."));
    setTimeout(() => {
      history.push("/login");
    }, 500);
  } else {
    dispatch(alertActions.error(error_text.toString()));
  }
}

function getDatasets() {
  return (dispatch: Dispatch<any>) => {
    dataService.getDatasets().then(
      (data: any[]) => {
        console.log(data);
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

function loadStatus(dataset: string, docId: string) {
  return (dispatch: Dispatch<any>) => {
    dataService.getDocuments(dataset).then(
      (data: any) => {
        console.log(data);
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
        console.log(data);
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

function setLabels(newLabels: any[]) {
  return {
    type: SETLABELS,
    newLabels,
  };
}

function loadDocument(dataset: string, docid: string) {
  return (dispatch: Dispatch<any>) => {
    dataService.loadDocument(dataset, docid).then(
      (data: any) => {
        console.log(data);
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
  return (dispatch: Dispatch<any>) => {
    dataService.saveDocument(data).then(
      (data: any) => {
        console.log(data);
        dispatch(success(data));
      },
      (error: any) => {
        console.log(error);
        redirectToLogin(dispatch, error);
      }
    );
  };

  function success(data: any) {
    return { type: SAVEDOC_SUCCESS, data };
  }
}

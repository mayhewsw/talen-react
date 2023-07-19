export interface User {
  username: string;
  access_token: string;
  readOnly: boolean;
  admin: boolean;
}

export interface AuthState {
  loggedIn: boolean;
  loggingIn: boolean;
  user: User;
}

export interface DataState {
  datasetName: string;
  currDoc: string;
  documentList: string[];
  annotatedDocumentSet: Set<string>;
  assignedDocumentSet: Set<string>;
  words: string[][];
  labels: string[][];
  space_markers: boolean[][];
  default_labels: string[][];
  labelset: any;
  path: string;
  isAnnotated: boolean;
  isSaved: boolean;
  suggestions: any[];
  datasetDict: any;
  datasetIDs: string[];
  wordsColor: string;
  datasetStats: any[];
}

export interface UtilState {
  formState: {
    [key: string]: number | string;
  };
}

export interface State {
  authentication: AuthState;
  // loggedIn: boolean;
  // userName: string;
  // dataset: string;

  // currentlySending: boolean;
  util: UtilState;
  errorMessage: string;
  data: DataState;
  // TODO: include AlertState here somehow?
}

export const LOAD_DOCUMENT = "LOAD_DOCUMENT";
export const CHANGE_FORM = "CHANGE_FORM";
export const SET_AUTH = "SET_AUTH";
export const SENDING_REQUEST = "SENDING_REQUEST";
export const LOADING_AUTH = "LOADING_AUTH";
export const SET_ERROR_MESSAGE = "SET_ERROR_MESSAGE";
export const SET_DATA = "SET_DATA";
export const ALERT_SUCCESS = "ALERT_SUCCESS";
export const ALERT_ERROR = "ALERT_ERROR";
export const ALERT_CLEAR = "ALERT_CLEAR";
export const REGISTER_REQUEST = "DATA_REGISTER_REQUEST";
export const REGISTER_SUCCESS = "DATA_REGISTER_SUCCESS";
export const REGISTER_FAILURE = "DATA_REGISTER_FAILURE";
export const LOGIN_REQUEST = "DATA_LOGIN_REQUEST";
export const LOGIN_SUCCESS = "DATA_LOGIN_SUCCESS";
export const LOGIN_FAILURE = "DATA_LOGIN_FAILURE";
export const LOGOUT = "DATA_LOGOUT";
export const GETALL_REQUEST = "DATA_GETALL_REQUEST";
export const GETALL_SUCCESS = "DATA_GETALL_SUCCESS";
export const GETALL_FAILURE = "DATA_GETALL_FAILURE";
export const GETDATASETS_SUCCESS = "GETDATASETS_SUCCESS";
export const GETDOCS_SUCCESS = "GETDOCS_SUCCESS";
export const SETCURRDOC = "SETCURRDOC";
export const LOADDOC_SUCCESS = "LOADDOC_SUCCESS";
export const CLEARDOC = "CLEARDOC";
export const SAVEDOC_SUCCESS = "SAVEDOC_SUCCESS";
export const SAVETOGITHUB_SUCCESS = "SAVETOGITHUB_SUCCESS";
export const LOADSTATUS = "LOADSTATUS";
export const SETLABELS = "SETLABELS";
export const DELETE_REQUEST = "DATA_DELETE_REQUEST";
export const DELETE_SUCCESS = "DATA_DELETE_SUCCESS";
export const DELETE_FAILURE = "DATA_DELETE_FAILURE";

interface ChangeFormAction {
  type: typeof CHANGE_FORM;
  newState: any; // FIXME: any
}

interface LoadDocumentAction {
  type: typeof LOAD_DOCUMENT;
  docid: string;
  dataset: string;
}

interface SaveDocumentAction {
  type: typeof SAVEDOC_SUCCESS;
  docid: string;
  dataset: string;
}
interface SetAuthAction {
  type: typeof SET_AUTH;
  newState: boolean;
  username: string | null;
}

interface SuccessAction {
  type: typeof ALERT_SUCCESS;
  message: string;
}
interface ErrorAction {
  type: typeof ALERT_ERROR;
  message: string;
}
interface ClearAction {
  type: typeof ALERT_CLEAR;
}

interface GetDatasetsAction {
  type: typeof GETDATASETS_SUCCESS;
  data: {
    datasetIDs: string[];
    datasetDict: any;
    datasetStats: any[];
  };
}

interface GetDocsAction {
  type: typeof GETDOCS_SUCCESS;
  data: {
    documentIDs: string[];
    annotatedDocumentIDs: [];
    assignedDocumentIDs: [];
    datasetID: string;
  };
}

interface RegisterRequestAction {
  type: typeof REGISTER_REQUEST;
  registering: boolean;
}

interface RegisterSuccessAction {
  type: typeof REGISTER_SUCCESS;
}

interface RegisterFailureAction {
  type: typeof REGISTER_FAILURE;
}

interface LoadStatusAction {
  type: typeof LOADSTATUS;
  data: {
    documentIDs: string[];
  };
  docId: string;
}

interface LoadDocsAction {
  type: typeof LOADDOC_SUCCESS;
  data: {
    sentences: string[][];
    labels: string[][];
    default_labels: string[][];
    space_markers: boolean[][];
    path: string;
    isAnnotated: boolean;
    labelset: any;
    suggestions: any[];
  };
}

interface SetCurrDocAction {
  type: typeof SETCURRDOC;
  docId: string;
}

interface ClearDocAction {
  type: typeof CLEARDOC;
}

interface SetLabelsAction {
  type: typeof SETLABELS;
  newLabels: any[];
}

interface LoginRequestAction {
  type: typeof LOGIN_REQUEST;
  user: User;
}

interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
  user: User;
}

interface LoginFailureAction {
  type: typeof LOGIN_FAILURE;
  error: string;
}

interface LogoutAction {
  type: typeof LOGOUT;
}

export type RegistrationTypes =
  | RegisterRequestAction
  | RegisterSuccessAction
  | RegisterFailureAction;
export type AuthTypes =
  | LoginRequestAction
  | LoginSuccessAction
  | LoginFailureAction
  | LogoutAction;
export type DataTypes =
  | GetDatasetsAction
  | GetDocsAction
  | LoadStatusAction
  | LoadDocsAction
  | SetLabelsAction
  | ClearDocAction
  | SetCurrDocAction;
export type UtilTypes = ChangeFormAction;
export type MessageTypes = SuccessAction | ErrorAction | ClearAction;
export type DocumentTypes =
  | LoadDocumentAction
  | SaveDocumentAction
  | SetAuthAction;

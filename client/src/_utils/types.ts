export interface State {
  loggedIn: boolean
  userName: string
  dataset: string
  currentDocument: string
  currentDocumentIsSaved: boolean
  currentlySending: boolean
  formState: {
    [key: string]: number | string,
   }
  errorMessage: string
  // TODO: include AlertState here somehow?
  // TODO: include DataState also?
}

export const LOAD_DOCUMENT = 'LOAD_DOCUMENT'
export const SAVE_DOCUMENT = 'SAVE_DOCUMENT'
export const CHANGE_FORM = 'CHANGE_FORM'
export const SET_AUTH = 'SET_AUTH'
export const SENDING_REQUEST = 'SENDING_REQUEST'
export const LOADING_AUTH = 'LOADING_AUTH'
export const SET_ERROR_MESSAGE = 'SET_ERROR_MESSAGE'
export const SET_DATA = 'SET_DATA'

interface LoadDocumentAction {
  type: typeof LOAD_DOCUMENT
  docid: string
  dataset: string
}
interface SaveDocumentAction {
  type: typeof SAVE_DOCUMENT
  docid: string
  dataset: string
}
interface SetAuthAction {
  type: typeof SET_AUTH
  newState: boolean,
  username: string | null,
}

export const ALERT_SUCCESS = 'ALERT_SUCCESS'
export const ALERT_ERROR = 'ALERT_ERROR'
export const ALERT_CLEAR = 'ALERT_CLEAR'

interface SuccessAction {
  type: typeof ALERT_SUCCESS
  message: string
}
interface ErrorAction {
  type: typeof ALERT_ERROR
  message: string
}
interface ClearAction {
  type: typeof ALERT_CLEAR
}

export const REGISTER_REQUEST = 'DATA_REGISTER_REQUEST'
export const REGISTER_SUCCESS = 'DATA_REGISTER_SUCCESS'
export const REGISTER_FAILURE = 'DATA_REGISTER_FAILURE'
export const LOGIN_REQUEST = 'DATA_LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'DATA_LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'DATA_LOGIN_FAILURE'
export const LOGOUT = 'DATA_LOGOUT'
export const GETALL_REQUEST = 'DATA_GETALL_REQUEST'
//GETALL_SUCCESS = 'DATA_GETALL_SUCCESS',
export const GETALL_FAILURE = 'DATA_GETALL_FAILURE'
export const GETDATASETS_SUCCESS = 'GETDATASETS_SUCCESS'
export const GETDOCS_SUCCESS = 'GETDOCS_SUCCESS'
export const LOADDOC_SUCCESS = 'LOADDOC_SUCCESS'
export const SAVEDOC_SUCCESS = 'SAVEDOC_SUCCESS'
export const LOADSTATUS = 'LOADSTATUS'
export const SETLABELS = 'SETLABELS'
export const DELETE_REQUEST = 'DATA_DELETE_REQUEST'
export const DELETE_SUCCESS = 'DATA_DELETE_SUCCESS'
export const DELETE_FAILURE = 'DATA_DELETE_FAILURE'    

interface GetDatasetsAction {
  type: typeof GETDATASETS_SUCCESS
  data: any[]
}

interface GetDocsAction {
  type: typeof GETDOCS_SUCCESS
  data: any[]
}

interface LoadStatusAction {
  type: typeof LOADSTATUS
  data: {
    documentIDs: string[]
  }
  docId: string
}

interface LoadDocsAction {
  type: typeof LOADDOC_SUCCESS
  data: {
    sentences: string[][]
    labels: string[][]
    path: string
  }
}

interface SetLabelsAction {
  type: typeof SETLABELS
  newLabels: any[]
}

export type DataTypes = GetDatasetsAction | GetDocsAction | LoadStatusAction | LoadDocsAction | SetLabelsAction
export type MessageTypes = SuccessAction | ErrorAction | ClearAction
export type DocumentTypes = LoadDocumentAction | SaveDocumentAction | SetAuthAction
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

export type DocumentTypes = LoadDocumentAction | SaveDocumentAction | SetAuthAction
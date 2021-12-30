import {
  DataTypes,
  DocumentTypes,
  DataState,
  GETDATASETS_SUCCESS,
  GETDOCS_SUCCESS,
  LOADDOC_SUCCESS,
  SETLABELS,
  CLEARDOC,
  SETCURRDOC,
  SAVEDOC_SUCCESS,
} from "../_utils/types";

const initialState: DataState = {
  words: [[]],
  labels: [[]],
  labelset: [],
  path: "",
  isAnnotated: false,
  suggestions: [],
  datasetName: "",
  currDoc: "",
  documentList: [],
  annotatedDocumentSet: [],
  datasetIDs: [],
  wordsColor: "black",
  datasetStats: [],
};

export function data(
  state = initialState,
  action: DataTypes | DocumentTypes
): DataState {
  switch (action.type) {
    case GETDATASETS_SUCCESS:
      return {
        ...state,
        datasetIDs: action.data["datasetIDs"],
        datasetStats: action.data["datasetStats"],
        documentList: [],
        datasetName: "",
        annotatedDocumentSet: [],
      };
    case GETDOCS_SUCCESS:
      return {
        ...state,
        datasetName: action.data["datasetID"],
        documentList: action.data["documentIDs"],
        annotatedDocumentSet: action.data["annotatedDocumentIDs"],
        currDoc: action.data["documentIDs"][0],
      };
    case LOADDOC_SUCCESS:
      return {
        ...state,
        words: action.data["sentences"],
        labels: action.data["labels"],
        labelset: action.data["labelset"],
        path: action.data["path"],
        isAnnotated: action.data["isAnnotated"],
        suggestions: action.data["suggestions"],
        wordsColor: "black",
      };
    case SAVEDOC_SUCCESS:
      return {
        ...state,
        annotatedDocumentSet: [...state.annotatedDocumentSet, action.docid],
      };
    case SETCURRDOC:
      console.log(action);
      return {
        ...state,
        currDoc: action.docId,
      };
    case CLEARDOC:
      return {
        ...state,
        wordsColor: "silver",
      };
    case SETLABELS:
      return {
        ...state,
        labels: action.newLabels,
      };
    default:
      return state;
  }
}

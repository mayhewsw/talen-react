import {
  DataTypes,
  DataState,
  GETDATASETS_SUCCESS,
  GETDOCS_SUCCESS,
  LOADDOC_SUCCESS,
  SETLABELS,
  CLEARDOC,
} from "../_utils/types";

const initialState: DataState = {
  words: [[]],
  labels: [[]],
  labelset: [],
  path: "",
  isAnnotated: false,
  suggestions: [],
  datasetName: "",
  documentList: [],
  annotatedDocumentSet: new Set(),
  datasetIDs: [],
  wordsColor: "black",
};

export function data(state = initialState, action: DataTypes): DataState {
  switch (action.type) {
    case GETDATASETS_SUCCESS:
      return {
        ...state,
        datasetIDs: action.data["datasetIDs"],
        documentList: [],
        datasetName: "",
        annotatedDocumentSet: new Set(),
      };
    case GETDOCS_SUCCESS:
      return {
        ...state,
        datasetName: action.data["datasetID"],
        documentList: action.data["documentIDs"],
        annotatedDocumentSet: action.data["annotatedDocumentIDs"],
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

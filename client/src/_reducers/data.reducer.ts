import {
  DataTypes,
  DataState,
  GETDATASETS_SUCCESS,
  GETDOCS_SUCCESS,
  LOADSTATUS,
  LOADDOC_SUCCESS,
  SETLABELS,
} from "../_utils/types";

const initialState: DataState = {
  items: [],
  prevDoc: "",
  nextDoc: "",
  status: "",
  words: [[]],
  labels: [[]],
  labelset: [],
  path: "",
  isAnnotated: false,
};

export function data(state = initialState, action: DataTypes): DataState {
  switch (action.type) {
    case GETDATASETS_SUCCESS:
      return { ...state, items: action.data };
    case GETDOCS_SUCCESS:
      return {
        ...state,
        items: action.data,
      };
    case LOADSTATUS:
      var curr_ind = action.data["documentIDs"].indexOf(action.docId);
      var prevDoc = action.data["documentIDs"][curr_ind - 1];
      var nextDoc = action.data["documentIDs"][curr_ind + 1];
      return {
        ...state,
        prevDoc: prevDoc,
        nextDoc: nextDoc,
        status: `On document ${curr_ind + 1} out of ${
          action.data["documentIDs"].length
        }.`,
      };
    case LOADDOC_SUCCESS:
      return {
        ...state,
        words: action.data["sentences"],
        labels: action.data["labels"],
        labelset: action.data["labelset"],
        path: action.data["path"],
        isAnnotated: action.data["isAnnotated"],
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

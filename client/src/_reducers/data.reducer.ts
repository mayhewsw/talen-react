import {
  DataTypes,
  GETDATASETS_SUCCESS,
  GETDOCS_SUCCESS,
  LOADSTATUS,
  LOADDOC_SUCCESS,
  SETLABELS,
} from "../_utils/types";

interface DataState {
  items: any[];
  prevDoc?: any;
  nextDoc?: any;
  status?: string;
  words: string[][];
  labels: string[][];
  path: string;
}

const initialState: DataState = {
  items: [],
  prevDoc: "",
  nextDoc: "",
  status: "",
  words: [[]],
  labels: [[]],
  path: "",
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
        status: `${curr_ind + 1}/${action.data["documentIDs"].length}`,
      };
    case LOADDOC_SUCCESS:
      return {
        ...state,
        words: action.data["sentences"],
        labels: action.data["labels"],
        path: action.data["path"],
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

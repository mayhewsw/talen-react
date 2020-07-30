import { dataConstants } from '../_constants';

export function data(state = {}, action) {
  switch (action.type) {
    case dataConstants.GETDATASETS_SUCCESS:
      return {
        items: action.data
      };
    case dataConstants.GETALL_SUCCESS:
      return {
        items: action.data
      };
    case dataConstants.GETDOCS_SUCCESS:
      return {
        ...state,
        items: action.data
      }
    case dataConstants.LOADSTATUS:
      var curr_ind = action.data["documentIDs"].indexOf(action.docId);
      var prevDoc = action.data["documentIDs"][curr_ind-1];
      var nextDoc = action.data["documentIDs"][curr_ind+1];
      return {...state,
        prevDoc: prevDoc,
        nextDoc: nextDoc,
        status: `${curr_ind+1}/${action.data["documentIDs"].length}`
      };
    case dataConstants.LOADDOC_SUCCESS:
      return {
        ...state,
        words: action.data["sentences"],
        labels: action.data["labels"],
        path: action.data["path"],
      };
    case dataConstants.SETLABELS:
      return {
        ...state,
        labels: action.newLabels,
      };
      default:
      return state
  }
}
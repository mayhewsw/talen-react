import { combineReducers } from "redux";

import { data } from "./data.reducer";
import { alert } from "./alert.reducer";
import { util } from "./util.reducer";

const rootReducer = combineReducers({
  data,
  alert,
  util,
});

export default rootReducer;

import { combineReducers } from "redux";

import { authentication } from "./authentication.reducer";
import { registration } from "./registration.reducer";
import { users } from "./users.reducer";
import { data } from "./data.reducer";
import { alert } from "./alert.reducer";
import { util } from "./util.reducer";

const rootReducer = combineReducers({
  authentication,
  registration,
  users,
  data,
  alert,
  util,
});

export default rootReducer;

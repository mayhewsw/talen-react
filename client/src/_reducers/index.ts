import { combineReducers } from "redux";

import { authentication } from "./authentication.reducer";
import { registration } from "./registration.reducer";
import { users } from "./users.reducer";
import { data } from "./data.reducer";
import { alert } from "./alert.reducer";

const rootReducer = combineReducers({
  authentication,
  registration,
  users,
  data,
  alert,
});

export default rootReducer;

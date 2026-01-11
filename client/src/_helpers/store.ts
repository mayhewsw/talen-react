import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import { data } from "../_reducers/data.reducer";
import { util } from "../_reducers/util.reducer";
import { alert } from "../_reducers/alert.reducer";
import { combineReducers } from "redux";

const loggerMiddleware = createLogger();

// Simplified store with only data, util, and alert reducers
// Authentication is now handled by AuthContext
const rootReducer = combineReducers({
  data,
  util,
  alert,
});

export const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunkMiddleware, loggerMiddleware))
);

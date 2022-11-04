import {
  AuthTypes,
  AuthState,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
} from "../_utils/types";

//'username':'', 'access_token': ''
let user = JSON.parse(localStorage.getItem("user") || "{}");
const initialState = {
  loggedIn: false, // TODO: how to tell if someone is logged in or not? Answer: it might not matter... all of that is handled on the backend. If that's the case, then we can delete loggedIn and loggingIn here.
  user: user,
  loggingIn: false,
};

const emptyState = {
  loggedIn: false,
  loggingIn: false,
  user: {
    username: "",
    access_token: "",
    readOnly: true,
  },
};

export function authentication(
  state = initialState,
  action: AuthTypes
): AuthState {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        loggingIn: true,
        user: action.user,
      };
    case LOGIN_SUCCESS:
      return {
        loggingIn: false,
        loggedIn: true,
        user: action.user,
      };
    case LOGIN_FAILURE:
      return emptyState;
    case LOGOUT:
      return emptyState;
    default:
      return state;
  }
}

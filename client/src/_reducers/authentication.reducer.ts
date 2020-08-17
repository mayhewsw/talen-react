import {
  AuthTypes,
  AuthState,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
} from "../_utils/types";

let user = JSON.parse(localStorage.getItem("user") || "{}");
const initialState = {
  loggedIn: false,
  user: user,
  loggingIn: false,
};

const emptyState = {
  loggedIn: false,
  loggingIn: false,
  user: {
    username: "",
    access_token: "",
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

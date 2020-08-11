import {
  AuthTypes,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
} from "../_utils/types";

interface AuthState {
  loggedIn: boolean;
  loggingIn: boolean;
  user: string;
}

let user = JSON.parse(localStorage.getItem("user") || "{}");
const initialState = {
  loggedIn: false,
  user: user,
  loggingIn: false,
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
      return state;
    case LOGOUT:
      return state;
    default:
      return state;
  }
}

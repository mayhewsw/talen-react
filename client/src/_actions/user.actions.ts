import { userService } from "../_services";
import { alertActions } from ".";
import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAILURE,
  REGISTER_SUCCESS,
  REGISTER_REQUEST,
  User,
} from "../_utils/types";

export const userActions = {
  login,
  logout,
  register,
  toggleRegistering,
};

function login(username: string, password: string) {
  return (dispatch: any) => {
    dispatch(
      request({
        username: username,
        access_token: "?",
        readOnly: false,
        admin: false,
      })
    );

    userService.login(username, password).then(
      (user) => {
        dispatch(success(user));
        // history.push(process.env.PUBLIC_URL + "/");
      },
      (error) => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    );
  };

  function request(user: User) {
    return { type: LOGIN_REQUEST, user };
  }
  function success(user: User) {
    return { type: LOGIN_SUCCESS, user };
  }
  function failure(error: string) {
    return { type: LOGIN_FAILURE, error };
  }
}

function logout() {
  return (dispatch: any) => {
    userService.logout();
    dispatch({ type: LOGOUT });
  };
}

function toggleRegistering(user: User) {
  return (dispatch: any) => {
    dispatch(request(user));
  };

  function request(user: User) {
    return { type: REGISTER_REQUEST, user };
  }
}

function register(username: string, email: string, password: string) {
  return (dispatch: any) => {
    userService.register(username, email, password).then(
      (user) => {
        dispatch(success(user));
        // history.push(process.env.PUBLIC_URL + "/login");
        dispatch(alertActions.success("Registration successful"));
      },
      (error) => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    );
  };

  function success(user: User) {
    return { type: REGISTER_SUCCESS, user };
  }
  function failure(error: User) {
    return { type: REGISTER_FAILURE, error };
  }
}

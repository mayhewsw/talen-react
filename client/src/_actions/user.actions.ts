import { userService } from "../_services";
import { alertActions } from ".";
import { history } from "../_helpers";
import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAILURE,
  REGISTER_SUCCESS,
  REGISTER_REQUEST,
  User,
  // GETALL_FAILURE,
  // GETALL_REQUEST,
  // GETALL_SUCCESS,
  // DELETE_FAILURE,
  // DELETE_REQUEST,
  // DELETE_SUCCESS,
} from "../_utils/types";

export const userActions = {
  login,
  logout,
  register,
  // getAll,
  // delete: _delete,
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

function register(user: User) {
  return (dispatch: any) => {
    dispatch(request(user));

    userService.register(user).then(
      (user) => {
        dispatch(success(user));
        history.push(process.env.PUBLIC_URL + "/login");
        dispatch(alertActions.success("Registration successful"));
      },
      (error) => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    );
  };

  function request(user: User) {
    return { type: REGISTER_REQUEST, user };
  }
  function success(user: User) {
    return { type: REGISTER_SUCCESS, user };
  }
  function failure(error: User) {
    return { type: REGISTER_FAILURE, error };
  }
}

// function getAll() {
//   return (dispatch) => {
//     dispatch(request());

//     userService.getAll().then(
//       (users) => dispatch(success(users)),
//       (error) => dispatch(failure(error.toString()))
//     );
//   };

//   function request() {
//     return { type: GETALL_REQUEST };
//   }
//   function success(users) {
//     return { type: GETALL_SUCCESS, users };
//   }
//   function failure(error) {
//     return { type: GETALL_FAILURE, error };
//   }
// }

// // prefixed function name with underscore because delete is a reserved word in javascript
// function _delete(id) {
//   return (dispatch) => {
//     dispatch(request(id));

//     userService.delete(id).then(
//       (user) => dispatch(success(id)),
//       (error) => dispatch(failure(id, error.toString()))
//     );
//   };

//   function request(id) {
//     return { type: DELETE_REQUEST, id };
//   }
//   function success(id) {
//     return { type: DELETE_SUCCESS, id };
//   }
//   function failure(id, error) {
//     return { type: DELETE_FAILURE, id, error };
//   }
// }

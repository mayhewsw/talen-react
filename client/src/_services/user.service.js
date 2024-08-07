import { authHeader } from "../_helpers";

export const userService = {
  login,
  logout,
  isLoggedIn,
  timeLeft,
  register,
  getAll,
  getById,
  update,
  delete: _delete,
};

function login(username, password) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  };

  return fetch(
    `${process.env.REACT_APP_URL}/users/authenticate`,
    requestOptions
  )
    .then(handleResponse)
    .then((user) => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    });
}

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem("user");
}

function timeLeft() {
  // check for existence of "user" item first
  if (!localStorage.getItem("user")) {
    return -1;
  }
  // check if logged in and not expired
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.access_token;
  const expiry = JSON.parse(atob(token.split(".")[1])).exp;
  return expiry - Math.floor(new Date().getTime() / 1000);
}

function isLoggedIn() {
  return timeLeft() > 0;
}

function getAll() {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };

  return fetch(`${process.env.REACT_APP_URL}/users`, requestOptions).then(
    handleResponse
  );
}

function getById(id) {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };

  return fetch(`${process.env.REACT_APP_URL}/users/${id}`, requestOptions).then(
    handleResponse
  );
}

function register(username, email, password) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  };

  return fetch(
    `${process.env.REACT_APP_URL}/users/register`,
    requestOptions
  ).then(handleResponse);
}

function update(user) {
  const requestOptions = {
    method: "PUT",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(user),
  };

  return fetch(
    `${process.env.REACT_APP_URL}/users/${user.id}`,
    requestOptions
  ).then(handleResponse);
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader(),
  };

  return fetch(`${process.env.REACT_APP_URL}/users/${id}`, requestOptions).then(
    handleResponse
  );
}

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      var error_message = (data && data.message) || response.statusText;
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        logout();
        // This is unsupported in Typescript?
        //location.reload(true);
        error_message = "Username or password are incorrect.";
      }

      return Promise.reject(error_message);
    }

    return data;
  });
}

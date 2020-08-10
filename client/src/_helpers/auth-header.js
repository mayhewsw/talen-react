export function authHeader() {
  // return authorization header with jwt token
  let user = JSON.parse(localStorage.getItem("user"));
  if (user && user.access_token) {
    return { Authorization: "JWT " + user.access_token };
  } else {
    return {};
  }
}

export function authHeader() {
  // return authorization header with jwt token
  const userStr = localStorage.getItem("user");
  if (!userStr) {
    return {};
  }

  try {
    const user = JSON.parse(userStr);
    if (user && user.access_token) {
      return { Authorization: "Bearer " + user.access_token };
    }
  } catch (error) {
    console.error("Failed to parse user from localStorage", error);
    localStorage.removeItem("user"); // Clean up invalid data
  }

  return {};
}

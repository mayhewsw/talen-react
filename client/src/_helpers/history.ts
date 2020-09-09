import { createBrowserHistory } from "history";

// https://stackoverflow.com/questions/49429906/how-should-i-configure-create-react-app-to-serve-app-from-subdirectory
export const history = createBrowserHistory({
  basename: process.env.PUBLIC_URL,
});

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "./_helpers";
import { App } from "./App";
import { configureFakeBackend } from "./_helpers";

import "bootstrap/dist/css/bootstrap.min.css";

if (process.env.REACT_APP_ENV === "demo") {
  // setup fake backend
  configureFakeBackend();
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

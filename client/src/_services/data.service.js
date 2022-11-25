import { authHeader } from "../_helpers";

export const dataService = {
  getDatasets,
  getDatasetStats,
  saveDocument,
  loadDocument,
  getDocuments,
};

function getDatasets() {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };

  return fetch(`${process.env.REACT_APP_URL}/datasetlist`, requestOptions)
    .then(handleResponse)
    .then((data) => {
      return data;
    });
  // we deliberately do NOT catch errors here because there's one more .then() in data.actions.ts.

  // when there's only one function in .then(), that is the onResolved function
  // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then
  // the onRejected handler is automatically injected as a thrower function: (x) => { throw x; }
  // when we reject, that is automatically thrown, and the promise chain is broken.
}

function getDatasetStats(dataset) {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };

  return fetch(
    `${process.env.REACT_APP_URL}/datasetstats?dataset=${dataset}`,
    requestOptions
  )
    .then(handleResponse)
    .then((stats) => {
      return stats;
    });
}

function getDocuments(dataset) {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };

  return fetch(
    `${process.env.REACT_APP_URL}/loaddataset?dataset=${dataset}`,
    requestOptions
  )
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function saveDocument(data) {
  const requestOptions = {
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(data),
    method: "POST",
  };

  return fetch(`${process.env.REACT_APP_URL}/savedoc`, requestOptions)
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function loadDocument(dataset, docid) {
  const requestOptions = {
    headers: authHeader(),
    method: "GET",
  };

  return fetch(
    `${process.env.REACT_APP_URL}/loaddoc?docid=${docid}&dataset=${dataset}`,
    requestOptions
  )
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function handleResponse(response) {
  if (!response.ok) {
    console.log("fetch error! status code: " + response.status);
    return Promise.reject(response);
  }

  return response.text().then((text) => {
    return text && JSON.parse(text);
  });
}

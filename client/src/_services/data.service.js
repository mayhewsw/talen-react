import { authHeader } from "../_helpers";

export const dataService = {
  getDatasets,
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
  console.log("in service");
  console.log(data);
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
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      console.log("there is error!");
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}

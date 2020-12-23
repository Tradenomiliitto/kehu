import i18n from "../i18n";

export function get(url) {
  return kehuFetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "content-type": "application/json"
    },
    credentials: "same-origin"
  })
    .then(checkResponseStatus)
    .then(res => res.json());
}

export function getText(url) {
  return kehuFetch(url, {
    method: "GET",
    headers: {
      Accept: "text",
      "content-type": "text"
    },
    credentials: "same-origin"
  }).then(res => res.text());
}

export function del(url) {
  return kehuFetch(url, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "content-type": "application/json"
    },
    credentials: "same-origin"
  }).then(checkResponseStatus);
}

export function post(url, body) {
  return kehuFetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "content-type": "application/json"
    },
    credentials: "same-origin",
    body: JSON.stringify(body)
  })
    .then(checkResponseStatus)
    .then(res => res.json());
}

export function put(url, body) {
  return kehuFetch(url, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "content-type": "application/json"
    },
    credentials: "same-origin",
    body: JSON.stringify(body)
  })
    .then(checkResponseStatus)
    .then(res => res.json());
}

function kehuFetch(endpoint, opts = { headers: {} }) {
  opts.headers["Accept-Language"] = i18n.language;
  opts.headers["CSRF-Token"] = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");
  return fetch(`/api/v1${endpoint}`, opts);
}

function checkResponseStatus(response) {
  if (response.status >= 200 && response.status < 400) {
    return response;
  } else {
    return response.json().then(res => {
      const error = new Error(response.statusText);
      error.response = response;
      error.responseJson = res;
      throw error;
    });
  }
}

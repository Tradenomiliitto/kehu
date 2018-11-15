export function post(url, body) {
  return kehuFetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "content-type": "application/json"
    },
    body: JSON.stringify(body)
  })
    .then(checkResponseStatus)
    .then(res => res.json());
}

function kehuFetch(endpoint, opts = { headers: {} }) {
  opts.headers["CSRF-Token"] = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");
  return fetch(`/api/v1/${endpoint}`, opts);
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

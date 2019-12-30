export function truncateText(text, length) {
  if (!text) {
    return "";
  }

  text = text
    .replace(/(<([^>]+)>)/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  const truncateIndex = length;
  const nextEmptyChar = text.indexOf(" ", truncateIndex);
  let truncatedText;

  if (text.length <= truncateIndex) {
    return text;
  } else if (nextEmptyChar === -1) {
    return text;
  } else {
    if (text.charAt(truncateIndex - 1).match(/\s/)) {
      truncatedText = text.substr(0, truncateIndex);
    } else {
      truncatedText = text.substr(0, nextEmptyChar);
    }

    if (truncatedText.charAt(truncatedText.length - 1).match(/\.|,/)) {
      truncatedText = truncatedText.substr(0, truncatedText.length - 1);
    }

    truncatedText = truncatedText.trim() + "…";
  }

  return truncatedText;
}

export function capitalizeText(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function FinnishDate(date) {
  if (date instanceof Date === false) {
    date = new Date();
  }
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}

// https://stackoverflow.com/a/31415775/1317406
export function toQueryString(obj, urlEncode) {
  //
  // Helper function that flattens an object, retaining key structer as a path array:
  //
  // Input: { prop1: 'x', prop2: { y: 1, z: 2 } }
  // Example output: [
  //     { path: [ 'prop1' ],      val: 'x' },
  //     { path: [ 'prop2', 'y' ], val: '1' },
  //     { path: [ 'prop2', 'z' ], val: '2' }
  // ]
  //
  function flattenObj(x, path) {
    var result = [];

    path = path || [];
    Object.keys(x).forEach(function(key) {
      if (!x.hasOwnProperty(key)) return;

      var newPath = path.slice();
      newPath.push(key);

      var vals = [];
      if (typeof x[key] == "object") {
        vals = flattenObj(x[key], newPath);
      } else {
        vals.push({ path: newPath, val: x[key] });
      }
      vals.forEach(function(obj) {
        return result.push(obj);
      });
    });

    return result;
  } // flattenObj

  // start with  flattening `obj`
  var parts = flattenObj(obj); // [ { path: [ ...parts ], val: ... }, ... ]

  // convert to array notation:
  parts = parts.map(function(varInfo) {
    if (varInfo.path.length == 1) varInfo.path = varInfo.path[0];
    else {
      var first = varInfo.path[0];
      var rest = varInfo.path.slice(1);
      varInfo.path = first + "[" + rest.join("][") + "]";
    }
    return varInfo;
  }); // parts.map

  // join the parts to a query-string url-component
  var queryString = parts
    .map(function(varInfo) {
      return varInfo.path + "=" + varInfo.val;
    })
    .join("&");
  if (urlEncode) return encodeURIComponent(queryString);
  else return queryString;
}

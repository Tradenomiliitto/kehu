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

import $ from "jquery";

function initListeners() {
  $("#delete-kehu").click(function(event) {
    const message = "Haluatko varmasti poistaa kehun?";
    if (!confirm(message)) {
      event.preventDefault();
    }
  });
}

export function init() {
  initListeners();
}

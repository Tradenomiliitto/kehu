import $ from "jquery";
import "./vendor/tagsinput";
import Bloodhound from "./vendor/bloodhound";

const MINUTE_IN_MS = 60000;

const engine = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.whitespace,
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  prefetch: {
    url: "/api/v1/tags",
    ttl: MINUTE_IN_MS
  }
});

function initListeners() {
  const $tagsinput = $(".tagsinput");

  $tagsinput.tagsinput({
    trimValue: true,
    typeaheadjs: [
      {
        highlight: true
      },
      {
        name: "tags",
        source: engine
      }
    ]
  });

  $(".bootstrap-tagsinput").focusout(function() {
    const currentValue = $(this)
      .find(".tt-input")
      .val();
    if (currentValue) {
      $tagsinput.tagsinput("add", currentValue);
    }
  });
}

export function init() {
  initListeners();
}

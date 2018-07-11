import "../scss/style.scss";
import $ from "jquery";
import { init as initDatePicker } from "./datepicker";
import { init as initTypeahead } from "./typeahead";

$(function() {
  initDatePicker();
  initTypeahead();
});

import "../scss/style.scss";
import $ from "jquery";
import { init as initDatePicker } from "./datepicker";
import { init as initTypeahead } from "./typeahead";
import { init as initKehus } from "./kehu";

$(function() {
  initDatePicker();
  initTypeahead();
  initKehus();
});

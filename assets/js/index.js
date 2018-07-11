import "../scss/style.scss";
import $ from "jquery";
import "./vendor/tagsinput";
import { init as initDatePicker } from "./datepicker";

$(function() {
  initDatePicker();
});

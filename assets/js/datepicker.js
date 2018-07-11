import $ from "jquery";
import "bootstrap-datepicker";

function initLocales() {
  $.fn.datepicker.dates.fi = {
    days: [
      "sunnuntai",
      "maanantai",
      "tiistai",
      "keskiviikko",
      "torstai",
      "perjantai",
      "lauantai"
    ],
    daysShort: ["sun", "maa", "tii", "kes", "tor", "per", "lau"],
    daysMin: ["su", "ma", "ti", "ke", "to", "pe", "la"],
    months: [
      "tammikuu",
      "helmikuu",
      "maaliskuu",
      "huhtikuu",
      "toukokuu",
      "kesäkuu",
      "heinäkuu",
      "elokuu",
      "syyskuu",
      "lokakuu",
      "marraskuu",
      "joulukuu"
    ],
    monthsShort: [
      "tam",
      "hel",
      "maa",
      "huh",
      "tou",
      "kes",
      "hei",
      "elo",
      "syy",
      "lok",
      "mar",
      "jou"
    ],
    today: "tänään",
    clear: "Tyhjennä",
    weekStart: 1,
    format: "d.m.yyyy"
  };
}

function initListeners() {
  $("#date_given").datepicker({
    format: "d.m.yyyy",
    language: "fi"
  });
}

export function init() {
  initLocales();
  initListeners();
}

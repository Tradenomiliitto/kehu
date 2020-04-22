import React from "react";
import DatePicker from "react-datepicker";
import { useTranslation } from "react-i18next";

export default function DateGivenField({ value, handleChange, disabled }) {
  const [t, i18n] = useTranslation();
  return (
    <div className="Form-group DateGivenFieldContainer">
      <label htmlFor="date_given">
        {t("modals.add-kehu.datefield", "Päivämäärä:")}
      </label>
      <DatePicker
        id="date_given"
        className="DateGivenField"
        dateFormat="D. MMMM YYYY"
        dropdownMode="scroll"
        locale="fi-FI"
        disabled={disabled}
        selected={value}
        onChange={handleChange}
      />
    </div>
  );
}

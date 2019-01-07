import React from "react";
import DatePicker from "react-datepicker";

export default function DateGivenField({ value, handleChange, disabled }) {
  return (
    <div className="Form-group DateGivenFieldContainer">
      <label htmlFor="date_given">Päivämäärä:</label>
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

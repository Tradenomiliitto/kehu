import React from "react";

export default function TextField({ value, handleChange }) {
  return (
    <div className="Form-group KehuTextFieldContainer">
      <textarea
        id="text"
        className="KehuTextField"
        name="text"
        rows={7}
        placeholder="Hyvää työtä! Olet..."
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}

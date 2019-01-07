import React from "react";

export default function TextField({ value, handleChange, disabled }) {
  return (
    <div className="Form-group KehuTextFieldContainer">
      <textarea
        id="text"
        className="KehuTextField"
        name="text"
        rows={7}
        placeholder="Hyvää työtä! Olet..."
        disabled={disabled}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}

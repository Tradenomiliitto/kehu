import React from "react";

export default function GiverNameField({ value, handleChange, disabled }) {
  return (
    <div className="Form-group">
      <label htmlFor="giver_name">Minua kehui:</label>
      <input
        id="giver_name"
        name="giver_name"
        type="text"
        placeholder="Nimi"
        disabled={disabled}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}

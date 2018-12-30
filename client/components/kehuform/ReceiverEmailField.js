import React from "react";

export default function ReceiverEmailField({ value, handleChange }) {
  return (
    <div className="Form-group">
      <label htmlFor="receiver_email">Sähköpostiosoite:</label>
      <input
        id="receiver_email"
        name="receiver_email"
        type="email"
        placeholder="Sähköpostisoite"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}

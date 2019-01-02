import React from "react";

export default function ReceiverNameField({ value, handleChange, children }) {
  return (
    <div className="Form-group">
      <label htmlFor="receiver_name">Kehun saaja:</label>
      <input
        id="receiver_name"
        name="receiver_name"
        type="text"
        placeholder="Nimi"
        value={value}
        onChange={handleChange}
      />
      {children}
    </div>
  );
}

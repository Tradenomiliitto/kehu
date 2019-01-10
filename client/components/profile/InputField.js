import React from "react";

export default function InputField({
  name,
  label,
  placeholder,
  value,
  handleChange
}) {
  return (
    <div className="Form-group">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}

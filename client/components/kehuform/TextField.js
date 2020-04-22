import React from "react";
import { useTranslation } from "react-i18next";

export default function TextField({ value, handleChange, disabled }) {
  const [t, i18n] = useTranslation();
  return (
    <div className="Form-group KehuTextFieldContainer">
      <textarea
        id="text"
        className="KehuTextField"
        name="text"
        rows={7}
        placeholder={t(
          "modals.add-kehu.textfield-placeholder",
          "Hyvää työtä! Olet..."
        )}
        disabled={disabled}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}

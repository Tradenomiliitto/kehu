import React from "react";
import { useTranslation } from "react-i18next";

export default function GiverNameField({ value, handleChange, disabled }) {
  const [t, i18n] = useTranslation();
  return (
    <div className="Form-group">
      <label htmlFor="giver_name">
        {t("modals.add-kehu.kehu-giver-input", "Minua kehui:")}
      </label>
      <input
        id="giver_name"
        name="giver_name"
        type="text"
        placeholder={t("modals.add-kehu.kehu-giver-placeholder", "Nimi")}
        disabled={disabled}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}

import React from "react";
import { useTranslation } from "react-i18next";

export default function ReceiverNameField({ value, handleChange, children }) {
  const [t, i18n] = useTranslation();
  return (
    <div className="Form-group">
      <label htmlFor="receiver_name">
        {t("modals.send-kehu.receiver-name", "Kehun saaja")}:
      </label>
      <input
        id="receiver_name"
        name="receiver_name"
        type="text"
        placeholder={t("modals.send-kehu.receiver-name-placeholder", "Nimi")}
        value={value}
        onChange={handleChange}
      />
      {children}
    </div>
  );
}

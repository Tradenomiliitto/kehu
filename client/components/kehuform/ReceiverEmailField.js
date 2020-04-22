import React from "react";
import { useTranslation } from "react-i18next";

export default function ReceiverEmailField({ value, handleChange }) {
  const [t, i18n] = useTranslation();
  return (
    <div className="Form-group">
      <label htmlFor="receiver_email">
        {t("modals.send-kehu.receiver-email", "Sähköpostiosoite")}:
      </label>
      <input
        id="receiver_email"
        name="receiver_email"
        type="email"
        placeholder={t(
          "modals.send-kehu.receiver-email-placeholder",
          "Sähköpostisoite"
        )}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}

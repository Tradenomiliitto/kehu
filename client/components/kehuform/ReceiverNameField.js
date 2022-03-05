import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

export default function ReceiverNameField({ value, handleChange, children }) {
  const [t] = useTranslation();
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

ReceiverNameField.propTypes = {
  value: PropTypes.string,
  handleChange: PropTypes.func,
  children: PropTypes.node.isRequired,
};

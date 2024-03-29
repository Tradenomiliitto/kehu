import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

export default function GroupNameField({ value, handleChange, errorMessage }) {
  const [t] = useTranslation();
  return (
    <div className="Form-group">
      <label htmlFor="group_name">
        {t("modals.create-group.group-name-input", "Yhteisön nimi")}
      </label>
      <input
        id="group_name"
        name="group_name"
        type="text"
        placeholder={t("modals.create-group.group-name-placeholder", "Nimi")}
        value={value}
        onChange={handleChange}
      />
      {errorMessage && (
        <div className="GroupsPanel-ErrorMessage">{errorMessage}</div>
      )}
    </div>
  );
}

GroupNameField.propTypes = {
  value: PropTypes.string,
  handleChange: PropTypes.func,
  errorMessage: PropTypes.string,
};

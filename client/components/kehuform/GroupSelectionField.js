import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import ContactsToggle from "./ContactsToggle";

export default function GroupSelectionField({ value, handleChange }) {
  const groups = useSelector((state) => state.group.groups);
  const [t] = useTranslation();

  return (
    <div className="Form-group">
      <label htmlFor="group_name">
        {t("modals.send-kehu.group-name", "Kehun saajan yhteisö")}:
      </label>
      <input
        id="group_name"
        name="group_name"
        className="GroupSelectionInput"
        type="text"
        value={value}
        readOnly
      />
      <ContactsToggle
        contacts={[{ name: "-" }].concat(groups)}
        handleSelect={(value) => handleChange({ target: { value } })}
      />
    </div>
  );
}

GroupSelectionField.propTypes = {
  value: PropTypes.string,
  handleChange: PropTypes.func,
};

import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

export default function TextField({ value, handleChange, disabled }) {
  const [t] = useTranslation();
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

TextField.propTypes = {
  value: PropTypes.string,
  handleChange: PropTypes.func,
  disabled: PropTypes.bool,
};

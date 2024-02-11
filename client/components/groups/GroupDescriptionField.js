import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

export default function GroupDescriptionField({ value, handleChange }) {
  const [t] = useTranslation();
  return (
    <div className="Form-group">
      <label htmlFor="group_description">
        {t("modals.create-group.group-description-input", "Yhteisön kuvaus")}
        <div className="InviteMembersField-disclaimer">
          {t(
            "modals.create-group.group-description-input-fineprint",
            "Lyhyt kuvaus yhteisöstäsi - tämä näkyy julkisesti koko yhteisölle. Tsemppihenki ja hauskuus sallittuja!",
          )}
        </div>
      </label>
      <textarea
        id="group_description"
        name="group_description"
        rows="5"
        placeholder={t(
          "modals.create-group.group-description-placeholder",
          "Kirjoita kuvaus",
        )}
        value={value}
        onChange={handleChange}
      ></textarea>
    </div>
  );
}

GroupDescriptionField.propTypes = {
  value: PropTypes.string,
  handleChange: PropTypes.func,
};

import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

export function GroupNameInput({ value, setValue }) {
  const [t] = useTranslation();

  return (
    <div className="Form-group">
      <label htmlFor="groupName" className="GroupAdmin-SmallHeader">
        {t("groups.admin-view.group-name-input", "Yhteisön nimi")}:
      </label>
      <input
        className="GroupAdmin-GroupNameInput"
        id="groupName"
        name="groupName"
        type="text"
        value={value}
        onChange={(ev) => setValue(ev.target.value)}
      />
    </div>
  );
}

GroupNameInput.propTypes = {
  value: PropTypes.string,
  setValue: PropTypes.func.isRequired,
};

export function GroupDescriptionInput({ value, setValue }) {
  const [t] = useTranslation();
  const textareaRef = useRef();

  useEffect(() => {
    autoresize(textareaRef);
  }, []);

  return (
    <div className="Form-group">
      <label htmlFor="groupName" className="GroupAdmin-SmallHeader">
        {t(
          "groups.admin-view.group-description-input",
          "Yhteisön kuvaus (julkinen jäsenille)"
        )}
        :
      </label>
      <textarea
        className="GroupAdmin-GroupDescriptionInput"
        ref={textareaRef}
        id="groupName"
        name="groupName"
        rows={1}
        placeholder={t(
          "modals.create-group.group-description-placeholder",
          "Kirjoita kuvaus"
        )}
        value={value}
        onChange={(ev) => {
          autoresize(textareaRef);
          setValue(ev.target.value);
        }}
      ></textarea>
    </div>
  );
}

function autoresize(ref) {
  if (!ref) return;
  ref.current.style.height = "inherit";
  ref.current.style.height = `${ref.current.scrollHeight}px`;
}

GroupDescriptionInput.propTypes = {
  value: PropTypes.string,
  setValue: PropTypes.func.isRequired,
};

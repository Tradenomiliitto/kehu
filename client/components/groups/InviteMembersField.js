import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

export default function InviteMembersField({ value, handleChange }) {
  const [t] = useTranslation();
  const [inputValue, setInputValue] = useState("");
  const [addMemberError, setAddMemberError] = useState(null);
  const inputEl = useRef(null);

  const handleInputChange = ({ target: { value } }) => {
    setInputValue(value);
  };

  const handleRemoveClick = (item) => {
    return (ev) => {
      ev.preventDefault();
      const items = value.filter((it) => it !== item);
      handleChange(items);
    };
  };

  const addMember = (ev) => {
    ev.preventDefault();
    if (!inputEl.current.checkValidity()) {
      setAddMemberError(
        t("modals.create-group.invalid-email", "Virheellinen sähköposti")
      );
      return;
    }
    setAddMemberError(null);
    if (!inputValue) return;

    const items = [...new Set([...value, inputValue])];
    setInputValue("");
    handleChange(items);
  };

  return (
    <div className="Form-group">
      <label htmlFor="invite_members">
        {t(
          "modals.create-group.invite-members-input",
          "Kutsu jäseniä yhteisöön"
        )}
        <div className="InviteMembersField-disclaimer">
          {t(
            "modals.create-group.invite-members-input-fineprint",
            `Kirjoita henkilön sähköpostiosoite ja klikkaa "Lisää" kun haluat lisätä seuraavan jäsenen. Kaikki kutsut lähetetään vasta seuraavassa vaiheessa, kun yhteisö on valmis. `
          )}
        </div>
      </label>
      <input
        className="InviteMembersField-input"
        id="invite_members"
        name="invite_members"
        ref={inputEl}
        type="email"
        placeholder={t(
          "modals.create-group.invite-members-placeholder",
          "elli.esimerkki@yritys.com"
        )}
        value={inputValue}
        onChange={handleInputChange}
      />
      <button className="Button" onClick={addMember}>
        {t("modals.create-group.add-member-btn", "Lisää")}
      </button>
      {addMemberError && (
        <div className="InviteMembersField-incorrectEmail">
          {addMemberError}
        </div>
      )}
      {renderItems(value, handleRemoveClick)}
    </div>
  );
}

InviteMembersField.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
  handleChange: PropTypes.func,
};

function renderItems(values, handleRemoveClick) {
  return values.map((item) => {
    return (
      <div className="InviteMembersField-addedEmail item-js" key={item}>
        {item}
        <button
          className="InviteMembersField-removeEmailBtn"
          onClick={handleRemoveClick(item)}
        >
          &#10005;
        </button>
      </div>
    );
  });
}

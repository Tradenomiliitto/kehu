import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import cn from "classnames";

export default function VisibilitySelection({
  isPrivate,
  isReceiverGroup,
  handleChange,
}) {
  const [t] = useTranslation();

  // By default neither button is selected
  let selection = { public: undefined, private: undefined };
  if (isReceiverGroup) selection = { public: "selected", private: "frozen" };
  else if (isPrivate === true)
    selection = { public: "disabled", private: "selected" };
  else if (isPrivate === false)
    selection = { public: "selected", private: "disabled" };

  function handleClick(newIsPrivateStatus) {
    return (ev) => {
      ev.preventDefault();
      if (isReceiverGroup) return;
      handleChange(newIsPrivateStatus);
    };
  }

  return (
    <div className="VisibilitySelector">
      <VisibilityButton
        icon={"/images/icon-view.png"}
        title={t("modals.send-kehu.visibility-public", "Julkinen kehu")}
        info={t(
          "modals.send-kehu.visibility-public-description",
          "Kehu näytetään myös yhteisönne jäsenille"
        )}
        selection={selection.public}
        handleClick={handleClick(isPrivate === false ? null : false)}
      />
      <VisibilityButton
        icon={"/images/icon-padlock.png"}
        title={t("modals.send-kehu.visibility-private", "Yksityinen kehu")}
        info={t(
          "modals.send-kehu.visibility-private-description",
          "Vain vastaanottaja näkee kehun."
        )}
        selection={selection.private}
        handleClick={handleClick(isPrivate === true ? null : true)}
      />
    </div>
  );
}

VisibilitySelection.propTypes = {
  isPrivate: PropTypes.bool,
  isReceiverGroup: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
};

function VisibilityButton({ icon, title, info, selection, handleClick }) {
  const buttonClass = cn({
    "VisibilitySelector-button": true,
    "VisibilitySelector-button--selected": selection === "selected",
    "VisibilitySelector-button--disabled": selection === "disabled",
    "VisibilitySelector-button--frozen": selection === "frozen",
  });

  return (
    <button className={buttonClass} onClick={handleClick}>
      <img src={icon} className="VisibilitySelector-image" />
      <h3>{title}</h3>
      <p>{info}</p>
    </button>
  );
}

VisibilityButton.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  info: PropTypes.string.isRequired,
  selection: PropTypes.string,
  handleClick: PropTypes.func.isRequired,
};

import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import cn from "classnames";

export default function VisibilitySelection({ isPrivate, handleChange }) {
  const [t] = useTranslation();

  function handleClick(newIsPrivateStatus) {
    return (ev) => {
      ev.preventDefault();
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
        isSelected={isPrivate == null ? null : isPrivate === false}
        handleClick={handleClick(isPrivate === false ? null : false)}
      />
      <VisibilityButton
        icon={"/images/icon-padlock.png"}
        title={t("modals.send-kehu.visibility-private", "Yksityinen kehu")}
        info={t(
          "modals.send-kehu.visibility-private-description",
          "Vain vastaanottaja näkee kehun."
        )}
        isSelected={isPrivate == null ? null : isPrivate === true}
        handleClick={handleClick(isPrivate === true ? null : true)}
      />
    </div>
  );
}

VisibilitySelection.propTypes = {
  isPrivate: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
};

function VisibilityButton({ icon, title, info, isSelected, handleClick }) {
  const buttonClass = cn({
    "VisibilitySelector-button": true,
    "VisibilitySelector-button--selected": isSelected === true,
    "VisibilitySelector-button--disabled": isSelected === false,
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
  isSelected: PropTypes.bool,
  handleClick: PropTypes.func.isRequired,
};

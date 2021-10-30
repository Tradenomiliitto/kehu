import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const DEFAULT_GROUP_PICTURES = [
  "/images/role-alainen-active.svg",
  "/images/role-asiakas-active.svg",
  "/images/role-kaveri-active.svg",
  "/images/role-kollega-active.svg",
  "/images/role-lahipiiri-active.svg",
  "/images/role-mina-itse-active.svg",
  "/images/role-muu-active.svg",
  "/images/role-opettaja-active.svg",
  "/images/role-pomo-active.svg",
];

export default function GroupPictureField({ setPictureUrl }) {
  const [t] = useTranslation();
  const [selectedPicture, setSelectedPicture] = useState(null);

  let defaultPictures = [];
  for (let i = 0; i < 12; i++)
    defaultPictures.push(
      <GroupPicture
        key={i}
        id={i}
        url={DEFAULT_GROUP_PICTURES[i % DEFAULT_GROUP_PICTURES.length]}
        handleClick={handleClick}
        isSelected={i === selectedPicture}
      />
    );

  return (
    <div className="Form-group">
      <label htmlFor="group_name">
        {t(
          "modals.create-group.group-picture",
          "Valitse tai lisää yhteisön profiilikuva"
        )}
      </label>
      <button
        className="AddGroupPicture"
        type="button"
        onClick={() => handleClick("custom", -1)}
      >
        <div className="PlusSign">+</div>
        Lisää kuva
      </button>
      <div className="GroupPictures">{defaultPictures}</div>
    </div>
  );

  function handleClick(url, key) {
    if (selectedPicture === key) {
      setPictureUrl(null);
      setSelectedPicture(null);
      return;
    }
    setPictureUrl(url);
    setSelectedPicture(key);
  }
}

GroupPictureField.propTypes = {
  setPictureUrl: PropTypes.func.isRequired,
};

function GroupPicture({ id, url, handleClick, isSelected }) {
  return (
    <button
      className={"GroupPicture" + (isSelected ? " Selected" : "")}
      type="button"
      onClick={() => handleClick(url, id)}
    >
      <img className="GroupPicture-image" src={url} />
    </button>
  );
}

GroupPicture.propTypes = {
  id: PropTypes.number.isRequired,
  url: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
};

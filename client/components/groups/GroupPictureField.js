import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";

import { uploadWidget } from "../../util/uploadWidget";

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

export default function GroupPictureField({ value, handleChange }) {
  const [t, i18n] = useTranslation();
  const { selectedPicture, userPictureUrl } = value;

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
        onClick={() =>
          uploadWidget("temp_group_" + uuidv4(), i18n.language, pictureUploadCb)
        }
      >
        <div className="PlusSign">+</div>
        Lisää kuva
      </button>
      {userPictureUrl && (
        <GroupPicture
          id={-1}
          url={userPictureUrl}
          handleClick={handleClick}
          isSelected={selectedPicture === -1}
        />
      )}
      <div className="GroupPictures">{defaultPictures}</div>
    </div>
  );

  function updateState(newState) {
    handleChange({ ...value, ...newState });
  }

  function handleClick(url, key) {
    // Deselect group picture when clicking already selected picture
    if (selectedPicture === key) {
      url = null;
      key = null;
    }
    updateState({ url, selectedPicture: key });
  }

  async function pictureUploadCb(url) {
    if (url != null) {
      updateState({ userPictureUrl: url });
    }
  }
}

GroupPictureField.propTypes = {
  value: PropTypes.shape({
    url: PropTypes.string,
    selectedPicture: PropTypes.number,
    userPictureUrl: PropTypes.string,
  }),
  handleChange: PropTypes.func.isRequired,
};

function GroupPicture({ id, url, handleClick, isSelected }) {
  return (
    <button
      className={"GroupPicture" + (isSelected ? " Selected" : "")}
      type="button"
      onClick={() => handleClick(url, id)}
      style={
        /* HACK: remove this when real default group button received
         */ id >= 0
          ? {
              padding: "15px",
              border: "1px solid $dark-grey",
              backgroundColor: "#cfcfcf",
            }
          : {}
      }
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

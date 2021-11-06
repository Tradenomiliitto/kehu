import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import Spinner from "../Spinner";

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
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
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
      <AddGroupPictureButton
        isUploadingPicture={isUploadingPicture}
        uploadPicture={uploadPicture}
      />
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

  function uploadPicture() {
    setIsUploadingPicture(true);
    uploadWidget("temp_group_" + uuidv4(), i18n.language, pictureUploadCb);
  }

  async function pictureUploadCb(url) {
    setIsUploadingPicture(false);
    if (url != null) {
      updateState({ url, userPictureUrl: url, selectedPicture: -1 });
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
      className={
        "GroupPicture" +
        (isSelected ? " Selected" : "") +
        (id >= 0 ? " GroupPictureHack" : "")
      }
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

function AddGroupPictureButton({ isUploadingPicture, uploadPicture }) {
  const [t] = useTranslation();

  return (
    <button className="AddGroupPicture" type="button" onClick={uploadPicture}>
      {isUploadingPicture ? (
        <Spinner customClassName="" options={{ size: 40 }} />
      ) : (
        <>
          <div className="PlusSign">+</div>
          {t("modals.create-group.add-group-picture", "Lisää kuva")}
        </>
      )}
    </button>
  );
}

AddGroupPictureButton.propTypes = {
  isUploadingPicture: PropTypes.bool.isRequired,
  uploadPicture: PropTypes.func.isRequired,
};

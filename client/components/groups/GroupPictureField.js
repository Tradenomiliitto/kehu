import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import Spinner from "../Spinner";

import { uploadWidget } from "../../util/uploadWidget";

const DEFAULT_GROUP_PICTURES = [
  "/images/avatars/alykot.png",
  "/images/avatars/kahvittelijat.png",
  "/images/avatars/makeanhimoiset.png",
  "/images/avatars/nortit.png",
  "/images/avatars/urheilulliset.png",
];
export const USER_PICTURE = -1;

export default function GroupPictureField({
  value,
  handleChange,
  errorMessage,
  userId,
}) {
  const [t, i18n] = useTranslation();
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const { selectedPicture, userPictureUrl } = value;

  const defaultPictures = DEFAULT_GROUP_PICTURES.map((pictureURl, idx) => (
    <GroupPicture
      key={idx}
      id={idx}
      url={pictureURl}
      handleClick={handleClick}
      isSelected={idx === selectedPicture}
    />
  ));

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
          id={USER_PICTURE}
          url={userPictureUrl}
          handleClick={handleClick}
          isSelected={selectedPicture === USER_PICTURE}
        />
      )}
      <div className="GroupPictures">{defaultPictures}</div>
      {errorMessage && (
        <div className="GroupsPanel-ErrorMessage">{errorMessage}</div>
      )}
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
    uploadWidget("create_group_" + userId, i18n.language, pictureUploadCb);
  }

  async function pictureUploadCb(url, publicId) {
    setIsUploadingPicture(false);
    if (url != null) {
      updateState({
        url,
        userPictureUrl: url,
        selectedPicture: USER_PICTURE,
        cloudinaryPublicId: publicId,
      });
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
  errorMessage: PropTypes.string,
  userId: PropTypes.string,
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

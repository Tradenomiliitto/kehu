import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import Portal from "../Portal";
import KehuFormModal from "../KehuFormModal";
import { updateGroup } from "../../redux/group";
import { FormattedErrorPanel } from "../ErrorPanel";
import GroupPictureField, { USER_PICTURE } from "./GroupPictureField";

export function ChangeGroupPictureModal({ closeModal, groupId }) {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const error = useSelector((state) => state.group.error);
  const userAuth0Id = useSelector((state) => state.profile.profile.auth0_id);

  const [groupPicture, setGroupPicture] = useState({
    url: "",
    selectedPicture: null,
    userPictureUrl: null,
    cloudinaryPublicId: null,
  });

  const changePicture = (ev) => {
    const newData = { id: groupId };
    if (groupPicture.selectedPicture === USER_PICTURE)
      newData.cloudinaryPublicId = groupPicture.cloudinaryPublicId;
    else newData.picture = groupPicture.url;

    dispatch(updateGroup(newData, { cb: closeModal }));
    ev.target.blur();
  };

  return (
    <Portal>
      <KehuFormModal title="&nbsp;" closeModal={closeModal}>
        <GroupPictureField
          value={groupPicture}
          handleChange={setGroupPicture}
          userId={userAuth0Id}
        />

        <div className="GroupAdmin-AddMemberButtons">
          <button className="Button Button--inverse" onClick={closeModal}>
            {t("groups.admin-view.cancel-btn", "Peruuta")}
          </button>
          <button
            className="Button Button--fullWidth"
            onClick={changePicture}
            disabled={groupPicture.selectedPicture === null}
          >
            {t("groups.admin-view.change-picture", "Vaihda kuva")}
          </button>
        </div>
        <FormattedErrorPanel
          error={error}
          genericMessage={t(
            "groups.admin-view.picture-change-failed",
            "Kuvan vaihtaminen epäonnistui"
          )}
        />
      </KehuFormModal>
    </Portal>
  );
}

ChangeGroupPictureModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  groupId: PropTypes.number.isRequired,
};

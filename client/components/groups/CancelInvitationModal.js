import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import Portal from "../Portal";
import KehuFormModal from "../KehuFormModal";
import { deleteInvitation } from "../../redux/group";
import { FormattedErrorPanel } from "../ErrorPanel";
import { invitationPropType } from "../../util/PropTypes";

export function CancelInvitationModal({ closeModal, invitation }) {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const error = useSelector((state) => state.group.error);

  const removeUserFromAdmins = (ev) => {
    dispatch(deleteInvitation(invitation.group_id, invitation.id, closeModal));
    ev.target.blur();
  };

  return (
    <Portal>
      <KehuFormModal title="&nbsp;" closeModal={closeModal}>
        <div className="GroupAdmin-TextSpacing">
          {t(
            "groups.admin-view.cancel-invitation1",
            "Olet perumassa käyttäjän",
          )}
        </div>
        <div className="GroupAdmin-TextSpacing GroupAdmin-User">
          {invitation.email}
        </div>
        <div className="GroupAdmin-TextSpacing">
          {t("groups.admin-view.cancel-invitation2", "kutsun yhteisöön")}.
        </div>
        <div className="GroupAdmin-AddMemberButtons">
          <button className="Button Button--inverse" onClick={closeModal}>
            {t("groups.admin-view.cancel-btn", "Peruuta")}
          </button>
          <button
            className="Button Button--fullWidth"
            onClick={removeUserFromAdmins}
          >
            {t("groups.admin-view.cancel-invitation-btn", "Peru kutsu")}
          </button>
        </div>
        <FormattedErrorPanel
          error={error}
          genericMessage={t(
            "groups.admin-view.cancel-invitation-failed",
            "Jäsenen kutsun peruminen epäonnistui",
          )}
        />
      </KehuFormModal>
    </Portal>
  );
}

CancelInvitationModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  invitation: invitationPropType.isRequired,
};

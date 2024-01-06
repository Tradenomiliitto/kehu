import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import Portal from "../Portal";
import KehuFormModal from "../KehuFormModal";
import { inviteGroupMembers } from "../../redux/group";
import InviteMembersField from "./InviteMembersField";
import { FormattedErrorPanel } from "../ErrorPanel";

export function AddNewMembersModal({ closeModal, groupId }) {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const error = useSelector((state) => state.group.error);
  const [members, setMembers] = useState([]);

  const sendInvites = (ev) => {
    dispatch(inviteGroupMembers(groupId, members, closeModal));
    ev.target.blur();
  };

  return (
    <Portal>
      <KehuFormModal title="&nbsp;" closeModal={closeModal}>
        <InviteMembersField
          value={members}
          handleChange={setMembers}
          isInEdit={true}
        />
        <div className="GroupAdmin-AddMemberButtons">
          <button className="Button Button--inverse" onClick={closeModal}>
            {t("groups.admin-view.cancel-btn", "Peruuta")}
          </button>
          <button
            className="Button Button--fullWidth"
            onClick={sendInvites}
            disabled={members.length === 0}
          >
            {t("groups.admin-view.send-invites-btn", "Lähetä kutsut")}
          </button>
        </div>
        <FormattedErrorPanel
          error={error}
          genericMessage={t(
            "groups.admin-view.member-invite-failed",
            "Jäsenten kutsuminen epäonnistui",
          )}
        />
      </KehuFormModal>
    </Portal>
  );
}

AddNewMembersModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  groupId: PropTypes.number.isRequired,
};

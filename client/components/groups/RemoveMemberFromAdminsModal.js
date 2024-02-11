import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import Portal from "../Portal";
import KehuFormModal from "../KehuFormModal";
import { updateGroupMember } from "../../redux/group";
import ErrorPanel, { FormattedErrorPanel } from "../ErrorPanel";

export function RemoveMemberFromAdminsModal({ closeModal, member, groupId }) {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const error = useSelector((state) => state.group.error);

  const removeUserFromAdmins = (ev) => {
    dispatch(updateGroupMember(groupId, member.id, false, closeModal));
    ev.target.blur();
  };

  return (
    <Portal>
      <KehuFormModal title="&nbsp;" closeModal={closeModal}>
        <div className="GroupAdmin-TextSpacing">
          {t(
            "groups.admin-view.remove-from-admins1",
            "Olet poistamassa käyttäjän",
          )}
        </div>
        <div className="GroupAdmin-TextSpacing GroupAdmin-User">
          {member.first_name} {member.last_name}
          <br />
          {member.email}
        </div>
        <div className="GroupAdmin-TextSpacing">
          {t("groups.admin-view.remove-from-admins2", "yhteisön admineista")}.
        </div>
        <div className="GroupAdmin-TextSpacing">
          {t(
            "groups.admin-view.remove-from-admins10",
            "Käyttäjästä tulee yhteisön tavallinen jäsen.",
          )}
        </div>
        <div className="GroupAdmin-AddMemberButtons">
          <button className="Button Button--inverse" onClick={closeModal}>
            {t("groups.admin-view.cancel-btn", "Peruuta")}
          </button>
          <button
            className="Button Button--fullWidth"
            onClick={removeUserFromAdmins}
          >
            {t("groups.admin-view.remove-from-admins-btn", "Poista admineista")}
          </button>
        </div>
        {error?.responseJson?.type === "LAST_ADMIN_ERROR" ? (
          <ErrorPanel
            message={t(
              "groups.admin-view.remove-last-admin-error",
              "Yhteisön viimeistä admin-käyttäjää ei voi poistaa.",
            )}
          />
        ) : (
          <FormattedErrorPanel
            error={error}
            genericMessage={t(
              "groups.admin-view.remove-from-admins-failed",
              "Jäsenen poistaminen admineista epäonnistui",
            )}
          />
        )}
      </KehuFormModal>
    </Portal>
  );
}

RemoveMemberFromAdminsModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  member: PropTypes.object.isRequired,
  groupId: PropTypes.number.isRequired,
};

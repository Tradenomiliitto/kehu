import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import Portal from "../Portal";
import KehuFormModal from "../KehuFormModal";
import { removeGroupMember, resetGroupErrors } from "../../redux/group";
import ErrorPanel, { FormattedErrorPanel } from "../ErrorPanel";

export function LeaveGroupModal({ closeModal, memberId, groupId, groupName }) {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const error = useSelector((state) => state.group.error);

  const removeUser = (ev) => {
    dispatch(removeGroupMember(groupId, memberId, closeModal));
    ev.target.blur();
  };

  const closeModalAndClearErrors = useCallback(() => {
    closeModal();
    dispatch(resetGroupErrors());
  }, [closeModal, dispatch]);

  return (
    <Portal>
      <KehuFormModal title="&nbsp;" closeModal={closeModalAndClearErrors}>
        <div className="GroupAdmin-TextSpacing">
          {t("groups.leave-group-modal.text-1", "Olet poistumassa yhteisöstä")}
        </div>
        <div className="GroupAdmin-TextSpacing GroupAdmin-User">
          {groupName}
        </div>
        <div className="GroupAdmin-TextSpacing">
          {t("groups.leave-group-modal.text-2", "Poistuttuasi yhteisöstä")}
          <ul>
            <li>
              {t(
                "groups.leave-group-modal.text-3",
                "näet edelleen yhteisön kehut, jotka annettiin ollessasi jäsen",
              )}
            </li>
            <li>
              {t(
                "groups.leave-group-modal.text-4",
                "näet yhteisön sisällä sinulle annetut kehut",
              )}
            </li>
            <li>
              {t(
                "groups.leave-group-modal.text-5",
                "et näe tästä hetkestä eteenpäin mitään, mitä yhteisössä tapahtuu",
              )}
            </li>
            <li>
              {t(
                "groups.leave-group-modal.text-6",
                "et näe aiempia yhteisön sisällä jäseneltä toiselle annettuja kehuja, joissa et itse ole osallisena",
              )}
            </li>
          </ul>
        </div>
        <div className="GroupAdmin-AddMemberButtons">
          <button
            className="Button Button--inverse"
            onClick={closeModalAndClearErrors}
          >
            {t("groups.leave-group-modal.cancel-btn", "Peruuta")}
          </button>
          <button className="Button Button--fullWidth" onClick={removeUser}>
            {t("groups.leave-group-modal.btn", "Poistu yhteisöstä")}
          </button>
        </div>
        {error?.responseJson?.type === "LAST_ADMIN_ERROR" ? (
          <ErrorPanel
            message={t(
              "groups.leave-group-modal.remove-last-admin-error",
              "Yhteisön viimeinen admin-käyttäjä ei voi poistua.",
            )}
          />
        ) : (
          <FormattedErrorPanel
            error={error}
            genericMessage={t(
              "groups.leave-group-modal.failed",
              "Yhteisöstä poistuminen epäonnistui",
            )}
          />
        )}
      </KehuFormModal>
    </Portal>
  );
}

LeaveGroupModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  memberId: PropTypes.number.isRequired,
  groupId: PropTypes.number.isRequired,
  groupName: PropTypes.string.isRequired,
};
